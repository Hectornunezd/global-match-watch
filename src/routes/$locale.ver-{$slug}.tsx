import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale } from "@/lib/i18n";
import { getFixtureBySlug } from "@/lib/data";
import { detectGeo } from "@/lib/geolocation";
import { buildMeta, jsonLdScript, sportsEventJsonLd } from "@/lib/seo";
import { MatchPage } from "./$locale.watch-{$slug}";

export const Route = createFileRoute("/$locale/ver-{$slug}")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale !== "es") throw notFound();
  },
  loader: async ({ params }) => {
    const slug = `ver-${params.slug}`;
    const [data, geo] = await Promise.all([
      getFixtureBySlug({ data: { slug, locale: "es" } }),
      detectGeo(),
    ]);
    if (!data.fixture) throw notFound();
    return { ...data, geo, locale: "es" as const };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.fixture) return {};
    const f = loaderData.fixture;
    const path = `/es/${f.slug_es}`;
    const altPath = `/en/${f.slug_en}`;
    const title = f.meta_title_es ?? `${f.home_team.name_es} vs ${f.away_team.name_es} — Ver en vivo | Mundial 2026`;
    const description = f.meta_description_es ?? `Cómo y dónde ver ${f.home_team.name_es} vs ${f.away_team.name_es} en vivo en el Mundial FIFA 2026 — canales de TV, streaming y opciones gratis.`;
    const keywords = `${f.home_team.name_es} vs ${f.away_team.name_es}, ver ${f.home_team.name_es} vs ${f.away_team.name_es} en vivo, ${f.round}, Mundial FIFA 2026, transmisión en vivo Mundial`;
    const { meta, links } = buildMeta({ title, description, path, altPath, locale: "es", ogType: "article", keywords, ogImage: f.home_team.flag_url ?? undefined });
    return {
      meta,
      links,
      scripts: [
        jsonLdScript(
          sportsEventJsonLd({
            homeName: f.home_team.name_es,
            awayName: f.away_team.name_es,
            startDate: f.match_date,
            venue: f.venue,
            city: f.city,
            url: `https://matchlivenow.com${path}`,
            channels: loaderData.channels.map((c) => ({ name: c.channel_name, url: c.channel_url })),
          })
        ),
      ],
    };
  },
  component: () => <MatchPage locale="es" />,
});
