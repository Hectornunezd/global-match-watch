import { createFileRoute } from "@tanstack/react-router";
import { getAllSlugs } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blog-posts";

const SITE = "https://matchlivenow.com";

export const Route = createFileRoute("/sitemap-es.xml")({
  server: {
    handlers: {
      GET: async () => {
        const data = await getAllSlugs();
        const urls: string[] = [`${SITE}/es`, `${SITE}/es/blogs`];
        for (const f of data.fixtures) if (f.slug_es) urls.push(`${SITE}/es/${f.slug_es}`);
        for (const t of data.teams) if (t.slug_es) urls.push(`${SITE}/es/team/${t.slug_es}`);
        for (const c of data.countries) if (c.slug_es) urls.push(`${SITE}/es/donde-ver-mundial-en-${c.slug_es}`);
        for (const p of BLOG_POSTS) urls.push(`${SITE}/es/blogs/${p.slug_es}`);
        const items = urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, s-maxage=3600" },
        });
      },
    },
  },
});
