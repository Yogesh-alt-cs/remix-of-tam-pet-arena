import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pet/$petId")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/pets/$petId", params: { petId: params.petId } });
  },
});
