import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { isLocale, t, localeUrl, type Locale } from "@/lib/i18n";
import { getSeason } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/StandingsTable";
import { AdSlot } from "@/components/AdSlot";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/$locale/tabla")({
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
        ? "Tabla general Liga MX Apertura 2026 — Posiciones actualizadas"
        : "Liga MX Apertura 2026 Table — Live Standings";
    const description =
      locale === "es"
        ? "Tabla general de la Liga MX Apertura 2026: puntos, partidos jugados, diferencia de goles y zona de liguilla y play-in."
        : "Liga MX Apertura 2026 standings: points, games played, goal difference and the Liguilla and play-in zones.";
    const { meta, links } = buildMeta({
      title,
      description,
      path: `/${locale}/tabla`,
      altPath: `/${locale === "es" ? "en" : "es"}/tabla`,
      locale,
      keywords:
        locale === "es"
          ? "tabla general Liga MX, posiciones Liga MX, Apertura 2026, tabla Liga MX hoy"
          : "Liga MX table, Liga MX standings, Apertura 2026 standings",
    });
    return { meta, links };
  },
  component: TablePage,
});

function TablePage() {
  const { fixtures, locale } = Route.useLoaderData();
  const m = t(locale);
  const rows = computeStandings(fixtures);

  return (
    <>
      <section className="border-b border-primary/30 gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            [ {m.hero.badge} ]
          </span>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none sm:text-6xl">
            {m.sections.standings}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {locale === "es"
              ? "Posiciones del torneo Apertura 2026, actualizadas con cada resultado."
              : "Apertura 2026 standings, updated with every result."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <StandingsTable rows={rows} locale={locale} />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={localeUrl(locale, "/calendario")}
            className="border border-primary px-5 py-2.5 font-display text-xs uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            ▸ {m.sections.fullCalendar}
          </Link>
          <Link
            to={localeUrl(locale, "/liguilla")}
            className="border border-border px-5 py-2.5 font-display text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            ▸ {m.sections.liguilla}
          </Link>
        </div>
        <div className="mt-10">
          <AdSlot slot="responsive" />
        </div>
      </div>
    </>
  );
}
