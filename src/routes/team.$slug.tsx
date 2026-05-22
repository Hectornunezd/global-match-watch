import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/team/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/team/$slug",
      params: { locale: "en", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
