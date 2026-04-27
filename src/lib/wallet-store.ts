// Wallet store — supports real MetaMask + demo accounts. Persists to localStorage.
const KEY = "tam.wallet.v1";

export type WalletProvider = "metamask" | "demo";

export interface Wallet {
  address: string;
  label: string;
  connectedAt: number;
  provider: WalletProvider;
  chainId?: string;
}

// Polygon mainnet
export const POLYGON_CHAIN = {
  chainId: "0x89", // 137
  chainName: "Polygon Mainnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
} as const;

// EIP-1193 minimal type
interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function hasMetaMask(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

function getEth(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export class WalletError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export async function connectMetaMask(): Promise<Wallet> {
  const eth = getEth();
  if (!eth) throw new WalletError("MetaMask is not installed.", "no_provider");

  let accounts: string[] = [];
  try {
    accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  } catch (e) {
    const err = e as { code?: number; message?: string };
    if (err?.code === 4001) throw new WalletError("Connection request was rejected.", "user_rejected");
    throw new WalletError(err?.message ?? "Failed to connect MetaMask.", "request_failed");
  }
  if (!accounts?.[0]) throw new WalletError("No accounts returned by wallet.", "no_account");

  // Best-effort chain switch to Polygon — non-fatal if rejected.
  let chainId: string | undefined;
  try {
    chainId = (await eth.request({ method: "eth_chainId" })) as string;
    if (chainId !== POLYGON_CHAIN.chainId) {
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: POLYGON_CHAIN.chainId }],
        });
        chainId = POLYGON_CHAIN.chainId;
      } catch (switchErr) {
        const sErr = switchErr as { code?: number };
        if (sErr?.code === 4902) {
          try {
            await eth.request({
              method: "wallet_addEthereumChain",
              params: [POLYGON_CHAIN],
            });
            chainId = POLYGON_CHAIN.chainId;
          } catch {
            // user rejected add — keep current chain
          }
        }
      }
    }
  } catch {
    // ignore — chain detection optional
  }

  const address = accounts[0];
  const w: Wallet = {
    address,
    label: "MetaMask",
    connectedAt: Date.now(),
    provider: "metamask",
    chainId,
  };
  persist(w);
  attachMetaMaskListeners();
  return w;
}

let listenersAttached = false;
function attachMetaMaskListeners() {
  if (listenersAttached) return;
  const eth = getEth();
  if (!eth?.on) return;
  listenersAttached = true;
  eth.on("accountsChanged", (...args: unknown[]) => {
    const accounts = args[0] as string[] | undefined;
    const current = getWallet();
    if (!current || current.provider !== "metamask") return;
    if (!accounts || accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0].toLowerCase() !== current.address.toLowerCase()) {
      persist({ ...current, address: accounts[0], connectedAt: Date.now() });
    }
  });
  eth.on("chainChanged", (...args: unknown[]) => {
    const chainId = args[0] as string;
    const current = getWallet();
    if (!current || current.provider !== "metamask") return;
    persist({ ...current, chainId });
  });
}

function persist(w: Wallet) {
  localStorage.setItem(KEY, JSON.stringify(w));
  cache = w;
  listeners.forEach((l) => l());
}

export const DEMO_ACCOUNTS: { address: string; label: string; balance: string }[] = [
  { address: "0x4A7c1bD9e6E2af3128f53d901a4d9b81fA7c83e1", label: "Trainer alpha", balance: "12.84 MATIC" },
  { address: "0x9F2eC8B0e3A1d8C5f7B6a4E9D2cF1a8B0e3A1d8C", label: "Whale wallet", balance: "1,402.10 MATIC" },
  { address: "0x1aB2c3D4e5F60718293a4b5c6d7e8f9A0B1c2D3E", label: "Burner #003", balance: "0.42 MATIC" },
];

let cache: Wallet | null | undefined;
const listeners = new Set<() => void>();

export function getWallet(): Wallet | null {
  if (cache !== undefined) return cache;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Wallet) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function connectWallet(address: string, label: string): Wallet {
  const w: Wallet = { address, label, connectedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(w));
  cache = w;
  listeners.forEach((l) => l());
  return w;
}

export function disconnectWallet() {
  localStorage.removeItem(KEY);
  cache = null;
  listeners.forEach((l) => l());
}

export function subscribeWallet(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
