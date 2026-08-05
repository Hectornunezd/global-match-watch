import { createFileRoute } from "@tanstack/react-router";
import { getAllSlugs } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blog-posts";

const SITE = "https://matchlivenow.com";

function buildSitemap(locale: "en" | "es", data: Awaited<ReturnType<typeof getAllSlugs>>): string {
  const urls: string[] = [
    `${SITE}/${locale}`,
    `${SITE}/${locale}/tabla`,
    `${SITE}/${locale}/calendario`,
    `${SITE}/${locale}/liguilla`,
    `${SITE}/${locale}/blogs`,
  ];
  for (const f of data.fixtures) {
    const slug = locale === "es" ? f.slug_es : f.slug_en;
    if (slug) urls.push(`${SITE}/${locale}/${slug}`);
  }
  for (const t of data.teams) {
    const slug = locale === "es" ? t.slug_es : t.slug_en;
    if (slug) urls.push(`${SITE}/${locale}/team/${slug}`);
  }
  for (const c of data.countries) {
    const slug = locale === "es" ? c.slug_es : c.slug_en;
    if (slug) urls.push(`${SITE}/${locale}/${locale === "es" ? "donde-ver-mundial-en" : "how-to-watch-world-cup-in"}-${slug}`);
  }
  for (const p of BLOG_POSTS) {
    const slug = locale === "es" ? p.slug_es : p.slug_en;
    urls.push(`${SITE}/${locale}/blogs/${slug}`);
  }
  const items = urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export const Route = createFileRoute("/sitemap-en.xml")({
  server: {
    handlers: {
      GET: async () => {
        const data = await getAllSlugs();
        return new Response(buildSitemap("en", data), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, s-maxage=3600" },
        });
      },
    },
  },
});
