import { Link } from "@tanstack/react-router";
import type { StandingRow } from "@/lib/standings";
import { localeUrl, t, type Locale } from "@/lib/i18n";

function Slot({
  row,
  seed,
  locale,
}: {
  row?: StandingRow;
  seed: string;
  locale: Locale;
}) {
  if (!row) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 font-mono text-[11px] uppercase text-muted-foreground">
        <span className="inline-flex h-5 w-7 items-center justify-center border border-dashed border-border text-[9px]">
          {seed}
        </span>
        <span>—</span>
      </div>
    );
  }
  const name = locale === "es" ? row.team.name_es : row.team.name_en;
  const slug = locale === "es" ? row.team.slug_es : row.team.slug_en;
  return (
    <Link
      to={localeUrl(locale, `/team/${slug}`)}
      className="flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-primary/10"
    >
      <span className="inline-flex h-5 w-7 shrink-0 items-center justify-center border border-primary/40 font-mono text-[9px] text-primary">
        {row.team.short_code ?? seed}
      </span>
      <span className="truncate font-display text-[11px] uppercase tracking-wide">{name}</span>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">{row.points}</span>
    </Link>
  );
}

function Tie({
  title,
  a,
  b,
  seedA,
  seedB,
  locale,
}: {
  title: string;
  a?: StandingRow;
  b?: StandingRow;
  seedA: string;
  seedB: string;
  locale: Locale;
}) {
  return (
    <div className="border border-border bg-[var(--surface)]">
      <div className="border-b border-border px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-primary">
        {title}
      </div>
      <Slot row={a} seed={seedA} locale={locale} />
      <div className="mx-2 border-t border-border/60" />
      <Slot row={b} seed={seedB} locale={locale} />
    </div>
  );
}

export function Liguilla({ rows, locale }: { rows: StandingRow[]; locale: Locale }) {
  const m = t(locale);
  const at = (pos: number) => rows[pos - 1];

  const playIn = [
    { title: locale === "es" ? "Play-in · 7 vs 8" : "Play-in · 7 vs 8", a: at(7), b: at(8), sa: "7", sb: "8" },
    { title: locale === "es" ? "Play-in · 9 vs 10" : "Play-in · 9 vs 10", a: at(9), b: at(10), sa: "9", sb: "10" },
  ];

  const quarters = [
    { title: "QF1 · 1 vs 8", a: at(1), b: undefined, sa: "1", sb: "G" },
    { title: "QF2 · 2 vs 7", a: at(2), b: undefined, sa: "2", sb: "G" },
    { title: "QF3 · 3 vs 6", a: at(3), b: at(6), sa: "3", sb: "6" },
    { title: "QF4 · 4 vs 5", a: at(4), b: at(5), sa: "4", sb: "5" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          [ {m.sections.liguilla} ]
        </span>
        <h2 className="mt-2 font-display text-3xl uppercase leading-none sm:text-4xl">
          {locale === "es" ? "Camino al título" : "Road to the title"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {locale === "es"
            ? "Proyección con la tabla actual: los 6 primeros van directo a cuartos y del 7 al 10 disputan el play-in."
            : "Projection based on the current table: the top 6 go straight to the quarterfinals, places 7 to 10 play the play-in."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
            Play-in
          </h3>
          {playIn.map((p) => (
            <Tie
              key={p.title}
              title={p.title}
              a={p.a}
              b={p.b}
              seedA={p.sa}
              seedB={p.sb}
              locale={locale}
            />
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Cuartos de final" : "Quarterfinals"}
          </h3>
          {quarters.map((q) => (
            <Tie
              key={q.title}
              title={q.title}
              a={q.a}
              b={q.b}
              seedA={q.sa}
              seedB={q.sb}
              locale={locale}
            />
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Semifinales" : "Semifinals"}
          </h3>
          <Tie title="SF1" seedA="W QF1" seedB="W QF4" locale={locale} />
          <Tie title="SF2" seedA="W QF2" seedB="W QF3" locale={locale} />
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Final" : "Final"}
          </h3>
          <div className="border-2 border-primary bg-primary/10 p-3 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            <div className="mb-1 text-center font-mono text-[9px] uppercase tracking-wider text-primary">
              {locale === "es" ? "Final · Diciembre 2026" : "Final · December 2026"}
            </div>
            <Slot seed="W SF1" locale={locale} />
            <Slot seed="W SF2" locale={locale} />
            <div className="mt-2 text-center font-display text-lg text-primary">★</div>
          </div>
        </div>
      </div>
    </section>
  );
}
