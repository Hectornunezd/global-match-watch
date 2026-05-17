import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /lovable/

Sitemap: https://matchlivenow.com/sitemap-index.xml
Sitemap: https://matchlivenow.com/sitemap-en.xml
Sitemap: https://matchlivenow.com/sitemap-es.xml
`;
        return new Response(body, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "public, s-maxage=86400" },
        });
      },
    },
  },
});
