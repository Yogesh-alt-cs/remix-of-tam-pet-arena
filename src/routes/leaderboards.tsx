import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Tam Arena" },
      { name: "description", content: "Global Elo, weekly seasons, and guild brackets land with the next ranked release" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Leaderboards"
      kicker="ranked"
      blurb="Global Elo, weekly seasons, and guild brackets land with the next ranked release"
      ship={["Global ladder", "Weekly seasons", "Guild brackets", "Match history"]}
    />
  ),
});
