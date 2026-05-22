import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale/blogs/$slug",
      params: { locale: "en", slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
