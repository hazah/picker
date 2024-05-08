import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/slots')({
  component: function Slots() {
    return <Outlet />;
  }
});