import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Country, Channel, Fixture } from "@/lib/data";
import { ChannelCard } from "@/components/ChannelCard";
import { MatchCard } from "@/components/MatchCard";
import { AdSlot } from "@/components/AdSlot";

export function buildCountryFaqs(c: Country, locale: Locale) {
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

interface Props {
  locale: Locale;
  country: Country;
  channels: Channel[];
  fixtures: Fixture[];
}

export function CountryGuide({ locale, country, channels, fixtures }: Props) {
  const m = t(locale);
  const name = locale === "es" ? country.name_es : country.name_en;
  const faqs = buildCountryFaqs(country, locale);
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
