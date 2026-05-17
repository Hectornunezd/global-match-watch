import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/blogs")({
  component: () => <Outlet />,
});