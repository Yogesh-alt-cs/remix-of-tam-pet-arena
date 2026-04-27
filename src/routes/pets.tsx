import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/pets")({
  head: () => ({
    meta: [
      { title: "My Tams — Tam Arena" },
      { name: "description", content: "Your minted Tams will live here" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="My Tams"
      kicker="collection"
      blurb="Your minted Tams will live here"
      ship={["View pets", "Filter by element", "Sort by rating", "Quick-equip to Arena"]}
    />
  ),
});
