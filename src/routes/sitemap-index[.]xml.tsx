import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://matchlivenow.com";

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap-en.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-es.xml</loc></sitemap>
</sitemapindex>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, s-maxage=3600" },
        });
      },
    },
  },
});
