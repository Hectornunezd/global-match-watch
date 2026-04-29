import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale, t } from "@/lib/i18n";
import { getCountryBySlug, type Country, type Channel, type Fixture } from "@/lib/data";
import { ChannelCard } from "@/components/ChannelCard";
import { MatchCard } from "@/components/MatchCard";
import { AdSlot } from "@/components/AdSlot";
import { buildMeta, jsonLdScript, faqJsonLd } from "@/lib/seo";

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
    const { meta, links } = buildMeta({ title, description, path, altPath, locale: "en" });
    const faqs = buildFaqs(c, "en");
    return { meta, links, scripts: [jsonLdScript(faqJsonLd(faqs))] };
  },
  component: () => <CountryGuide locale="en" />,
});

function buildFaqs(c: Country, locale: Locale) {
  if (locale === "es") {
    return [
      { q: `¿Es gratis ver el Mundial 2026 en ${c.name_es}?`, a: `Algunos canales en ${c.name_es} transmiten partidos del Mundial gratis. Revisa la lista de canales arriba.` },
      { q: `¿Qué canal transmite el Mundial 2026 en ${c.name_es}?`, a: `Los principales canales y servicios de streaming en ${c.name_es} aparecen en la guía completa de esta página.` },
      { q: `¿Puedo usar una VPN para ver el Mundial?`, a: `Sí, una VPN te permite acceder a transmisiones disponibles en otros países, incluyendo opciones gratuitas.` },
    ];
  }
  return [
    { q: `Is the World Cup 2026 free to watch in ${c.name_en}?`, a: `Several channels in ${c.name_en} offer free World Cup coverage. See the channel list above.` },
    { q: `What channel is the World Cup 2026 on in ${c.name_en}?`, a: `The main TV and streaming options in ${c.name_en} are listed in the full guide on this page.` },
    { q: `Can I use a VPN to watch the World Cup?`, a: `Yes — a VPN lets you access streams available in other countries, including free options.` },
  ];
}

export function CountryGuide({ locale }: { locale: Locale }) {
  const { country, channels, fixtures } = Route.useLoaderData() as {
    country: Country;
    channels: Channel[];
    fixtures: Fixture[];
  };
  const m = t(locale);
  const name = locale === "es" ? country.name_es : country.name_en;
  const faqs = buildFaqs(country, locale);
  const hasFree = channels.some((c) => c.is_free);

  return (
    <>
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flag_emoji ?? "🏳️"}</span>
            <h1 className="font-display text-3xl uppercase sm:text-5xl">
              {locale === "es" ? `Dónde ver el Mundial 2026 en ${name}` : `How to Watch the World Cup 2026 in ${name}`}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <AdSlot slot="leaderboard" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          <section>
            <h2 className="mb-4 text-2xl">{m.sections.channels}</h2>
            <div className="grid gap-3">
              {channels.map((c) => (
                <ChannelCard key={c.id} channel={c} locale={locale} pageType="country" countryCode={country.code} />
              ))}
            </div>
          </section>

          {!hasFree && (
            <section className="mt-8 rounded-xl border border-primary/40 bg-primary/5 p-5">
              <h3 className="text-lg">{locale === "es" ? "¿Sin opciones gratis? Usa una VPN" : "No free options? Use a VPN"}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "es"
                  ? "Una VPN te permite acceder a transmisiones gratis disponibles en otros países."
                  : "A VPN lets you access free streams available in other countries."}
              </p>
              <a
                href="https://nordvpn.com/?ref=matchlivenow&utm_source=matchlivenow&utm_medium=affiliate&utm_campaign=worldcup2026"
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
              >
                {locale === "es" ? "Probar NordVPN" : "Try NordVPN"}
              </a>
            </section>
          )}

          {fixtures.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-2xl">{m.sections.schedule}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {fixtures.slice(0, 12).map((f) => <MatchCard key={f.id} fixture={f} locale={locale} />)}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 text-2xl">{m.sections.faq}</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="group rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer list-none font-display text-base uppercase">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <AdSlot slot="rectangle" />
        </aside>
      </div>
    </>
  );
}
