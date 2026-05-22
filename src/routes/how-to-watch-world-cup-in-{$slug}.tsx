import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/how-to-watch-world-cup-in-{$slug}")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/how-to-watch-world-cup-in-{$slug}",
      params: { locale: "en", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
