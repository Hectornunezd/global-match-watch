import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { isLocale, type Locale, t, localeUrl } from "@/lib/i18n";
import { getHomepageData } from "@/lib/data";
import { detectGeo } from "@/lib/geolocation";
import { MatchCard } from "@/components/MatchCard";
import { GroupFilter } from "@/components/GroupFilter";
import { CountrySelector } from "@/components/CountrySelector";
import { AdSlot } from "@/components/AdSlot";
import { StaticBracket } from "@/components/StaticBracket";

import { buildMeta, jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import heroTrophy from "@/assets/hero-trophy.jpg";
import { notFound } from "@tanstack/react-router";
import { formatLA } from "@/lib/time";

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
        ? "Watch FIFA World Cup 2026 Live — MatchLiveNow"
        : "Ver el Mundial FIFA 2026 en vivo — MatchLiveNow",
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
  const { live: liveFromDb, upcoming, channels, geo, locale, serverNow } = Route.useLoaderData() as {
    live: import("@/lib/data").Fixture[];
    upcoming: import("@/lib/data").Fixture[];
    channels: import("@/lib/data").Channel[];
    geo: { alpha2: string; alpha3: string };
    locale: Locale;
    serverNow: number;
  };
  const m = t(locale);
  const [group, setGroup] = useState<string | null>(null);
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  // Hide matches whose kickoff has already passed (with ~2.5h grace for in-progress games).
  const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000;
  // Derive "live" purely from wall-clock time in America/Los_Angeles: any match
  // whose kickoff has started but hasn't exceeded the grace window is live now.
  // We ignore the DB `status` field because it can be stale.
  const live = useMemo(() => {
    const byId = new Map<string, import("@/lib/data").Fixture>();
    const isLiveByTime = (f: import("@/lib/data").Fixture) => {
      const start = new Date(f.match_date).getTime();
      return start <= now && start + MATCH_DURATION_MS > now;
    };
    liveFromDb.forEach((f) => {
      if (isLiveByTime(f)) byId.set(f.id, f);
    });
    upcoming.forEach((f) => {
      if (isLiveByTime(f)) byId.set(f.id, f);
    });
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime(),
    );
  }, [liveFromDb, upcoming, now]);
  const futureUpcoming = useMemo(
    () =>
      upcoming.filter((f) => {
        const start = new Date(f.match_date).getTime();
        // Exclude matches already considered "live" so they don't appear twice.
        if (start <= now && start + MATCH_DURATION_MS > now) return false;
        return start + MATCH_DURATION_MS > now;
      }),
    [upcoming, now],
  );
  const groups = useMemo(() => {
    const g = new Set<string>();
    futureUpcoming.forEach((f) => {
      if (f.round?.startsWith("Group ")) g.add(f.round.replace("Group ", ""));
    });
    return Array.from(g).sort();
  }, [futureUpcoming]);
  const filtered = useMemo(() => {
    if (!group) return futureUpcoming;
    return futureUpcoming.filter((f) => f.round === `Group ${group}`);
  }, [futureUpcoming, group]);



  

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

          {/* World Cup is here — next match */}
          <NextMatchBanner upcoming={upcoming} live={live} locale={locale} serverNow={serverNow} />

        </div>
      </section>




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

      {/* In-feed ad between Live and Upcoming */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AdSlot slot="in-feed" />
      </div>

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

      <StaticBracket locale={locale} />

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

function useNow(initialNow: number) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function NextMatchBanner({
  upcoming,
  live,
  locale,
  serverNow,
}: {
  upcoming: import("@/lib/data").Fixture[];
  live: import("@/lib/data").Fixture[];
  locale: Locale;
  serverNow: number;
}) {
  const now = useNow(serverNow);
  const next = useMemo(() => {
    return [...upcoming]
      .filter((f) => new Date(f.match_date).getTime() > now)
      .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())[0];
  }, [upcoming, now]);

  const headline = locale === "es" ? "El Mundial está aquí" : "The World Cup is here";
  const nextLabel = locale === "es" ? "Próximo partido" : "Next match";
  const liveLabel = locale === "es" ? "En vivo ahora" : "Live now";
  const happeningNowLabel = locale === "es" ? "EN VIVO AHORA" : "HAPPENING NOW";
  const inLabel = locale === "es" ? "en" : "in";

  const hasLive = live.length > 0;
  const currentMatch = hasLive ? live[0] : null;
  const target = next ? new Date(next.match_date).getTime() : 0;
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  const mm = Math.floor((diff / 60_000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const nextSlug = next ? (locale === "es" ? next.slug_es : next.slug_en) : "";
  const nextPath = next ? `/${locale}/${locale === "es" ? "ver" : "watch"}-${nextSlug}` : "#";
  const timeStr = next ? formatLA(new Date(next.match_date), locale) : "";

  const currentSlug = currentMatch ? (locale === "es" ? currentMatch.slug_es : currentMatch.slug_en) : "";

  return (
    <div className="mt-10 border border-primary/40 bg-[var(--surface)] p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-primary px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          <span className="live-pulse h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          {headline}
        </span>
        {hasLive && (
          <span className="inline-flex items-center gap-1.5 border border-[var(--success)]/40 bg-[var(--success)]/10 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            {liveLabel} · {live.length}
          </span>
        )}
      </div>

      {currentMatch ? (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to={localeUrl(locale, currentSlug)} className="group/current min-w-0 flex-1">
            <div className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--success)]">
              <span className="live-pulse mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              [ {happeningNowLabel} ]
            </div>
            <div className="mt-1 truncate font-display text-xl uppercase leading-tight text-foreground transition-colors group-hover/current:text-primary sm:text-2xl">
              {currentMatch.home_team[locale === "es" ? "name_es" : "name_en"]}
              <span className="mx-2 text-primary">·</span>
              {currentMatch.away_team[locale === "es" ? "name_es" : "name_en"]}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {currentMatch.venue ? `${currentMatch.venue}` : ""}
              {currentMatch.home_score !== null && currentMatch.away_score !== null
                ? ` — ${currentMatch.home_score} : ${currentMatch.away_score}`
                : ""}
            </div>
          </Link>
          <div className="flex flex-col items-center justify-center border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-3">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
              LIVE
            </span>
          </div>
        </div>
      ) : next ? (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to={localeUrl(locale, nextSlug)} className="group/next min-w-0 flex-1">
            <div className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              [ {nextLabel} ]
            </div>
            <div className="mt-1 truncate font-display text-xl uppercase leading-tight text-foreground transition-colors group-hover/next:text-primary sm:text-2xl">
              {next.home_team[locale === "es" ? "name_es" : "name_en"]}
              <span className="mx-2 text-primary">·</span>
              {next.away_team[locale === "es" ? "name_es" : "name_en"]}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {timeStr}
              {next.venue ? ` ${inLabel} ${next.venue}` : ""}
            </div>
          </Link>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {[
              { v: d, l: locale === "es" ? "días" : "days" },
              { v: h, l: locale === "es" ? "hrs" : "hrs" },
              { v: mm, l: "min" },
              { v: s, l: locale === "es" ? "seg" : "sec" },
            ].map((c, i) => (
              <div
                key={i}
                className="flex min-w-[44px] flex-col items-center border border-primary/40 px-2 py-1.5"
              >
                <span className="font-mono text-lg font-bold tabular-nums text-foreground sm:text-xl">
                  {String(c.v).padStart(2, "0")}
                </span>
                <span className="font-display text-[8px] uppercase tracking-wider text-muted-foreground sm:text-[9px]">
                  {c.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">
          {locale === "es"
            ? "Mira los partidos en vivo y la lista completa abajo."
            : "Check the live matches and full schedule below."}
        </div>
      )}
    </div>
  );
}
