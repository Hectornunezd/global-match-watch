import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 301,
          headers: {
            Location: "https://matchlivenow.com/sitemap-index.xml",
            "Cache-Control": "public, s-maxage=3600",
          },
        });
      },
    },
  },
});
