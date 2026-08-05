import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { getSeason } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { Liguilla } from "@/components/Liguilla";
import { StandingsTable } from "@/components/StandingsTable";
import { AdSlot } from "@/components/AdSlot";
import { buildMeta } from "@/lib/seo";
import bracketCover from "@/assets/bracket-cover.jpg";

export const Route = createFileRoute("/$locale/liguilla")({
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
        ? "Liguilla Liga MX Apertura 2026 — Play-in y bracket"
        : "Liga MX Apertura 2026 Liguilla — Play-in & Bracket";
    const description =
      locale === "es"
        ? "Bracket de la liguilla del Apertura 2026: play-in, cuartos, semifinales y final, con la proyección según la tabla general."
        : "Apertura 2026 Liguilla bracket: play-in, quarterfinals, semifinals and final, projected from the current table.";
    const { meta, links } = buildMeta({
      title,
      description,
      path: `/${locale}/liguilla`,
      altPath: `/${locale === "es" ? "en" : "es"}/liguilla`,
      locale,
      keywords:
        locale === "es"
          ? "liguilla Liga MX, play-in Liga MX, bracket Apertura 2026, final Liga MX"
          : "Liga MX liguilla, Liga MX play-in, Apertura 2026 bracket",
    });
    return { meta, links };
  },
  component: LiguillaPage,
});

function LiguillaPage() {
  const { fixtures, locale } = Route.useLoaderData();
  const m = t(locale);
  const rows = computeStandings(fixtures);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={bracketCover}
          alt=""
          width={1920}
          height={700}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            [ {m.hero.badge} ]
          </span>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none sm:text-6xl">
            {locale === "es" ? "Liguilla Apertura 2026" : "Apertura 2026 Liguilla"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {locale === "es"
              ? "Play-in, cuartos, semifinales y final del torneo Apertura 2026."
              : "Play-in, quarterfinals, semifinals and final of the Apertura 2026 tournament."}
          </p>
        </div>
      </section>

      <Liguilla rows={rows} locale={locale} />

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-4 font-display text-2xl uppercase">{m.sections.standings}</h2>
        <StandingsTable rows={rows} locale={locale} showForm={false} />
        <div className="mt-10">
          <AdSlot slot="responsive" />
        </div>
      </section>
    </>
  );
}
