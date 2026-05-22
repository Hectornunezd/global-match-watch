import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ver-{$slug}")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/ver-{$slug}",
      params: { locale: "es", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
