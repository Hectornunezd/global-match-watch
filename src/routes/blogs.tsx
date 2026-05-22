import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale/blogs",
      params: { locale: "en" },
      statusCode: 301,
    });
  },
  component: () => null,
});
