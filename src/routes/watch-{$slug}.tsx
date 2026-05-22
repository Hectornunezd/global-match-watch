import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/watch-{$slug}")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/watch-{$slug}",
      params: { locale: "en", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
