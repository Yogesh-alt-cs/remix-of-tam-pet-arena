import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/tam/SiteHeader";
import { TactileButton } from "@/components/tam/TactileButton";
import { Chip } from "@/components/tam/Chip";
import { StatBar } from "@/components/tam/StatBar";
import { TamImage } from "@/components/tam/TamImage";
import { getPet, loadPets, speciesOf, type Pet } from "@/lib/pets-store";
import { recordBattle } from "@/lib/care-store";
import { useWallet, useRequireWallet } from "@/hooks/use-wallet";
import {
  ELEMENT_GLYPH, ELEMENT_TONE, ROSTER, type Element,
} from "@/lib/species-catalog";
import {
  cancelQueue, fetchBattleEvents, fetchMatch, fetchMatchPlayers, fetchQueueSize,
  joinQueue, submitMove, subscribeMatch, subscribeQueue,
  type ArenaMode, type BattleEventRow, type MatchPlayerRow, type MatchRow,
} from "@/lib/arena-client";
import { shortAddr } from "@/lib/wallet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/arena")({
  validateSearch: (s) => ({
    pet: (s.pet as string) ?? "",
    mode: (s.mode as ArenaMode) ?? "quick",
  }),
  head: () => ({
    meta: [
      { title: "Live Arena — Tam Arena" },
      { name: "description", content: "Real-time PvP matchmaking. Queue against live trainers, submit moves over realtime, and earn rank." },
    ],
  }),
  component: ArenaPage,
});

type Phase = "select" | "queued" | "battle" | "complete";
type RpsMove = "rock" | "paper" | "scissors";

const RPS_LABEL: Record<RpsMove, { glyph: string; label: string }> = {
  rock: { glyph: "✊", label: "Rock" },
  paper: { glyph: "✋", label: "Paper" },
  scissors: { glyph: "✌", label: "Scissors" },
};

function ArenaPage() {
  const search = useSearch({ from: "/arena" });
  const navigate = useNavigate({ from: "/arena" });
  const wallet = useWallet();
  const requireWallet = useRequireWallet();

  const playerPet: Pet | undefined = useMemo(() => {
    if (search.pet) return getPet(search.pet);
    return loadPets()[0];
  }, [search.pet]);
  const playerSpecies = playerPet ? speciesOf(playerPet) : undefined;

  const [phase, setPhase] = useState<Phase>("select");
  const [queueId, setQueueId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [players, setPlayers] = useState<MatchPlayerRow[]>([]);
  const [events, setEvents] = useState<BattleEventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [queueElapsed, setQueueElapsed] = useState(0);
  const [onlineCount, setOnlineCount] = useState<number>(0);

  const mode: ArenaMode = search.mode;
  const walletAddr = wallet?.address.toLowerCase() ?? "";
  const playerName = wallet ? wallet.label : "Trainer";

  // Online queue size (lightweight poll — light enough for a lobby chip).
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const n = await fetchQueueSize(mode);
      if (alive) setOnlineCount(n);
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => { alive = false; clearInterval(id); };
  }, [mode]);

  // Queue elapsed timer.
  useEffect(() => {
    if (phase !== "queued") return;
    setQueueElapsed(0);
    const id = setInterval(() => setQueueElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Subscribe to queue row → flips to matched when an opponent locks in.
  useEffect(() => {
    if (phase !== "queued" || !queueId) return;
    const off = subscribeQueue(queueId, (row) => {
      if (row.status === "matched" && row.matched_id) {
        setMatchId(row.matched_id);
        setPhase("battle");
      } else if (row.status === "cancelled") {
        setPhase("select");
        setQueueId(null);
      }
    });
    return off;
  }, [phase, queueId]);

  // When entering battle phase, hydrate match + subscribe to its full stream.
  useEffect(() => {
    if (phase !== "battle" || !matchId) return;
    let alive = true;
    (async () => {
      try {
        const [m, ps, evs] = await Promise.all([
          fetchMatch(matchId), fetchMatchPlayers(matchId), fetchBattleEvents(matchId),
        ]);
        if (!alive) return;
        setMatch(m);
        setPlayers(ps);
        setEvents(evs);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Failed to load match");
      }
    })();
    const off = subscribeMatch(matchId, {
      onMatch: (row) => setMatch(row),
      onPlayer: (row) => setPlayers((prev) => {
        const i = prev.findIndex((p) => p.id === row.id);
        if (i === -1) return [...prev, row];
        const next = prev.slice();
        next[i] = row;
        return next;
      }),
      onEvent: (row) => setEvents((prev) => prev.some((e) => e.id === row.id) ? prev : [...prev, row]),
    });
    return () => { alive = false; off(); };
  }, [phase, matchId]);

  // Resolve match outcome from event stream + record locally on the player's pet.
  const recordedRef = useRef<string | null>(null);
  useEffect(() => {
    if (phase !== "battle" || !match || !playerPet) return;
    const decided = decideOutcome(events, walletAddr, players);
    if (!decided) return;
    if (recordedRef.current === match.id) return;
    recordedRef.current = match.id;
    setPhase("complete");
    const opponent = players.find((p) => p.wallet_address.toLowerCase() !== walletAddr);
    recordBattle(
      playerPet.id,
      opponent?.player_name ?? "Opponent",
      decided.outcome,
      `live · ${decided.detail}`,
    );
  }, [phase, match, events, players, walletAddr, playerPet]);

  const handleFindMatch = useCallback(() => {
    if (!playerPet || !playerSpecies) return;
    requireWallet({
      action: "queue", redirect: `/arena?pet=${playerPet.id}&mode=${mode}`,
      run: async () => {
        try {
          setError(null);
          const result = await joinQueue({
            walletAddress: walletAddr,
            playerName,
            mode,
            selectedPetId: playerPet.id,
            selectedSpeciesId: playerSpecies.id,
            petSnapshot: {
              name: playerPet.name,
              sprite: playerPet.sprite,
              element: playerSpecies.element,
              rarity: playerPet.rarity,
              stats: playerPet.stats,
            },
          });
          setQueueId(result.queueId);
          if (result.status === "matched" && result.matchId) {
            setMatchId(result.matchId);
            setPhase("battle");
          } else {
            setPhase("queued");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to join queue");
        }
      },
    });
  }, [playerPet, playerSpecies, requireWallet, walletAddr, playerName, mode]);

  const handleCancel = useCallback(async () => {
    if (!walletAddr) return;
    try {
      await cancelQueue(walletAddr);
    } catch {
      // Non-fatal — UI returns to select state regardless.
    }
    setPhase("select");
    setQueueId(null);
  }, [walletAddr]);

  const handleSubmit = useCallback(async (move: RpsMove) => {
    if (!matchId || !walletAddr || !match) return;
    if (match.active_wallet_address?.toLowerCase() !== walletAddr) return;
    try {
      await submitMove({ matchId, walletAddress: walletAddr, move, payload: { rps: move } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit move");
    }
  }, [matchId, walletAddr, match]);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!playerPet) {
    return (
      <div className="min-h-screen bg-background text-ink">
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl">No pet to fight with</h1>
          <p className="mt-3 text-muted-foreground">Hatch a Tam first to enter the live arena.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/hatch"><TactileButton>Hatch a pet</TactileButton></Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/pets/$petId" params={{ petId: playerPet.id }} className="font-mono-ui text-[12px] text-muted-foreground hover:text-ink">
            ← back to pet
          </Link>
          <div className="flex items-center gap-2">
            <Chip tone="arcade">● {onlineCount} in {mode} queue</Chip>
            <ModeSelect
              value={mode}
              disabled={phase !== "select"}
              onChange={(m) => navigate({ search: (s: { pet?: string; mode?: ArenaMode }) => ({ ...s, mode: m }), replace: true })}
            />
          </div>
        </div>

        <h1 className="mt-4 font-display text-4xl sm:text-5xl tracking-tight">Live Arena</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Real trainers, real matchmaking. Queue with your pet, get matched against another wallet, and play turn-by-turn over realtime. Stage 1 combat: rock · paper · scissors. Higher tiers unlock as your pet evolves.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 font-mono-ui text-[12px] text-destructive">
            ⚠ {error}
          </div>
        )}

        {phase === "select" && (
          <SelectPanel pet={playerPet} onFind={handleFindMatch} mode={mode} />
        )}
        {phase === "queued" && (
          <QueuedPanel pet={playerPet} elapsed={queueElapsed} onCancel={handleCancel} mode={mode} />
        )}
        {(phase === "battle" || phase === "complete") && match && (
          <BattlePanel
            match={match}
            players={players}
            events={events}
            walletAddr={walletAddr}
            phase={phase}
            onSubmit={handleSubmit}
            onRematch={() => {
              recordedRef.current = null;
              setMatch(null); setPlayers([]); setEvents([]);
              setMatchId(null); setQueueId(null); setPhase("select");
            }}
          />
        )}
      </main>
    </div>
  );
}

// ── Mode selector ──────────────────────────────────────────────────────────
function ModeSelect({ value, onChange, disabled }: { value: ArenaMode; onChange: (m: ArenaMode) => void; disabled?: boolean }) {
  const modes: { id: ArenaMode; label: string }[] = [
    { id: "quick", label: "Quick" },
    { id: "ranked", label: "Ranked" },
    { id: "friend", label: "Friend" },
  ];
  return (
    <div className="inline-flex rounded-md border-2 border-ink overflow-hidden">
      {modes.map((m) => (
        <button
          key={m.id}
          disabled={disabled}
          onClick={() => onChange(m.id)}
          className={cn(
            "font-mono-ui text-[11px] uppercase px-3 py-1.5 transition-colors",
            value === m.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

// ── Phase: Select ──────────────────────────────────────────────────────────
function SelectPanel({ pet, onFind, mode }: { pet: Pet; onFind: () => void; mode: ArenaMode }) {
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border-2 border-ink bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">your pet</div>
        <div className="mt-4 flex items-center gap-5">
          <div className="h-32 w-32 grid place-items-center rounded-xl border-2 border-ink bg-background grid-bg">
            <TamImage src={pet.sprite} alt={pet.name} className="h-28 w-28 object-contain animate-pet-idle" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-2xl truncate">{pet.name}</div>
            <div className="font-mono-ui text-[11px] text-muted-foreground mt-1">{pet.species} · {pet.rarity}</div>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 font-mono-ui text-[11px]">
              <span>STR <b className="tabular-nums">{pet.stats.str}</b></span>
              <span>AGI <b className="tabular-nums">{pet.stats.agi}</b></span>
              <span>INT <b className="tabular-nums">{pet.stats.int}</b></span>
              <span>HP <b className="tabular-nums">{pet.stats.hp}</b></span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-ink bg-ink text-background p-6 shadow-[var(--shadow-card)] flex flex-col">
        <div className="font-mono-ui text-[11px] uppercase opacity-70">{mode} match</div>
        <h2 className="font-display text-3xl mt-2">Find a live opponent</h2>
        <p className="font-mono-ui text-[12px] opacity-70 mt-2">
          You'll be matched with the next trainer in the {mode} queue. Average wait: 5–15 seconds.
        </p>
        <div className="mt-auto pt-6">
          <TactileButton size="lg" onClick={onFind} className="w-full">Find Match</TactileButton>
        </div>
      </div>
    </section>
  );
}

// ── Phase: Queued ──────────────────────────────────────────────────────────
function QueuedPanel({ pet, elapsed, onCancel, mode }: { pet: Pet; elapsed: number; onCancel: () => void; mode: ArenaMode }) {
  return (
    <section className="mt-6 rounded-2xl border-2 border-ink bg-card p-8 shadow-[var(--shadow-card)] text-center">
      <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">searching · {mode}</div>
      <h2 className="font-display text-4xl mt-2">Waiting for opponent…</h2>
      <div className="mt-6 flex justify-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50" />
          <div className="absolute inset-2 rounded-full border-2 border-ink bg-background grid place-items-center">
            <TamImage src={pet.sprite} alt={pet.name} className="h-24 w-24 object-contain animate-pet-idle" />
          </div>
        </div>
      </div>
      <div className="mt-6 font-mono-ui text-[12px] text-muted-foreground tabular-nums">
        elapsed: {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
      </div>
      <div className="mt-6 flex justify-center">
        <TactileButton variant="ghost" onClick={onCancel}>Cancel</TactileButton>
      </div>
    </section>
  );
}

// ── Phase: Battle / Complete ───────────────────────────────────────────────
function BattlePanel({
  match, players, events, walletAddr, phase, onSubmit, onRematch,
}: {
  match: MatchRow;
  players: MatchPlayerRow[];
  events: BattleEventRow[];
  walletAddr: string;
  phase: Phase;
  onSubmit: (m: RpsMove) => void;
  onRematch: () => void;
}) {
  const me = players.find((p) => p.wallet_address.toLowerCase() === walletAddr);
  const opp = players.find((p) => p.wallet_address.toLowerCase() !== walletAddr);
  const myMoves = useMemo(() => roundMovesByWallet(events, me?.wallet_address ?? ""), [events, me]);
  const oppMoves = useMemo(() => roundMovesByWallet(events, opp?.wallet_address ?? ""), [events, opp]);
  const rounds = useMemo(() => buildRounds(myMoves, oppMoves), [myMoves, oppMoves]);
  const myScore = rounds.filter((r) => r.outcome === "win").length;
  const oppScore = rounds.filter((r) => r.outcome === "lose").length;
  const isMyTurn = match.active_wallet_address?.toLowerCase() === walletAddr;
  const decided = decideOutcome(events, walletAddr, players);

  return (
    <section className="mt-6 space-y-5">
      {/* Field */}
      <div className="rounded-2xl border-2 border-ink bg-card shadow-[var(--shadow-card)] overflow-hidden">
        <div className="grid grid-cols-2 gap-3 bg-background grid-bg p-6 relative">
          <FighterCard player={me} score={myScore} isActive={isMyTurn && phase === "battle"} side="left" />
          <FighterCard player={opp} score={oppScore} isActive={!isMyTurn && phase === "battle"} side="right" flip />
          {phase === "complete" && decided && (
            <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm">
              <div className={cn(
                "rounded-2xl border-2 border-ink px-10 py-6 text-center shadow-[var(--shadow-card)]",
                decided.outcome === "win" ? "bg-success/30" : decided.outcome === "lose" ? "bg-destructive/20" : "bg-muted",
              )}>
                <div className="font-display text-5xl tracking-tight">
                  {decided.outcome === "win" ? "VICTORY" : decided.outcome === "lose" ? "DEFEAT" : "DRAW"}
                </div>
                <div className="font-mono-ui text-[11px] uppercase mt-2 text-muted-foreground">
                  vs {opp?.player_name ?? "opponent"} · best of 3
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Move panel */}
        <div className="border-t-2 border-ink px-5 py-4">
          {phase === "battle" ? (
            <>
              <div className="font-mono-ui text-[11px] text-muted-foreground uppercase mb-2 flex items-center justify-between">
                <span>{isMyTurn ? "your move" : "opponent thinking…"}</span>
                <TurnTimer deadline={match.turn_deadline_at} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(RPS_LABEL) as RpsMove[]).map((m) => (
                  <TactileButton
                    key={m}
                    variant={m === "paper" ? "secondary" : m === "scissors" ? "ink" : "ghost"}
                    disabled={!isMyTurn}
                    onClick={() => onSubmit(m)}
                  >
                    <span className="flex flex-col items-center">
                      <span className="text-2xl leading-none">{RPS_LABEL[m].glyph}</span>
                      <span className="font-mono-ui text-[10px] mt-1">{RPS_LABEL[m].label}</span>
                    </span>
                  </TactileButton>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono-ui text-[11px] text-muted-foreground">
                Match {match.id.slice(0, 8)} · seed {match.seed.slice(0, 8)}
              </div>
              <div className="flex gap-2">
                <TactileButton onClick={onRematch}>New match</TactileButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Round log */}
      <div className="rounded-2xl border-2 border-ink bg-ink text-background p-5 shadow-[var(--shadow-card)]">
        <div className="font-mono-ui text-[11px] uppercase opacity-70 mb-3">round log · live</div>
        {rounds.length === 0 ? (
          <div className="font-mono-ui text-[12px] opacity-60">Pick a move to start round 1.</div>
        ) : (
          <ol className="space-y-1 font-mono-ui text-[12px]">
            {rounds.map((r, i) => (
              <li key={i} className={cn(
                "tabular-nums",
                r.outcome === "win" && "text-success",
                r.outcome === "lose" && "text-destructive",
              )}>
                &gt; round {i + 1} · you {r.mine ? RPS_LABEL[r.mine].glyph : "—"} vs opp {r.theirs ? RPS_LABEL[r.theirs].glyph : "—"} · {r.outcome.toUpperCase()}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function FighterCard({
  player, score, isActive, side, flip,
}: { player?: MatchPlayerRow; score: number; isActive: boolean; side: "left" | "right"; flip?: boolean }) {
  const snapshot = (player?.pet_snapshot ?? {}) as { sprite?: string; name?: string; element?: Element; stats?: { hp?: number } };
  const sprite = snapshot.sprite ?? lookupSpriteBySpecies(player?.selected_species_id);
  const name = snapshot.name ?? player?.player_name ?? "—";
  const element: Element | undefined = snapshot.element;
  const hpMax = snapshot.stats?.hp ?? 100;
  return (
    <div className={cn("flex flex-col gap-2", side === "right" && "items-end text-right")}>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-display font-semibold text-sm truncate flex items-center gap-2">
          {isActive && <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />}
          {name}
        </span>
        {element && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border-2 border-ink font-mono-ui text-[10px] uppercase ${ELEMENT_TONE[element]}`}>
            {ELEMENT_GLYPH[element]} {element}
          </span>
        )}
      </div>
      <StatBar label={`HP ${player?.current_hp ?? hpMax}/${hpMax}`} value={((player?.current_hp ?? hpMax) / hpMax) * 100} tone="success" />
      <div className="flex items-center gap-2 font-mono-ui text-[10px] text-muted-foreground">
        <span>{player ? shortAddr(player.wallet_address) : "waiting…"}</span>
        <span>· score {score}</span>
      </div>
      <div className="relative w-full h-36 sm:h-44 flex items-end justify-center">
        {sprite ? (
          <TamImage
            src={sprite}
            alt={name}
            className={cn("h-32 sm:h-40 w-auto object-contain animate-pet-idle", flip && "scale-x-[-1]")}
          />
        ) : (
          <div className="h-32 sm:h-40 w-32 grid place-items-center text-muted-foreground font-mono-ui text-[11px]">awaiting opponent…</div>
        )}
      </div>
    </div>
  );
}

function TurnTimer({ deadline }: { deadline: string | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  if (!deadline) return null;
  const ms = Math.max(0, new Date(deadline).getTime() - now);
  const s = Math.ceil(ms / 1000);
  return (
    <span className={cn("tabular-nums", s <= 5 && "text-destructive font-bold")}>
      {s}s
    </span>
  );
}

// ── Pure helpers ────────────────────────────────────────────────────────────
/** Group RPS moves by turn for one wallet. */
function roundMovesByWallet(events: BattleEventRow[], wallet: string): RpsMove[] {
  if (!wallet) return [];
  return events
    .filter((e) => e.event_type === "move_submitted" && e.wallet_address.toLowerCase() === wallet.toLowerCase())
    .sort((a, b) => a.turn_number - b.turn_number)
    .map((e) => {
      const p = e.payload as { rps?: RpsMove; move?: string };
      return (p.rps ?? (p.move as RpsMove)) ?? "rock";
    });
}

function buildRounds(mine: RpsMove[], theirs: RpsMove[]): { mine?: RpsMove; theirs?: RpsMove; outcome: "win" | "lose" | "draw" | "pending" }[] {
  const len = Math.max(mine.length, theirs.length);
  const out: { mine?: RpsMove; theirs?: RpsMove; outcome: "win" | "lose" | "draw" | "pending" }[] = [];
  for (let i = 0; i < len; i++) {
    const a = mine[i], b = theirs[i];
    if (a && b) out.push({ mine: a, theirs: b, outcome: rps(a, b) });
    else if (a) out.push({ mine: a, outcome: "pending" });
    else if (b) out.push({ theirs: b, outcome: "pending" });
  }
  return out;
}

function rps(a: RpsMove, b: RpsMove): "win" | "lose" | "draw" {
  if (a === b) return "draw";
  if ((a === "rock" && b === "scissors") || (a === "paper" && b === "rock") || (a === "scissors" && b === "paper")) return "win";
  return "lose";
}

function decideOutcome(events: BattleEventRow[], walletAddr: string, players: MatchPlayerRow[]): { outcome: "win" | "lose" | "draw"; detail: string } | null {
  if (!walletAddr) return null;
  const opp = players.find((p) => p.wallet_address.toLowerCase() !== walletAddr);
  if (!opp) return null;
  const mine = roundMovesByWallet(events, walletAddr);
  const theirs = roundMovesByWallet(events, opp.wallet_address);
  const rounds = buildRounds(mine, theirs).filter((r) => r.outcome !== "pending");
  let myScore = 0, oppScore = 0;
  for (const r of rounds) {
    if (r.outcome === "win") myScore++;
    else if (r.outcome === "lose") oppScore++;
  }
  if (myScore >= 2 || oppScore >= 2) {
    if (myScore === oppScore) return { outcome: "draw", detail: `${myScore}-${oppScore}` };
    return { outcome: myScore > oppScore ? "win" : "lose", detail: `${myScore}-${oppScore}` };
  }
  return null;
}

function lookupSpriteBySpecies(speciesId?: string): string | undefined {
  if (!speciesId) return undefined;
  return ROSTER.find((s) => s.id === speciesId)?.sprite;
}
