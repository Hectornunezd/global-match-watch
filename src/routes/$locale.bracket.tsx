import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { isLocale, type Locale, localeUrl } from "@/lib/i18n";
import { getHomepageData, type Fixture } from "@/lib/data";
import { buildMeta } from "@/lib/seo";
import bracketCover from "@/assets/bracket-cover.jpg";
import { StaticBracket } from "@/components/StaticBracket";

export const Route = createFileRoute("/$locale/bracket")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const data = await getHomepageData({ data: {} });
    return { ...data, locale: params.locale as Locale };
  },
  head: ({ params }) => {
    const locale = (params?.locale as Locale) ?? "en";
    const title =
      locale === "es"
        ? "Bracket del Mundial 2026 — Mapa Completo de Eliminatorias"
        : "World Cup 2026 Bracket — Full Knockout Map";
    const description =
      locale === "es"
        ? "Visualiza el bracket completo del Mundial 2026: Ronda de 32, Octavos, Cuartos, Semifinales y Final."
        : "View the full FIFA World Cup 2026 bracket: Round of 32, Round of 16, Quarterfinals, Semifinals and Final.";
    const { meta, links } = buildMeta({
      title,
      description,
      path: `/${locale}/bracket`,
      altPath: `/${locale === "es" ? "en" : "es"}/bracket`,
      locale,
      ogType: "website",
    });
    return { meta, links };
  },
  component: BracketPage,
});

function BracketPage() {
  const { upcoming, live, locale } = Route.useLoaderData();
  const r32: Fixture[] = [...live, ...upcoming]
    .filter((f) => f.round === "Round of 32")
    .sort(
      (a, b) =>
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime(),
    );

  // Build 16 R32 slots; if not enough fixtures, pad with placeholder
  const r32Slots = Array.from({ length: 16 }, (_, i) => r32[i] ?? null);

  // Split into top/bottom halves of bracket
  const topHalf = r32Slots.slice(0, 8);
  const bottomHalf = r32Slots.slice(8, 16);

  const labels = {
    title: locale === "es" ? "BRACKET MUNDIAL 2026" : "WORLD CUP 2026 BRACKET",
    subtitle:
      locale === "es"
        ? "Mapa completo de eliminatorias: del Round of 32 a la Final"
        : "Full knockout map: from Round of 32 to the Final",
    rounds: {
      r32: locale === "es" ? "Ronda de 32" : "Round of 32",
      r16: locale === "es" ? "Octavos" : "Round of 16",
      qf: locale === "es" ? "Cuartos" : "Quarterfinals",
      sf: locale === "es" ? "Semifinales" : "Semifinals",
      f: locale === "es" ? "Final" : "Final",
    },
    tbd: locale === "es" ? "POR DEFINIR" : "TBD",
    champion: locale === "es" ? "CAMPEÓN" : "CHAMPION",
  };

  return (
    <>
      {/* Hero cover */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={bracketCover}
          alt=""
          width={1920}
          height={700}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            [ FIFA WORLD CUP 2026 ]
          </span>
          <h1 className="mt-3 font-display text-4xl uppercase leading-none sm:text-6xl md:text-7xl">
            {labels.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {labels.subtitle}
          </p>
        </div>
      </section>

      <StaticBracket locale={locale} title={labels.title} />
    </>
  );
}

function BracketColumn({
  fixtures,
  locale,
  labels,
  side,
}: {
  fixtures: (Fixture | null)[];
  locale: Locale;
  labels: { tbd: string };
  side: "left" | "right";
}) {
  return (
    <div className="hidden flex-col justify-around gap-2 sm:flex">
      {fixtures.map((f, i) => (
        <BracketMatch key={i} fixture={f} locale={locale} labels={labels} side={side} />
      ))}
    </div>
  );
}

function BracketMatch({
  fixture,
  locale,
  labels,
  side,
}: {
  fixture: Fixture | null;
  locale: Locale;
  labels: { tbd: string };
  side: "left" | "right";
}) {
  if (!fixture) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card/40 p-2 text-center font-mono text-[10px] uppercase text-muted-foreground">
        {labels.tbd}
      </div>
    );
  }
  const slug = locale === "es" ? fixture.slug_es : fixture.slug_en;
  const home = locale === "es" ? fixture.home_team.name_es : fixture.home_team.name_en;
  const away = locale === "es" ? fixture.away_team.name_es : fixture.away_team.name_en;
  const dateStr = formatLA(new Date(fixture.match_date), locale, "dayMonth");
  return (
    <Link
      to={localeUrl(locale, slug)}
      className={`group block rounded-md border border-border bg-card p-2 text-[11px] leading-tight transition-colors hover:border-primary hover:bg-primary/5 ${
        side === "right" ? "text-right" : "text-left"
      }`}
    >
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-primary">
        {dateStr}
      </div>
      <div className="mt-1 truncate font-medium">{home}</div>
      <div className="truncate text-muted-foreground">{away}</div>
    </Link>
  );
}

function PlaceholderColumn({
  count,
  labels,
}: {
  count: number;
  labels: { tbd: string };
}) {
  return (
    <div className="hidden flex-col justify-around gap-2 sm:flex">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-md border border-dashed border-border bg-card/40 p-2 text-center font-mono text-[10px] uppercase text-muted-foreground"
        >
          {labels.tbd}
        </div>
      ))}
    </div>
  );
}
