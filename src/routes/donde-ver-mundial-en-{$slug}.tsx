import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/donde-ver-mundial-en-{$slug}")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/donde-ver-mundial-en-{$slug}",
      params: { locale: "es", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
