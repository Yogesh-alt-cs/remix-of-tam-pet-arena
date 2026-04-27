import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/tam/SiteHeader";
import { TactileButton } from "@/components/tam/TactileButton";
import { Chip } from "@/components/tam/Chip";
import {
  connectMetaMask,
  connectWallet,
  DEMO_ACCOUNTS,
  hasMetaMask,
  shortAddr,
  WalletError,
} from "@/lib/wallet-store";

interface Search {
  redirect?: string;
  action?: string;
}

export const Route = createFileRoute("/connect")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    action: typeof s.action === "string" ? s.action : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Connect Wallet — Tam Arena" },
      { name: "description", content: "Connect MetaMask to hatch, feed, and battle Tams on Polygon." },
    ],
  }),
  component: ConnectPage,
});

const ACTION_COPY: Record<string, { verb: string; line: string }> = {
  hatch: { verb: "Hatch a Tam", line: "Signing mints a new pet to this wallet." },
  feed: { verb: "Feed your pet", line: "A care tx will be submitted on Polygon." },
  play: { verb: "Play with your pet", line: "Sub-cent gas. Settles in <500ms." },
  battle: { verb: "Enter the arena", line: "Each round records a verifiable match outcome." },
  evolve: { verb: "Evolve your Tam", line: "Locks the new form on-chain." },
  list: { verb: "List on marketplace", line: "Approval lets the contract custody the listed pet." },
  buy: { verb: "Buy this pet", line: "Funds + ownership swap atomically." },
};

type Phase = "idle" | "approving" | "approved";

function ConnectPage() {
  const { redirect, action } = Route.useSearch();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mmAvailable, setMmAvailable] = useState(false);

  useEffect(() => {
    setMmAvailable(hasMetaMask());
  }, []);

  const copy =
    (action ? ACTION_COPY[action] : undefined) ?? {
      verb: "Connect your wallet",
      line: "Tam Arena uses your wallet to sign care, battle, and trade actions.",
    };

  function routeBack() {
    if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      navigate({ to: "/" });
    }
  }

  async function approveMetaMask() {
    setError(null);
    setPhase("approving");
    try {
      await connectMetaMask();
      setPhase("approved");
      setTimeout(routeBack, 700);
    } catch (e) {
      const err = e as WalletError;
      setError(err?.message ?? "Failed to connect MetaMask.");
      setPhase("idle");
    }
  }

  function approveDemo() {
    if (!picked) return;
    setError(null);
    setPhase("approving");
    setTimeout(() => {
      const acc = DEMO_ACCOUNTS.find((a) => a.address === picked)!;
      connectWallet(acc.address, acc.label);
      setPhase("approved");
      setTimeout(routeBack, 700);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-20">
        <Link to="/" className="font-mono-ui text-[12px] text-muted-foreground hover:text-ink">
          ← cancel
        </Link>

        <header className="mt-6">
          {action && (
            <Chip tone="primary" className="mb-3">
              action · {action}
            </Chip>
          )}
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight">{copy.verb}</h1>
          <p className="mt-3 text-muted-foreground">{copy.line}</p>
        </header>

        {/* MetaMask card */}
        <section className="mt-8 rounded-2xl border-2 border-ink bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-ink bg-muted px-5 py-2.5">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider">
              wallet_provider · metamask
            </span>
            <span className="font-mono-ui text-[11px] flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${mmAvailable ? "bg-success animate-pulse" : "bg-muted-foreground"}`}
              />
              polygon · chain 137
            </span>
          </div>

          <div className="px-5 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-md border-2 border-ink bg-[#f6851b] text-background font-display text-lg shadow-[0_3px_0_var(--ink)]">
                🦊
              </span>
              <div>
                <div className="font-display text-lg">MetaMask</div>
                <div className="font-mono-ui text-[11px] text-muted-foreground">
                  {mmAvailable
                    ? "Detected in this browser. Approve in the popup."
                    : "Not detected. Install the MetaMask extension to continue."}
                </div>
              </div>
            </div>

            {mmAvailable ? (
              <TactileButton size="md" onClick={approveMetaMask} disabled={phase !== "idle"}>
                {phase === "approving"
                  ? "Awaiting signature…"
                  : phase === "approved"
                    ? "✓ Connected"
                    : "Connect MetaMask"}
              </TactileButton>
            ) : (
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TactileButton size="md" variant="ghost">
                  Install MetaMask ↗
                </TactileButton>
              </a>
            )}
          </div>

          {error && (
            <div className="border-t-2 border-ink bg-destructive/10 px-5 py-3 font-mono-ui text-[12px] text-destructive">
              ⚠ {error}
            </div>
          )}
        </section>

        {/* Demo fallback */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            className="font-mono-ui text-[11px] text-muted-foreground hover:text-ink uppercase tracking-wider"
          >
            {showDemo ? "− hide demo wallets" : "+ use a demo wallet instead"}
          </button>
        </div>

        {showDemo && (
          <section className="mt-3 rounded-2xl border-2 border-ink bg-card shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-ink bg-muted px-5 py-2.5">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider">
                wallet_provider · demo
              </span>
              <span className="font-mono-ui text-[11px] text-muted-foreground">
                no real keys — preview only
              </span>
            </div>
            <ul className="divide-y-2 divide-ink/10">
              {DEMO_ACCOUNTS.map((a) => (
                <li key={a.address}>
                  <button
                    type="button"
                    onClick={() => setPicked(a.address)}
                    disabled={phase !== "idle"}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/60 transition-colors ${picked === a.address ? "bg-primary/10" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-md border-2 border-ink font-display text-sm ${picked === a.address ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        {a.label.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-display text-base">{a.label}</div>
                        <div className="font-mono-ui text-[11px] text-muted-foreground tabular-nums">
                          {shortAddr(a.address)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-ui text-[12px] tabular-nums">{a.balance}</div>
                      <div className="font-mono-ui text-[10px] text-muted-foreground">balance</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-ink px-5 py-5 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono-ui text-[11px] text-muted-foreground">
                {phase === "idle" && "Pick a demo account, then approve to continue."}
                {phase === "approving" && "Signing…"}
                {phase === "approved" && (
                  <span className="text-success">✓ Wallet approved — routing back…</span>
                )}
              </div>
              <TactileButton
                size="md"
                variant="ghost"
                onClick={approveDemo}
                disabled={!picked || phase !== "idle"}
              >
                {phase === "approving"
                  ? "Signing…"
                  : phase === "approved"
                    ? "Connected"
                    : "Approve demo & continue"}
              </TactileButton>
            </div>
          </section>
        )}

        <p className="mt-6 font-mono-ui text-[11px] text-muted-foreground text-center">
          Tam Arena never sees your private keys. MetaMask handles all signatures.
        </p>
      </main>
    </div>
  );
}
