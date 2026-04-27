import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/battle")({
  head: () => ({
    meta: [
      { title: "Battle Lobby — Tam Arena" },
      { name: "description", content: "Solo and AI sparring rooms — coming with the next combat polish drop" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Battle Lobby"
      kicker="practice"
      blurb="Solo and AI sparring rooms — coming with the next combat polish drop"
      ship={["AI difficulty tiers", "Move trainer", "Replay analyzer", "Daily challenges"]}
    />
  ),
});
