// Wallet store — supports MetaMask, Coinbase Wallet, and demo accounts.
// Persists to localStorage; broadcasts updates via subscribeWallet.
// Hardened: timeouts, retries, multi-provider disambiguation, dual-network
// (Polygon Mainnet + Polygon Amoy testnet), live account/chain listeners.
const KEY = "tam.wallet.v1";

export type WalletProvider = "metamask" | "coinbase" | "walletconnect" | "demo";

export interface Wallet {
  address: string;
  label: string;
  connectedAt: number;
  provider: WalletProvider;
  chainId?: string;
}

// --- Networks --------------------------------------------------------------
export const POLYGON_MAINNET = {
  chainId: "0x89", // 137
  chainName: "Polygon Mainnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
} as const;

export const POLYGON_AMOY = {
  chainId: "0x13882", // 80002
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
} as const;

export const SUPPORTED_CHAINS = [POLYGON_MAINNET.chainId, POLYGON_AMOY.chainId] as string[];

export function isSupportedChain(chainId?: string): boolean {
  return !!chainId && SUPPORTED_CHAINS.includes(chainId);
}

export function chainLabel(chainId?: string): string {
  if (!chainId) return "unknown";
  if (chainId === POLYGON_MAINNET.chainId) return "Polygon Mainnet";
  if (chainId === POLYGON_AMOY.chainId) return "Polygon Amoy";
  return `chain ${parseInt(chainId, 16)}`;
}

// --- EIP-1193 minimal types ------------------------------------------------
export interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  providers?: Eip1193Provider[];
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
    coinbaseWalletExtension?: Eip1193Provider;
  }
}

// --- Provider detection ----------------------------------------------------
export interface ProviderInfo {
  id: WalletProvider;
  name: string;
  available: boolean;
  installUrl?: string;
}

export function detectProviders(): ProviderInfo[] {
  if (typeof window === "undefined") {
    return [
      { id: "metamask", name: "MetaMask", available: false, installUrl: "https://metamask.io/download/" },
      { id: "coinbase", name: "Coinbase Wallet", available: false, installUrl: "https://www.coinbase.com/wallet/downloads" },
      { id: "walletconnect", name: "WalletConnect", available: false },
    ];
  }
  const eth = window.ethereum;
  const providers: Eip1193Provider[] = eth?.providers ?? (eth ? [eth] : []);
  const hasMM = providers.some((p) => p.isMetaMask) || !!window.ethereum?.isMetaMask;
  const hasCB =
    providers.some((p) => p.isCoinbaseWallet) ||
    !!window.coinbaseWalletExtension ||
    !!window.ethereum?.isCoinbaseWallet;
  return [
    {
      id: "metamask",
      name: "MetaMask",
      available: hasMM,
      installUrl: hasMM ? undefined : "https://metamask.io/download/",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      available: hasCB,
      installUrl: hasCB ? undefined : "https://www.coinbase.com/wallet/downloads",
    },
    // WalletConnect requires a project ID + the SDK; surfaced as "coming soon"
    // in the modal so users see the option but it doesn't crash.
    { id: "walletconnect", name: "WalletConnect", available: false },
  ];
}

export function hasMetaMask(): boolean {
  return detectProviders().find((p) => p.id === "metamask")?.available ?? false;
}

function pickProvider(target: WalletProvider): Eip1193Provider | null {
  if (typeof window === "undefined") return null;
  const eth = window.ethereum;
  if (!eth && target !== "coinbase") return null;
  const list: Eip1193Provider[] = eth?.providers?.length ? eth.providers : eth ? [eth] : [];
  if (target === "metamask") {
    return list.find((p) => p.isMetaMask) ?? (eth?.isMetaMask ? eth : null);
  }
  if (target === "coinbase") {
    return (
      list.find((p) => p.isCoinbaseWallet) ??
      window.coinbaseWalletExtension ??
      (eth?.isCoinbaseWallet ? eth : null)
    );
  }
  return null;
}

// --- Errors ----------------------------------------------------------------
export type WalletErrorCode =
  | "no_provider"
  | "user_rejected"
  | "request_failed"
  | "no_account"
  | "wrong_chain"
  | "switch_failed"
  | "add_chain_failed"
  | "timeout"
  | "locked";

export class WalletError extends Error {
  code: WalletErrorCode;
  constructor(message: string, code: WalletErrorCode) {
    super(message);
    this.code = code;
  }
}

// --- Helpers: timeout + retry ----------------------------------------------
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(
      () => reject(new WalletError(`${label} timed out after ${ms}ms`, "timeout")),
      ms,
    );
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

// --- Connect ---------------------------------------------------------------
export interface ConnectOptions {
  /** Default Polygon Mainnet. Pass POLYGON_AMOY.chainId for testnet. */
  preferredChainId?: string;
  /** ms; default 30s for the signature popup. */
  timeoutMs?: number;
}

async function requestAccounts(prov: Eip1193Provider, timeoutMs: number): Promise<string[]> {
  try {
    return (await withTimeout(
      prov.request({ method: "eth_requestAccounts" }),
      timeoutMs,
      "Wallet approval",
    )) as string[];
  } catch (e) {
    if (e instanceof WalletError) throw e;
    const err = e as { code?: number; message?: string };
    if (err?.code === 4001) throw new WalletError("Connection request was rejected.", "user_rejected");
    if (err?.code === -32002)
      throw new WalletError(
        "A connection request is already pending. Open your wallet to continue.",
        "locked",
      );
    throw new WalletError(err?.message ?? "Failed to connect wallet.", "request_failed");
  }
}

async function ensureChain(
  prov: Eip1193Provider,
  preferred: string,
): Promise<string | undefined> {
  let chainId: string | undefined;
  try {
    chainId = (await prov.request({ method: "eth_chainId" })) as string;
  } catch {
    return undefined;
  }
  if (chainId === preferred) return chainId;
  try {
    await prov.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: preferred }],
    });
    return preferred;
  } catch (e) {
    const err = e as { code?: number };
    if (err?.code === 4902) {
      // Chain not in wallet — try to add it.
      const cfg = preferred === POLYGON_AMOY.chainId ? POLYGON_AMOY : POLYGON_MAINNET;
      try {
        await prov.request({ method: "wallet_addEthereumChain", params: [cfg] });
        return preferred;
      } catch {
        return chainId; // return current; caller may show wrong-chain banner
      }
    }
    return chainId;
  }
}

export async function connectMetaMask(opts: ConnectOptions = {}): Promise<Wallet> {
  return connectInjected("metamask", "MetaMask", opts);
}

export async function connectCoinbase(opts: ConnectOptions = {}): Promise<Wallet> {
  return connectInjected("coinbase", "Coinbase Wallet", opts);
}

async function connectInjected(
  provider: "metamask" | "coinbase",
  label: string,
  opts: ConnectOptions,
): Promise<Wallet> {
  const prov = pickProvider(provider);
  if (!prov) throw new WalletError(`${label} is not installed.`, "no_provider");
  const timeout = opts.timeoutMs ?? 30_000;
  const accounts = await requestAccounts(prov, timeout);
  if (!accounts?.[0]) throw new WalletError("No accounts returned by wallet.", "no_account");
  const chainId = await ensureChain(prov, opts.preferredChainId ?? POLYGON_MAINNET.chainId);
  const w: Wallet = {
    address: accounts[0],
    label,
    connectedAt: Date.now(),
    provider,
    chainId,
  };
  persist(w);
  attachLiveListeners(prov, provider);
  return w;
}

/** Programmatic chain switch (e.g. user clicks "Switch to Polygon"). */
export async function switchToChain(targetChainId: string): Promise<string | undefined> {
  const current = getWallet();
  if (!current || current.provider === "demo") return current?.chainId;
  const prov = pickProvider(current.provider as "metamask" | "coinbase");
  if (!prov) throw new WalletError("Wallet provider unavailable.", "no_provider");
  const newChain = await ensureChain(prov, targetChainId);
  if (newChain && newChain !== current.chainId) {
    persist({ ...current, chainId: newChain });
  }
  return newChain;
}

// --- Live listeners --------------------------------------------------------
const attachedFor = new Set<WalletProvider>();
function attachLiveListeners(prov: Eip1193Provider, provider: WalletProvider) {
  if (attachedFor.has(provider)) return;
  if (!prov.on) return;
  attachedFor.add(provider);
  prov.on("accountsChanged", (...args: unknown[]) => {
    const accounts = args[0] as string[] | undefined;
    const current = getWallet();
    if (!current || current.provider !== provider) return;
    if (!accounts || accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0].toLowerCase() !== current.address.toLowerCase()) {
      persist({ ...current, address: accounts[0], connectedAt: Date.now() });
    }
  });
  prov.on("chainChanged", (...args: unknown[]) => {
    const chainId = args[0] as string;
    const current = getWallet();
    if (!current || current.provider !== provider) return;
    persist({ ...current, chainId });
  });
  prov.on("disconnect", () => {
    const current = getWallet();
    if (!current || current.provider !== provider) return;
    disconnectWallet();
  });
}

/** Auto-reconnect on app boot — silently restores live listeners + chain. */
export async function bootstrapWallet(): Promise<void> {
  const w = getWallet();
  if (!w || w.provider === "demo") return;
  const prov = pickProvider(w.provider as "metamask" | "coinbase");
  if (!prov) {
    // Provider was uninstalled while session persisted — clear it.
    disconnectWallet();
    return;
  }
  attachLiveListeners(prov, w.provider);
  // Verify the wallet is still authorized for this site (no popup).
  try {
    const accounts = (await prov.request({ method: "eth_accounts" })) as string[];
    if (!accounts?.length) {
      disconnectWallet();
      return;
    }
    const chainId = (await prov.request({ method: "eth_chainId" })) as string | undefined;
    if (
      accounts[0].toLowerCase() !== w.address.toLowerCase() ||
      chainId !== w.chainId
    ) {
      persist({ ...w, address: accounts[0], chainId });
    }
  } catch {
    // Network blip — keep cached session, listeners are still attached.
  }
}

// --- Persistence -----------------------------------------------------------
function persist(w: Wallet) {
  if (typeof window === "undefined") return;
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
  const w: Wallet = { address, label, connectedAt: Date.now(), provider: "demo" };
  persist(w);
  return w;
}

export function disconnectWallet() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
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

// Back-compat alias used by older imports.
export const POLYGON_CHAIN = POLYGON_MAINNET;
