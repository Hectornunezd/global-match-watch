import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { isLocale, type Locale, t, localeUrl } from "@/lib/i18n";
import { getHomepageData } from "@/lib/data";
import { detectGeo } from "@/lib/geolocation";
import { MatchCard } from "@/components/MatchCard";
import { GroupFilter } from "@/components/GroupFilter";
import { CountrySelector } from "@/components/CountrySelector";
import { AdSlot } from "@/components/AdSlot";
import { WhereToWatch } from "@/components/WhereToWatch";
import { buildMeta, jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import heroTrophy from "@/assets/hero-trophy.jpg";
import { notFound } from "@tanstack/react-router";

const WORLD_CUP_START = "2026-06-11T16:00:00Z";

export const Route = createFileRoute("/$locale/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const geo = await detectGeo();
    const data = await getHomepageData({ data: { countryCode: geo.alpha2 } });
    return { ...data, geo, locale: params.locale as Locale, serverNow: Date.now() };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const m = t(locale);
    const path = `/${locale}`;
    const altPath = `/${locale === "en" ? "es" : "en"}`;
    const { meta, links } = buildMeta({
      title: locale === "en"
        ? "MatchLiveNow — Watch the FIFA World Cup 2026 Live from Any Country"
        : "MatchLiveNow — Ver el Mundial FIFA 2026 en vivo desde cualquier país",
      description: locale === "en"
        ? "Live scores, fixtures and every TV channel and streaming service for the FIFA World Cup 2026 — free and paid options for your country."
        : "Marcadores en vivo, calendario y todos los canales de TV y streaming del Mundial FIFA 2026 — opciones gratis y de pago para tu país.",
      path,
      altPath,
      locale,
      ogImage: `https://matchlivenow.com${heroTrophy}`,
      keywords: locale === "en"
        ? "FIFA World Cup 2026, where to watch World Cup 2026, World Cup 2026 streaming, World Cup 2026 live, World Cup channels, World Cup TV schedule, watch soccer live"
        : "Mundial 2026, dónde ver el Mundial 2026, Mundial FIFA 2026 en vivo, canales Mundial 2026, streaming Mundial 2026, ver fútbol en vivo, transmisión Mundial",
    });
    return {
      meta,
      links,
      scripts: [jsonLdScript([organizationJsonLd(), websiteJsonLd()])],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { live, upcoming, channels, geo, locale, serverNow } = Route.useLoaderData() as {
    live: import("@/lib/data").Fixture[];
    upcoming: import("@/lib/data").Fixture[];
    channels: import("@/lib/data").Channel[];
    geo: { alpha2: string; alpha3: string };
    locale: Locale;
    serverNow: number;
  };
  const m = t(locale);
  const [group, setGroup] = useState<string | null>(null);
  const groups = useMemo(() => {
    const g = new Set<string>();
    upcoming.forEach((f) => {
      if (f.round?.startsWith("Group ")) g.add(f.round.replace("Group ", ""));
    });
    return Array.from(g).sort();
  }, [upcoming]);
  const filtered = useMemo(() => {
    if (!group) return upcoming;
    return upcoming.filter((f) => f.round === `Group ${group}`);
  }, [upcoming, group]);

  const countdown = useCountdown(WORLD_CUP_START, serverNow);

  return (
    <>
      {/* Hero */}
      <section className="group relative isolate overflow-hidden border-b border-primary/30 gradient-hero">
        {/* Background trophy image — visible on hover */}
        <img
          src={heroTrophy}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-0 grayscale transition-opacity duration-700 group-hover:opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              [ FIFA WORLD CUP 2026 ]
            </span>
            <h1 className="text-balance mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
              {m.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{m.hero.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#upcoming"
                className="border border-primary bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                ▸ {m.hero.cta}
              </a>
              <CountrySelector
                initialAlpha2={geo.alpha2}
                onChange={(alpha3) => {
                  const g = countryToGroup[alpha3];
                  if (g) setGroup(g);
                  if (typeof window !== "undefined") {
                    const el = document.getElementById("upcoming");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              />
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-10 flex flex-col items-start gap-3 lg:flex-row lg:items-center">
            <div className="grid w-full max-w-[640px] grid-cols-2 gap-3 min-[520px]:grid-cols-4">
              {[
                { v: countdown.days, l: m.countdown.days },
                { v: countdown.hours, l: m.countdown.hours },
                { v: countdown.minutes, l: m.countdown.minutes },
                { v: countdown.seconds, l: m.countdown.seconds },
              ].map((c, i) => (
                <div key={i} className="flex min-w-0 flex-col items-center justify-center border border-primary/40 bg-[var(--surface)] px-2 py-3 sm:px-4">
                  <span className="grid grid-cols-[auto_2.2ch_auto] items-baseline justify-center gap-1 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl">
                    <span className="text-primary">[</span>
                    <span className="block text-center font-mono text-[0.82em] leading-none tracking-normal tabular-nums">{String(c.v).padStart(2, "0")}</span>
                    <span className="text-primary">]</span>
                  </span>
                  <span className="mt-2 font-display text-[10px] uppercase leading-none tracking-wider text-muted-foreground">{c.l}</span>
                </div>
              ))}
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {m.countdown.to}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AdSlot slot="leaderboard" />
      </div>

      {/* Where to watch from user's country */}
      <WhereToWatch channels={channels} countryCode={geo.alpha2} locale={locale} />

      {/* Live */}
      {live.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="live-pulse h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
            <h2 className="text-2xl">{m.sections.liveNow}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((f) => (
              <MatchCard key={f.id} fixture={f} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section id="upcoming" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl">{m.sections.upcoming}</h2>
        </div>
        <div className="mb-5">
          <GroupFilter locale={locale} groups={groups} active={group} onChange={(g) => {
            setGroup(g);
            if (typeof window !== "undefined") {
              const w = window as unknown as { gtag?: (...a: unknown[]) => void };
              w.gtag?.("event", "match_filter", { group: g });
            }
          }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <MatchCard key={f.id} fixture={f} locale={locale} />
          ))}
        </div>
      </section>

      {/* Country guides nav */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="mb-4 text-xl">{locale === "es" ? "Guías por país" : "Country guides"}</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { code: "USA", a2: "us", name: "United States" },
            { code: "GBR", a2: "gb", name: "United Kingdom" },
            { code: "MEX", a2: "mx", name: "Mexico" },
            { code: "ESP", a2: "es", name: "Spain" },
            { code: "ARG", a2: "ar", name: "Argentina" },
            { code: "BRA", a2: "br", name: "Brazil" },
            { code: "CAN", a2: "ca", name: "Canada" },
            { code: "AUS", a2: "au", name: "Australia" },
          ].map((c) => {
            const slug = locale === "es"
              ? slugMapEs[c.code] ?? ""
              : slugMapEn[c.code] ?? "";
            const path = locale === "es"
              ? `/es/donde-ver-mundial-en-${slug}`
              : `/en/how-to-watch-world-cup-in-${slug}`;
            return (
              <Link
                key={c.code}
                to={path}
                className="flex items-center gap-2 border border-primary/40 bg-[var(--surface)] px-4 py-2 font-display text-xs uppercase tracking-wider transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <img
                  src={flagUrl(c.a2)}
                  alt=""
                  loading="lazy"
                  className="h-4 w-6 object-cover"
                />
                <span>{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <AdSlot slot="responsive" />
      </div>
    </>
  );
}

const slugMapEn: Record<string, string> = {
  USA: "united-states", GBR: "united-kingdom", MEX: "mexico", ESP: "spain",
  ARG: "argentina", BRA: "brazil", CAN: "canada", AUS: "australia",
};
const slugMapEs: Record<string, string> = {
  USA: "estados-unidos", GBR: "reino-unido", MEX: "mexico", ESP: "espana",
  ARG: "argentina", BRA: "brasil", CAN: "canada", AUS: "australia",
};

// Map alpha3 country codes to their World Cup 2026 group letter.
const countryToGroup: Record<string, string> = {
  MEX: "A", KOR: "A",
  CAN: "B", QAT: "B",
  BRA: "C",
  USA: "D", AUS: "D",
  DEU: "E",
  JPN: "F",
  GBR: "L", // England
  ESP: "H", SAU: "H",
  FRA: "I",
  ARG: "J",
  COL: "K",
};

// Flag CDN URL for country guides list (alpha2 lowercase).
const flagUrl = (alpha2: string) =>
  `https://flagcdn.com/w40/${alpha2.toLowerCase()}.png`;

function useCountdown(target: string, initialNow: number) {
  const targetMs = new Date(target).getTime();
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
