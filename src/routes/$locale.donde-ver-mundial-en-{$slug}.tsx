import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale } from "@/lib/i18n";
import { getCountryBySlug } from "@/lib/data";
import { buildMeta, jsonLdScript, faqJsonLd } from "@/lib/seo";
import { CountryGuide } from "@/components/CountryGuide";
import type { Country, Channel, Fixture } from "@/lib/data";

export const Route = createFileRoute("/$locale/donde-ver-mundial-en-{$slug}")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale !== "es") throw notFound();
  },
  loader: async ({ params }) => {
    const data = await getCountryBySlug({ data: { slug: params.slug, locale: "es" } });
    if (!data.country) throw notFound();
    return { ...data, locale: "es" as const };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.country) return {};
    const c = loaderData.country;
    const path = `/es/donde-ver-mundial-en-${c.slug_es}`;
    const altPath = `/en/how-to-watch-world-cup-in-${c.slug_en}`;
    const title = c.meta_title_es ?? `Dónde ver el Mundial 2026 en ${c.name_es}`;
    const description = c.meta_description_es ?? `Canales y streaming del Mundial 2026 en ${c.name_es}.`;
    const keywords = `dónde ver el Mundial 2026 en ${c.name_es}, canales Mundial 2026 ${c.name_es}, streaming Mundial 2026 ${c.name_es}, FIFA Mundial 2026 ${c.name_es}, ver fútbol ${c.name_es}`;
    const { meta, links } = buildMeta({ title, description, path, altPath, locale: "es", keywords });
    const faqs = [
      { q: `¿Es gratis ver el Mundial 2026 en ${c.name_es}?`, a: `Algunos canales en ${c.name_es} transmiten partidos del Mundial gratis.` },
      { q: `¿Qué canal transmite el Mundial 2026 en ${c.name_es}?`, a: `Los principales canales y servicios de streaming en ${c.name_es} aparecen en la guía completa.` },
      { q: `¿Puedo usar una VPN?`, a: `Sí, una VPN permite acceder a transmisiones disponibles en otros países.` },
    ];
    return { meta, links, scripts: [jsonLdScript(faqJsonLd(faqs))] };
  },
  component: DondeVerPage,
});

function DondeVerPage() {
  const { country, channels, fixtures } = Route.useLoaderData() as {
    country: Country;
    channels: Channel[];
    fixtures: Fixture[];
  };
  return <CountryGuide locale="es" country={country} channels={channels} fixtures={fixtures} />;
}
