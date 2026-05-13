import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCountryBySlug, type Country, type Channel, type Fixture } from "@/lib/data";
import { buildMeta, jsonLdScript, faqJsonLd } from "@/lib/seo";
import { CountryGuide, buildCountryFaqs } from "@/components/CountryGuide";

export const Route = createFileRoute("/$locale/how-to-watch-world-cup-in-{$slug}")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale !== "en") throw notFound();
  },
  loader: async ({ params }) => {
    const data = await getCountryBySlug({ data: { slug: params.slug, locale: "en" } });
    if (!data.country) throw notFound();
    return { ...data, locale: "en" as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.country) return {};
    const c = loaderData.country;
    const path = `/en/how-to-watch-world-cup-in-${c.slug_en}`;
    const altPath = `/es/donde-ver-mundial-en-${c.slug_es}`;
    const title = c.meta_title_en ?? `How to Watch the World Cup 2026 in ${c.name_en}`;
    const description = c.meta_description_en ?? `Channels and streams for the World Cup 2026 in ${c.name_en}.`;
    const keywords = `how to watch World Cup 2026 in ${c.name_en}, ${c.name_en} World Cup channels, ${c.name_en} World Cup streaming, FIFA World Cup 2026 ${c.name_en}, watch soccer ${c.name_en}`;
    const { meta, links } = buildMeta({ title, description, path, altPath, locale: "en", keywords });
    const faqs = buildCountryFaqs(c, "en");
    return { meta, links, scripts: [jsonLdScript(faqJsonLd(faqs))] };
  },
  component: HowToWatchPage,
});

function HowToWatchPage() {
  const { country, channels, fixtures } = Route.useLoaderData() as {
    country: Country;
    channels: Channel[];
    fixtures: Fixture[];
  };
  return <CountryGuide locale="en" country={country} channels={channels} fixtures={fixtures} />;
}
