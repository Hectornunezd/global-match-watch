import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { getSeason } from "@/lib/data";
import { byMatchday, currentMatchday } from "@/lib/standings";
import { MatchCard } from "@/components/MatchCard";
import { GroupFilter } from "@/components/GroupFilter";
import { AdSlot } from "@/components/AdSlot";
import { buildMeta } from "@/lib/seo";
import { formatLA } from "@/lib/time";

export const Route = createFileRoute("/$locale/calendario")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const season = await getSeason();
    return { ...season, locale: params.locale as Locale };
  },
  head: ({ params }) => {
    const locale = (params?.locale as Locale) ?? "es";
    const title =
      locale === "es"
        ? "Calendario Liga MX Apertura 2026 — Jornadas y horarios"
        : "Liga MX Apertura 2026 Schedule — Fixtures & Kickoff Times";
    const description =
      locale === "es"
        ? "Calendario completo del Apertura 2026 jornada por jornada, con horarios en tiempo del centro y dónde ver cada partido."
        : "Full Apertura 2026 schedule matchday by matchday, with Central Time kickoffs and where to watch every game.";
    const { meta, links } = buildMeta({
      title,
      description,
      path: `/${locale}/calendario`,
      altPath: `/${locale === "es" ? "en" : "es"}/calendario`,
      locale,
      keywords:
        locale === "es"
          ? "calendario Liga MX, jornadas Apertura 2026, horarios Liga MX, partidos Liga MX hoy"
          : "Liga MX schedule, Apertura 2026 fixtures, Liga MX kickoff times",
    });
    return { meta, links };
  },
  component: CalendarPage,
});

function CalendarPage() {
  const { fixtures, locale } = Route.useLoaderData();
  const m = t(locale);
  const groups = useMemo(() => byMatchday(fixtures), [fixtures]);
  const [active, setActive] = useState<string | null>(String(currentMatchday(fixtures)));
  const shown = active ? groups.filter((g) => String(g.matchday) === active) : groups;

  return (
    <>
      <section className="border-b border-primary/30 gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            [ {m.hero.badge} ]
          </span>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none sm:text-6xl">
            {m.sections.schedule}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {locale === "es"
              ? "Las 17 jornadas del Apertura 2026, con horarios en tiempo del centro (CT)."
              : "All 17 matchdays of Apertura 2026, with kickoff times in Central Time (CT)."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <GroupFilter
          locale={locale}
          groups={groups.map((g) => String(g.matchday))}
          active={active}
          onChange={setActive}
        />

        {shown.map((g) => (
          <section key={g.matchday} className="mt-8">
            <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-2">
              <h2 className="font-display text-2xl uppercase">
                {m.sections.matchday} {g.matchday}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {formatLA(new Date(g.fixtures[0].match_date), locale, "dayMonth")}
              </span>
            </div>
            <div className="grid gap-2 lg:grid-cols-2">
              {g.fixtures.map((f) => (
                <MatchCard key={f.id} fixture={f} locale={locale} />
              ))}
            </div>
          </section>
        ))}

        <div className="mt-10">
          <AdSlot slot="responsive" />
        </div>
      </div>
    </>
  );
}
