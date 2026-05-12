import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { isLocale, type Locale, t, localeUrl } from "@/lib/i18n";
import { getFixtureBySlug, type Fixture, type Channel } from "@/lib/data";
import { detectGeo, alpha3ToAlpha2 } from "@/lib/geolocation";
import { ChannelCard } from "@/components/ChannelCard";
import { VPNUpsell } from "@/components/VPNUpsell";
import { MatchCard } from "@/components/MatchCard";
import { Flag } from "@/components/Flag";
import { CountrySelector } from "@/components/CountrySelector";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { GamblingDisclaimer } from "@/components/GamblingDisclaimer";
import { buildMeta, jsonLdScript, sportsEventJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/$locale/watch-{$slug}")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale !== "en") throw notFound();
  },
  loader: async ({ params }) => {
    const slug = `watch-${params.slug}`;
    const [data, geo] = await Promise.all([
      getFixtureBySlug({ data: { slug, locale: "en" } }),
      detectGeo(),
    ]);
    if (!data.fixture) throw notFound();
    return { ...data, geo, locale: "en" as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.fixture) return {};
    const f = loaderData.fixture;
    const path = `/en/${f.slug_en}`;
    const altPath = `/es/${f.slug_es}`;
    const title = f.meta_title_en ?? `${f.home_team.name_en} vs ${f.away_team.name_en} — Watch live`;
    const description = f.meta_description_en ?? `How to watch ${f.home_team.name_en} vs ${f.away_team.name_en} at the World Cup 2026.`;
    const { meta, links } = buildMeta({ title, description, path, altPath, locale: "en", ogType: "article" });
    return {
      meta,
      links,
      scripts: [
        jsonLdScript(
          sportsEventJsonLd({
            homeName: f.home_team.name_en,
            awayName: f.away_team.name_en,
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
  component: () => <MatchPage locale="en" />,
});

export function MatchPage({ locale }: { locale: Locale }) {
  const { fixture, channels, related, geo } = Route.useLoaderData() as {
    fixture: Fixture;
    channels: Channel[];
    related: Fixture[];
    geo: { alpha2: string; alpha3: string };
  };
  const m = t(locale);
  const home = fixture.home_team;
  const away = fixture.away_team;
  const homeName = locale === "es" ? home.name_es : home.name_en;
  const awayName = locale === "es" ? away.name_es : away.name_en;

  const localChannels = useMemo(
    () => channels.filter((c) => c.country_code === geo.alpha3),
    [channels, geo.alpha3]
  );
  const hasFreeLocal = localChannels.some((c) => c.is_free);
  const altCountryWithFree = useMemo(() => {
    const c = channels.find((c) => c.is_free && c.country_code !== geo.alpha3);
    return c?.country_code ?? null;
  }, [channels, geo.alpha3]);

  const countryName = useMemo(() => {
    const map: Record<string, string> = {
      USA: locale === "es" ? "Estados Unidos" : "United States",
      GBR: locale === "es" ? "Reino Unido" : "United Kingdom",
      CAN: locale === "es" ? "Canadá" : "Canada",
      AUS: "Australia",
      MEX: locale === "es" ? "México" : "Mexico",
      ESP: locale === "es" ? "España" : "Spain",
      ARG: "Argentina",
      COL: "Colombia",
      BRA: locale === "es" ? "Brasil" : "Brazil",
      FRA: locale === "es" ? "Francia" : "France",
      DEU: locale === "es" ? "Alemania" : "Germany",
      ITA: locale === "es" ? "Italia" : "Italy",
      JPN: locale === "es" ? "Japón" : "Japan",
      KOR: locale === "es" ? "Corea del Sur" : "South Korea",
      IND: "India",
      SAU: locale === "es" ? "Arabia Saudita" : "Saudi Arabia",
      QAT: "Qatar",
    };
    return map[geo.alpha3] ?? geo.alpha3;
  }, [geo.alpha3, locale]);

  return (
    <>
      {/* Match header */}
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {fixture.round} • {new Date(fixture.match_date).toLocaleString(locale === "es" ? "es-ES" : "en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </span>
          <div className="mt-5 grid grid-cols-3 items-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <Flag src={home.flag_url} name={homeName} className="h-14 w-20 sm:h-20 sm:w-28" fallbackTextClassName="text-2xl" />
              <span className="text-balance text-center font-display text-xl uppercase sm:text-left sm:text-3xl">{homeName}</span>
            </div>
            <div className="text-center">
              {fixture.status === "scheduled" ? (
                <div className="font-display text-3xl uppercase text-primary sm:text-5xl">[{m.labels.vs}]</div>
              ) : (
                <div className="font-display text-4xl font-bold tabular-nums sm:text-6xl">
                  <span className="text-primary">[</span>{String(fixture.home_score ?? 0).padStart(2, "0")}<span className="text-primary">]</span>
                  <span className="px-2 text-muted-foreground">-</span>
                  <span className="text-primary">[</span>{String(fixture.away_score ?? 0).padStart(2, "0")}<span className="text-primary">]</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row-reverse sm:gap-4">
              <Flag src={away.flag_url} name={awayName} className="h-14 w-20 sm:h-20 sm:w-28" fallbackTextClassName="text-2xl" />
              <span className="text-balance text-center font-display text-xl uppercase sm:text-right sm:text-3xl">{awayName}</span>
            </div>
          </div>
          {fixture.venue ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {fixture.venue}{fixture.city ? `, ${fixture.city}` : ""}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <AdSlot slot="leaderboard" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          {/* Where to watch */}
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-primary pb-2">
              <h2 className="font-display text-2xl uppercase">
                <span className="text-primary">[ {locale === "es" ? "DÓNDE VER" : "WHERE TO WATCH"} ]</span> {countryName}
              </h2>
              <CountrySelector initialAlpha2={geo.alpha2} />
            </div>
            {localChannels.length > 0 ? (
              <div className="grid gap-3">
                {localChannels.map((c) => (
                  <ChannelCard
                    key={c.id}
                    channel={c}
                    locale={locale}
                    fixture={fixture}
                    pageType="match"
                    countryCode={geo.alpha3}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                {locale === "es"
                  ? "No hay canales conocidos en tu país. Prueba con una VPN para acceder a transmisiones desde otros países."
                  : "No known channels in your country yet. Try a VPN to access streams from other countries."}
              </p>
            )}
          </section>

          {!hasFreeLocal && altCountryWithFree ? (
            <div className="mt-6">
              <VPNUpsell
                locale={locale}
                countryWithFreeStream={altCountryWithFree}
                countryCode={geo.alpha3}
                fixtureId={fixture.id}
              />
            </div>
          ) : null}

          {/* Other matches */}
          {related.length > 0 ? (
            <section className="mt-10">
              <h2 className="mb-4 text-xl">{m.sections.otherMatches}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((f) => (
                  <MatchCard key={f.id} fixture={f} locale={locale} />
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-8">
            <AdSlot slot="responsive" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base">{m.sections.odds}</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {locale === "es"
                ? "Cuotas y promociones de socios. Apuesta de forma responsable."
                : "Odds and promotions from partners. Bet responsibly."}
            </p>
            <a
              href="https://bet365.com/?ref=matchlivenow&utm_source=matchlivenow&utm_medium=affiliate&utm_campaign=worldcup2026"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-3 block rounded-md bg-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
            >
              bet365 →
            </a>
            <AffiliateDisclosure locale={locale} className="mt-2" />
            <GamblingDisclaimer locale={locale} countryCode={geo.alpha2} className="mt-3" />
          </div>
          <AdSlot slot="rectangle" />
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            {m.labels.notIn} {countryName}?{" "}
            <Link to={localeUrl(locale)} className="text-primary hover:underline">
              {m.labels.changeCountry}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
