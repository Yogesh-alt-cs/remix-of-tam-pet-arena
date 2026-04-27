import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tam/ComingSoon";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Trainer Profile — Tam Arena" },
      { name: "description", content: "Email + Google sign-in, wallet linking, and persistent stats are queued for the auth slice" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Trainer Profile"
      kicker="account"
      blurb="Email + Google sign-in, wallet linking, and persistent stats are queued for the auth slice"
      ship={["Email + Google sign-in", "Wallet linking", "Persistent stats", "Friend list"]}
    />
  ),
});
