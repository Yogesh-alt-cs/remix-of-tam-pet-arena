import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/pokedex")({
  head: () => ({
    meta: [
      { title: "Petdex — Tam Arena" },
      { name: "description", content: "Browse the full 67-species roster with stats, evolution lines, and lore" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Petdex"
      kicker="encyclopedia"
      blurb="Browse the full 67-species roster with stats, evolution lines, and lore"
      ship={["All 67 species", "Stage previews", "Drop-rate odds", "Trainer notes"]}
    />
  ),
});
