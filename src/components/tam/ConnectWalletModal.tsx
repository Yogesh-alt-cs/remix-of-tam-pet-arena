// ConnectWalletModal — provider grid + status + chain handling.
// Renders inline on /connect (not a Radix dialog) so it inherits the page's
// glassmorphism/neon-accent surface and never traps focus.
import { useEffect, useState } from "react";
import { TactileButton } from "./TactileButton";
import { Chip } from "./Chip";
import {
  connectMetaMask,
  connectCoinbase,
  detectProviders,
  switchToChain,
  isSupportedChain,
  chainLabel,
  POLYGON_MAINNET,
  POLYGON_AMOY,
  WalletError,
  type ProviderInfo,
  type WalletProvider,
} from "@/lib/wallet-store";

type Phase = "idle" | "approving" | "approved" | "error" | "wrong_chain";

interface Props {
  onConnected: () => void;
  /** Optional preferred chain — defaults to Polygon Mainnet. */
  preferredChainId?: string;
}

const PROVIDER_GLYPH: Record<WalletProvider, { glyph: string; bg: string }> = {
  metamask: { glyph: "🦊", bg: "bg-[#f6851b]" },
  coinbase: { glyph: "🪙", bg: "bg-[#0052ff] text-white" },
  walletconnect: { glyph: "🔗", bg: "bg-[#3b99fc] text-white" },
  demo: { glyph: "🧪", bg: "bg-muted" },
};

export function ConnectWalletModal({ onConnected, preferredChainId }: Props) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [active, setActive] = useState<WalletProvider | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentChain, setCurrentChain] = useState<string | undefined>();
  const targetChain = preferredChainId ?? POLYGON_MAINNET.chainId;

  useEffect(() => {
    setProviders(detectProviders());
    // Re-detect briefly — extensions sometimes inject after first paint.
    const t = setTimeout(() => setProviders(detectProviders()), 300);
    return () => clearTimeout(t);
  }, []);

  async function handleConnect(p: WalletProvider) {
    setError(null);
    setActive(p);
    setPhase("approving");
    try {
      const wallet =
        p === "metamask"
          ? await connectMetaMask({ preferredChainId: targetChain })
          : await connectCoinbase({ preferredChainId: targetChain });
      setCurrentChain(wallet.chainId);
      if (!isSupportedChain(wallet.chainId)) {
        setPhase("wrong_chain");
        return;
      }
      setPhase("approved");
      setTimeout(onConnected, 500);
    } catch (e) {
      const err = e as WalletError;
      setError(err?.message ?? "Failed to connect wallet.");
      setPhase("error");
    }
  }

  async function handleSwitch(target: string) {
    setError(null);
    setPhase("approving");
    try {
      const newChain = await switchToChain(target);
      setCurrentChain(newChain);
      if (isSupportedChain(newChain)) {
        setPhase("approved");
        setTimeout(onConnected, 500);
      } else {
        setPhase("wrong_chain");
      }
    } catch (e) {
      const err = e as WalletError;
      setError(err?.message ?? "Failed to switch network.");
      setPhase("wrong_chain");
    }
  }

  function handleRetry() {
    setError(null);
    setPhase("idle");
    setActive(null);
  }

  return (
    <section className="rounded-2xl border-2 border-ink bg-card shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-ink bg-muted px-5 py-2.5">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider">
          wallet_provider · select
        </span>
        <span className="font-mono-ui text-[11px] flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              phase === "approving"
                ? "bg-warning animate-pulse"
                : phase === "approved"
                  ? "bg-success"
                  : phase === "error" || phase === "wrong_chain"
                    ? "bg-destructive animate-pulse"
                    : "bg-muted-foreground"
            }`}
          />
          {phase === "approving" && "awaiting signature…"}
          {phase === "approved" && "connected ✓"}
          {phase === "wrong_chain" && "wrong network"}
          {phase === "error" && "connection failed"}
          {phase === "idle" && "ready"}
        </span>
      </div>

      <ul className="divide-y-2 divide-ink/10">
        {providers.map((p) => {
          const glyph = PROVIDER_GLYPH[p.id];
          const isLoading = active === p.id && phase === "approving";
          const isWalletConnect = p.id === "walletconnect";
          const isDisabled =
            phase === "approving" ||
            phase === "approved" ||
            (!p.available && !p.installUrl) ||
            isWalletConnect;
          return (
            <li key={p.id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-md border-2 border-ink font-display text-lg shadow-[0_3px_0_var(--ink)] ${glyph.bg}`}
                  >
                    {glyph.glyph}
                  </span>
                  <div>
                    <div className="font-display text-lg flex items-center gap-2">
                      {p.name}
                      {isWalletConnect && (
                        <Chip tone="warning" className="!text-[10px] !py-0.5">
                          coming soon
                        </Chip>
                      )}
                    </div>
                    <div className="font-mono-ui text-[11px] text-muted-foreground">
                      {isWalletConnect
                        ? "Cross-device QR pairing — enabling next."
                        : p.available
                          ? "Detected in this browser."
                          : "Not detected."}
                    </div>
                  </div>
                </div>
                {p.available ? (
                  <TactileButton
                    size="md"
                    onClick={() => handleConnect(p.id)}
                    disabled={isDisabled}
                  >
                    {isLoading ? "Awaiting signature…" : `Connect ${p.name}`}
                  </TactileButton>
                ) : p.installUrl ? (
                  <a href={p.installUrl} target="_blank" rel="noopener noreferrer">
                    <TactileButton size="md" variant="ghost">
                      Install ↗
                    </TactileButton>
                  </a>
                ) : (
                  <TactileButton size="md" variant="ghost" disabled>
                    Unavailable
                  </TactileButton>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {(phase === "wrong_chain" || (currentChain && !isSupportedChain(currentChain))) && (
        <div className="border-t-2 border-ink bg-warning/15 px-5 py-4 space-y-3">
          <div className="font-mono-ui text-[12px] flex items-center gap-2">
            ⚠ Connected to <strong>{chainLabel(currentChain)}</strong>. Tam Arena runs on
            Polygon.
          </div>
          <div className="flex flex-wrap gap-2">
            <TactileButton size="sm" onClick={() => handleSwitch(POLYGON_MAINNET.chainId)}>
              Switch to Polygon Mainnet
            </TactileButton>
            <TactileButton
              size="sm"
              variant="ghost"
              onClick={() => handleSwitch(POLYGON_AMOY.chainId)}
            >
              Use Amoy Testnet
            </TactileButton>
          </div>
        </div>
      )}

      {phase === "error" && error && (
        <div className="border-t-2 border-ink bg-destructive/10 px-5 py-4 space-y-3">
          <div className="font-mono-ui text-[12px] text-destructive">⚠ {error}</div>
          <TactileButton size="sm" variant="ghost" onClick={handleRetry}>
            Retry
          </TactileButton>
        </div>
      )}
    </section>
  );
}
