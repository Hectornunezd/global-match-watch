import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { isLocale, type Locale, t, localeUrl } from "@/lib/i18n";
import { getFixtureBySlug, type Fixture, type Channel } from "@/lib/data";
import { detectGeo, alpha3ToAlpha2 } from "@/lib/geolocation";
import { ChannelCard } from "@/components/ChannelCard";

import { MatchCard } from "@/components/MatchCard";
import { Flag } from "@/components/Flag";
import { CountrySelector } from "@/components/CountrySelector";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { GamblingDisclaimer } from "@/components/GamblingDisclaimer";
import { buildMeta, jsonLdScript, sportsEventJsonLd } from "@/lib/seo";
import { formatLA } from "@/lib/time";
import { trackClick } from "@/lib/affiliates";
import surveooBanner from "@/assets/surveoo-banner.webp";

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
    const title =
      f.meta_title_en ??
      `${f.home_team.name_en} vs ${f.away_team.name_en} — Watch Live | World Cup 2026`;
    const description =
      f.meta_description_en ??
      `How and where to watch ${f.home_team.name_en} vs ${f.away_team.name_en} live at the FIFA World Cup 2026 — TV channels, streaming and free options.`;
    const keywords = `${f.home_team.name_en} vs ${f.away_team.name_en}, watch ${f.home_team.name_en} vs ${f.away_team.name_en} live, ${f.round}, FIFA World Cup 2026, World Cup live stream`;
    const { meta, links } = buildMeta({
      title,
      description,
      path,
      altPath,
      locale: "en",
      ogType: "article",
      keywords,
      ogImage: f.home_team.flag_url ?? undefined,
    });
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
            channels: loaderData.channels.map((c) => ({
              name: c.channel_name,
              url: c.channel_url,
            })),
          }),
        ),
      ],
    };
  },
  component: () => <MatchPage locale="en" />,
});

export function MatchPage({ locale }: { locale: Locale }) {
  const { fixture, channels, related, geo } = useLoaderData({ strict: false }) as {
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
  const [selectedCountryCode, setSelectedCountryCode] = useState(geo.alpha3);

  const localChannels = useMemo(
    () => channels.filter((c) => c.country_code === selectedCountryCode),
    [channels, selectedCountryCode],
  );

  const countryName = useMemo(() => {
    const a2 = alpha3ToAlpha2(selectedCountryCode);
    if (a2) {
      try {
        const dn = new Intl.DisplayNames([locale === "es" ? "es" : "en"], { type: "region" });
        return dn.of(a2) ?? selectedCountryCode;
      } catch {
        /* fall through */
      }
    }
    return selectedCountryCode;
  }, [selectedCountryCode, locale]);

  return (
    <>
      {/* Match header */}
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {fixture.round} •{" "}
            {formatLA(new Date(fixture.match_date), locale, "full")}
          </span>
          <div className="mt-5 grid grid-cols-3 items-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <Flag
                src={home.flag_url}
                name={homeName}
                className="h-14 w-20 sm:h-20 sm:w-28"
                fallbackTextClassName="text-2xl"
              />
              <span className="text-balance text-center font-display text-xl uppercase sm:text-left sm:text-3xl">
                {homeName}
              </span>
            </div>
            <div className="text-center">
              {fixture.status === "scheduled" ? (
                <div className="font-display text-3xl uppercase text-primary sm:text-5xl">
                  [{m.labels.vs}]
                </div>
              ) : (
                <div className="font-display text-4xl font-bold tabular-nums sm:text-6xl">
                  <span className="text-primary">[</span>
                  {String(fixture.home_score ?? 0).padStart(2, "0")}
                  <span className="text-primary">]</span>
                  <span className="px-2 text-muted-foreground">-</span>
                  <span className="text-primary">[</span>
                  {String(fixture.away_score ?? 0).padStart(2, "0")}
                  <span className="text-primary">]</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row-reverse sm:gap-4">
              <Flag
                src={away.flag_url}
                name={awayName}
                className="h-14 w-20 sm:h-20 sm:w-28"
                fallbackTextClassName="text-2xl"
              />
              <span className="text-balance text-center font-display text-xl uppercase sm:text-right sm:text-3xl">
                {awayName}
              </span>
            </div>
          </div>
          {fixture.venue ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {fixture.venue}
              {fixture.city ? `, ${fixture.city}` : ""}
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
                <span className="text-primary">
                  [ {locale === "es" ? "DÓNDE VER" : "WHERE TO WATCH"} ]
                </span>{" "}
                {countryName}
              </h2>
              <CountrySelector
                initialAlpha2={alpha3ToAlpha2(selectedCountryCode) ?? geo.alpha2}
                onChange={setSelectedCountryCode}
              />
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
                    countryCode={selectedCountryCode}
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

          <AdSlot slot="responsive" adSlot="1216235122" />

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
          {selectedCountryCode === "DEU" ? (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
              <h3 className="text-base">
                {locale === "es" ? "Desbloquea más transmisiones" : "Unlock more streams"}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {locale === "es"
                  ? "Accede a transmisiones gratuitas de otros países con una VPN segura."
                  : "Access free streams from other countries with a secure VPN."}
              </p>
              <a
                href="https://lowest-prices.eu/a/QWE9NHN1DNCrGV4"
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() =>
                  trackClick({
                    fixtureId: fixture.id,
                    countryCode: selectedCountryCode,
                    affiliatePartner: "lowest-prices-vpn",
                    channelName: "VPN DE",
                    pageType: "match",
                  })
                }
                className="mt-3 block rounded-md bg-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
              >
                {locale === "es" ? "Obtener VPN →" : "Get VPN →"}
              </a>
              <AffiliateDisclosure locale={locale} className="mt-2" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <a
                href="https://price-low.eu/a/PND3Mi5LYpC6mPM"
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() =>
                  trackClick({
                    fixtureId: fixture.id,
                    countryCode: selectedCountryCode,
                    affiliatePartner: "surveoo",
                    channelName: "Surveoo",
                    pageType: "match",
                  })
                }
                className="block transition-opacity hover:opacity-90"
              >
                <img
                  src={surveooBanner}
                  alt={
                    locale === "es"
                      ? "Surveoo - Gana hasta 7€ por encuesta"
                      : "Surveoo - Earn up to €7 per survey"
                  }
                  loading="lazy"
                  className="block w-full"
                />
                <div className="p-4">
                  <h3 className="text-base">
                    {locale === "es" ? "Gana hasta 7€ por encuesta" : "Earn up to €7 per survey"}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {locale === "es"
                      ? "Únete a la comunidad Surveoo y gana dinero contestando encuestas pagadas."
                      : "Join the Surveoo community and earn money by completing paid surveys."}
                  </p>
                  <span className="mt-3 block rounded-md bg-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    {locale === "es" ? "Empezar ahora →" : "Start now →"}
                  </span>
                </div>
              </a>
              <div className="px-4 pb-4">
                <AffiliateDisclosure locale={locale} />
              </div>
            </div>
          )}
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
