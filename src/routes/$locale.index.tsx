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
import { notFound } from "@tanstack/react-router";

const WORLD_CUP_START = "2026-06-11T16:00:00Z";

export const Route = createFileRoute("/$locale/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const geo = await detectGeo();
    const data = await getHomepageData({ data: { countryCode: geo.alpha2 } });
    return { ...data, geo, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const m = t(locale);
    const path = `/${locale}`;
    const altPath = `/${locale === "en" ? "es" : "en"}`;
    const { meta, links } = buildMeta({
      title: locale === "en"
        ? "MatchLiveNow — Watch the FIFA World Cup 2026 from any country"
        : "MatchLiveNow — Ver el Mundial FIFA 2026 desde cualquier país",
      description: m.hero.subtitle,
      path,
      altPath,
      locale,
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
  const { live, upcoming, channels, geo, locale } = Route.useLoaderData() as {
    live: import("@/lib/data").Fixture[];
    upcoming: import("@/lib/data").Fixture[];
    channels: import("@/lib/data").Channel[];
    geo: { alpha2: string; alpha3: string };
    locale: Locale;
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

  const countdown = useCountdown(WORLD_CUP_START);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-primary/30 gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
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
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { v: countdown.days, l: m.countdown.days },
              { v: countdown.hours, l: m.countdown.hours },
              { v: countdown.minutes, l: m.countdown.minutes },
              { v: countdown.seconds, l: m.countdown.seconds },
            ].map((c, i) => (
              <div key={i} className="flex min-w-[80px] flex-col items-center border border-primary/40 bg-[var(--surface)] px-4 py-3">
                <span className="font-display text-2xl font-bold tabular-nums text-foreground">
                  <span className="text-primary">[</span>{String(c.v).padStart(2, "0")}<span className="text-primary">]</span>
                </span>
                <span className="mt-1 font-display text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</span>
              </div>
            ))}
            <span className="self-center text-xs uppercase tracking-wider text-muted-foreground">
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
          <div className="grid gap-3 sm:grid-cols-2">
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

function useCountdown(target: string) {
  const targetMs = new Date(target).getTime();
  // Start from target so SSR & first client render match (diff=0), then update on mount.
  const [now, setNow] = useState(targetMs);
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
