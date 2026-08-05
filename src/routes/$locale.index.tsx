import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { isLocale, type Locale, t, localeUrl } from "@/lib/i18n";
import { getHomepageData, getSeason } from "@/lib/data";
import { detectGeo } from "@/lib/geolocation";
import { computeStandings, currentMatchday, byMatchday } from "@/lib/standings";
import { MatchCard } from "@/components/MatchCard";
import { GroupFilter } from "@/components/GroupFilter";
import { StandingsTable } from "@/components/StandingsTable";
import { Liguilla } from "@/components/Liguilla";
import { AdSlot } from "@/components/AdSlot";
import { MatchTimeDebug } from "@/components/MatchTimeDebug";
import { buildMeta, jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import heroTrophy from "@/assets/hero-trophy.jpg";
import { formatLA } from "@/lib/time";
import { useFixturesRealtime } from "@/hooks/use-fixtures-realtime";
import type { Fixture } from "@/lib/data";
import { TeamCrest } from "@/components/TeamCrest";

export const Route = createFileRoute("/$locale/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const geo = await detectGeo();
    const [data, season] = await Promise.all([
      getHomepageData({ data: { countryCode: geo.alpha2 } }),
      getSeason(),
    ]);
    return {
      ...data,
      season,
      geo,
      locale: params.locale as Locale,
      serverNow: Date.now(),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}`;
    const altPath = `/${locale === "en" ? "es" : "en"}`;
    const { meta, links } = buildMeta({
      title:
        locale === "en"
          ? "Watch Liga MX Live — Fixtures, Table & Channels | MatchLiveNow"
          : "Ver Liga MX en vivo — Partidos, tabla y canales | MatchLiveNow",
      description:
        locale === "en"
          ? "Liga MX Apertura 2026 live scores, full schedule, standings and every TV channel and streaming service for your country."
          : "Liga MX Apertura 2026: marcadores en vivo, calendario completo, tabla general y todos los canales de TV y streaming para tu país.",
      path,
      altPath,
      locale,
      ogImage: `https://matchlivenow.com${heroTrophy}`,
      keywords:
        locale === "en"
          ? "Liga MX, where to watch Liga MX, Liga MX standings, Liga MX schedule, Apertura 2026, Liga MX streaming"
          : "Liga MX, dónde ver Liga MX, tabla general Liga MX, calendario Liga MX, Apertura 2026, Liga MX en vivo",
    });
    return {
      meta,
      links,
      scripts: [jsonLdScript([organizationJsonLd(), websiteJsonLd()])],
    };
  },
  component: HomePage,
});

const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000;

function HomePage() {
  const {
    live: liveFromDb,
    upcoming,
    season,
    locale,
    serverNow,
  } = Route.useLoaderData() as {
    live: Fixture[];
    upcoming: Fixture[];
    season: { fixtures: Fixture[] };
    locale: Locale;
    serverNow: number;
  };
  const m = t(locale);
  useFixturesRealtime();

  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Live is derived from wall-clock time; the DB `status` can be stale.
  const live = useMemo(() => {
    const byId = new Map<string, Fixture>();
    const isLiveByTime = (f: Fixture) => {
      const start = new Date(f.match_date).getTime();
      return start <= now && start + MATCH_DURATION_MS > now;
    };
    [...liveFromDb, ...upcoming].forEach((f) => {
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
        if (start <= now && start + MATCH_DURATION_MS > now) return false;
        return start + MATCH_DURATION_MS > now;
      }),
    [upcoming, now],
  );

  const matchdays = useMemo(
    () => byMatchday(futureUpcoming).map((g) => String(g.matchday)),
    [futureUpcoming],
  );
  const [matchday, setMatchday] = useState<string | null>(null);
  const filtered = useMemo(
    () => (matchday ? futureUpcoming.filter((f) => String(f.matchday) === matchday) : futureUpcoming),
    [futureUpcoming, matchday],
  );

  const rows = useMemo(() => computeStandings(season.fixtures), [season.fixtures]);
  const jornada = useMemo(() => currentMatchday(season.fixtures), [season.fixtures]);

  return (
    <>
      {/* Hero */}
      <section className="group relative isolate overflow-hidden border-b border-primary/30 gradient-hero">
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
              [ {m.hero.badge} ]
            </span>
            <h1 className="text-balance mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
              {m.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {m.hero.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#upcoming"
                className="border border-primary bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                ▸ {m.hero.cta}
              </a>
              <Link
                to={localeUrl(locale, "/tabla")}
                className="border border-border px-6 py-3 font-display text-sm uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                ▸ {m.sections.fullTable}
              </Link>
            </div>
          </div>

          <NextMatchBanner
            upcoming={upcoming}
            live={live}
            locale={locale}
            serverNow={serverNow}
            jornada={jornada}
          />
        </div>
      </section>

      {/* Live */}
      {live.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="live-pulse h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
            <h2 className="text-2xl">{m.sections.liveNow}</h2>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {live.map((f) => (
              <MatchCard key={f.id} fixture={f} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AdSlot slot="in-feed" />
      </div>

      {/* Upcoming */}
      <section id="upcoming" className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl">{m.sections.upcoming}</h2>
          <Link
            to={localeUrl(locale, "/calendario")}
            className="font-display text-xs uppercase tracking-wider text-primary hover:underline"
          >
            {m.sections.fullCalendar} →
          </Link>
        </div>
        <div className="mb-5">
          <GroupFilter
            locale={locale}
            groups={matchdays}
            active={matchday}
            onChange={(g) => {
              setMatchday(g);
              if (typeof window !== "undefined") {
                const w = window as unknown as { gtag?: (...a: unknown[]) => void };
                w.gtag?.("event", "match_filter", { matchday: g });
              }
            }}
          />
        </div>
        <div className="grid gap-2 lg:grid-cols-2">
          {filtered.slice(0, 18).map((f) => (
            <MatchCard key={f.id} fixture={f} locale={locale} />
          ))}
        </div>
      </section>

      {/* Standings */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl">{m.sections.standings}</h2>
          <Link
            to={localeUrl(locale, "/tabla")}
            className="font-display text-xs uppercase tracking-wider text-primary hover:underline"
          >
            {m.sections.fullTable} →
          </Link>
        </div>
        <StandingsTable rows={rows} locale={locale} limit={10} showForm={false} />
      </section>

      {/* Country guides nav */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="mb-4 text-xl">{locale === "es" ? "Guías por país" : "Country guides"}</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { code: "MEX", a2: "mx", name: "México" },
            { code: "USA", a2: "us", name: "United States" },
            { code: "CAN", a2: "ca", name: "Canada" },
            { code: "ESP", a2: "es", name: "España" },
            { code: "ARG", a2: "ar", name: "Argentina" },
            { code: "COL", a2: "co", name: "Colombia" },
          ].map((c) => {
            const slug = locale === "es" ? slugMapEs[c.code] ?? "" : slugMapEn[c.code] ?? "";
            const path =
              locale === "es"
                ? `/es/donde-ver-mundial-en-${slug}`
                : `/en/how-to-watch-world-cup-in-${slug}`;
            return (
              <Link
                key={c.code}
                to={path}
                className="flex items-center gap-2 border border-primary/40 bg-[var(--surface)] px-4 py-2 font-display text-xs uppercase tracking-wider transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <img
                  src={`https://flagcdn.com/w40/${c.a2}.png`}
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

      <Liguilla rows={rows} locale={locale} />

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <AdSlot slot="responsive" />
      </div>

      <MatchTimeDebug fixtures={[...live, ...futureUpcoming]} />
    </>
  );
}

const slugMapEn: Record<string, string> = {
  USA: "united-states",
  MEX: "mexico",
  ESP: "spain",
  ARG: "argentina",
  CAN: "canada",
  COL: "colombia",
};
const slugMapEs: Record<string, string> = {
  USA: "estados-unidos",
  MEX: "mexico",
  ESP: "espana",
  ARG: "argentina",
  CAN: "canada",
  COL: "colombia",
};

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
  jornada,
}: {
  upcoming: Fixture[];
  live: Fixture[];
  locale: Locale;
  serverNow: number;
  jornada: number;
}) {
  const m = t(locale);
  const now = useNow(serverNow);
  const next = useMemo(
    () =>
      [...upcoming]
        .filter((f) => new Date(f.match_date).getTime() > now)
        .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())[0],
    [upcoming, now],
  );

  const headline = m.hero.leagueIsOn;
  const nextLabel = locale === "es" ? "Próximo partido" : "Next match";
  const liveLabel = locale === "es" ? "En vivo ahora" : "Live now";
  const happeningNowLabel = locale === "es" ? "EN VIVO AHORA" : "HAPPENING NOW";
  const inLabel = locale === "es" ? "en" : "at";

  const hasLive = live.length > 0;
  const currentMatch = hasLive ? live[0] : null;
  const target = next ? new Date(next.match_date).getTime() : 0;
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  const mm = Math.floor((diff / 60_000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const nextSlug = next ? (locale === "es" ? next.slug_es : next.slug_en) : "";
  const timeStr = next ? formatLA(new Date(next.match_date), locale) : "";
  const currentSlug = currentMatch
    ? locale === "es"
      ? currentMatch.slug_es
      : currentMatch.slug_en
    : "";

  return (
    <div className="mt-10 border border-primary/40 bg-[var(--surface)] p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-primary px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          <span className="live-pulse h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          {headline}
        </span>
        <span className="inline-flex items-center border border-primary/40 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-primary">
          {m.sections.matchday} {jornada}
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
            <div className="mt-1 flex min-w-0 items-center gap-2 font-display text-xl uppercase leading-tight text-foreground transition-colors group-hover/current:text-primary sm:text-2xl">
              <TeamCrest team={currentMatch.home_team} size={28} />
              <span className="truncate">
                {currentMatch.home_team[locale === "es" ? "name_es" : "name_en"]}
              </span>
              <span className="text-primary">·</span>
              <TeamCrest team={currentMatch.away_team} size={28} />
              <span className="truncate">
                {currentMatch.away_team[locale === "es" ? "name_es" : "name_en"]}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {currentMatch.venue ?? ""}
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
              { v: h, l: "hrs" },
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
      ) : null}
    </div>
  );
}
