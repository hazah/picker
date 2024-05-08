import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks")({
  component: function Tasks() {
    return <Outlet />;
  },
});
