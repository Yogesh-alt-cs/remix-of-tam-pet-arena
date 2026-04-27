import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Match History — Tam Arena" },
      { name: "description", content: "Every PvP match you play is already saved server-side — the replay viewer ships next" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Match History"
      kicker="replay"
      blurb="Every PvP match you play is already saved server-side — the replay viewer ships next"
      ship={["Per-match replay", "Move-by-move log", "Win/loss filters", "Share links"]}
    />
  ),
});
