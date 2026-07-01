import type { Locale } from "@/lib/i18n";

type R32 = { match: string; winner: string | null; next: string };

const BRACKET = {
  roundOf32: {
    left: [
      { match: "Canada vs South Africa", winner: "Canada", next: "Canada vs Morocco" },
      { match: "Netherlands vs Morocco", winner: "Morocco", next: "Canada vs Morocco" },
      { match: "Germany vs Paraguay", winner: "Paraguay", next: "Paraguay vs France" },
      { match: "France vs Sweden", winner: "France", next: "Paraguay vs France" },
    ] as R32[],
    right: [
      { match: "Brazil vs Japan", winner: "Brazil", next: "Brazil vs Norway" },
      { match: "Ivory Coast vs Norway", winner: "Norway", next: "Brazil vs Norway" },
      { match: "Mexico vs Ecuador", winner: "Mexico", next: "Mexico vs England" },
      { match: "England vs DR Congo", winner: "England", next: "Mexico vs England" },
    ] as R32[],
    bottomLeft: [
      { match: "USA vs Bosnia", winner: null, next: "Winner vs Belgium" },
      { match: "Belgium vs Senegal", winner: "Belgium", next: "Winner of USA/Bosnia vs Belgium" },
      { match: "Portugal vs Croatia", winner: null, next: "Winner vs Spain/Austria" },
      { match: "Spain vs Austria", winner: null, next: "Winner vs Portugal/Croatia" },
    ] as R32[],
    bottomRight: [
      { match: "Switzerland vs Algeria", winner: null, next: "Winner vs Colombia/Ghana" },
      { match: "Colombia vs Ghana", winner: null, next: "Winner vs Switzerland/Algeria" },
      { match: "Argentina vs Cape Verde", winner: null, next: "Winner vs Australia/Egypt" },
      { match: "Australia vs Egypt", winner: null, next: "Winner vs Argentina/Cape Verde" },
    ] as R32[],
  },
  roundOf16: [
    "Canada vs Morocco",
    "Paraguay vs France",
    "Brazil vs Norway",
    "Mexico vs England",
    "TBD vs Belgium",
    "TBD vs TBD",
    "TBD vs TBD",
    "TBD vs TBD",
  ],
  quarterfinals: ["TBD", "TBD", "TBD", "TBD"],
  semifinals: ["TBD", "TBD"],
  final: "TBD vs TBD",
};

function MatchCell({ label, winner, side = "left" }: { label: string; winner?: string | null; side?: "left" | "right" }) {
  const parts = label.split(" vs ");
  return (
    <div
      className={`rounded-md border border-border bg-card px-2 py-1.5 text-[11px] leading-tight ${
        side === "right" ? "text-right" : "text-left"
      }`}
    >
      {parts.map((p, i) => {
        const isWinner = winner && p.trim() === winner;
        return (
          <div
            key={i}
            className={
              isWinner
                ? "font-semibold text-primary"
                : winner && !isWinner
                  ? "text-muted-foreground line-through"
                  : "text-foreground/90"
            }
          >
            {p}
          </div>
        );
      })}
    </div>
  );
}

function Column({ items, side }: { items: { label: string; winner?: string | null }[]; side: "left" | "right" }) {
  return (
    <div className="flex flex-col justify-around gap-2">
      {items.map((it, i) => (
        <MatchCell key={i} label={it.label} winner={it.winner} side={side} />
      ))}
    </div>
  );
}

export function StaticBracket({ locale, title }: { locale: Locale; title?: string }) {
  const { left, right, bottomLeft, bottomRight } = BRACKET.roundOf32;

  const heading =
    title ?? (locale === "es" ? "BRACKET — RONDA DE 32" : "BRACKET — ROUND OF 32");

  const labels = {
    r32: locale === "es" ? "Ronda de 32" : "Round of 32",
    r16: locale === "es" ? "Octavos" : "Round of 16",
    qf: locale === "es" ? "Cuartos" : "QF",
    sf: locale === "es" ? "Semis" : "SF",
    f: locale === "es" ? "Final" : "Final",
    top: locale === "es" ? "Cuadro superior" : "Top half",
    bottom: locale === "es" ? "Cuadro inferior" : "Bottom half",
    champ: locale === "es" ? "CAMPEÓN" : "CHAMPION",
  };

  const renderHalf = (
    leftMatches: R32[],
    rightMatches: R32[],
    r16Left: string[],
    r16Right: string[],
    qfLeft: string,
    qfRight: string,
    sf: string,
    halfLabel: string,
  ) => (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {halfLabel}
      </div>
      <div className="grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.9fr_1fr_1fr] gap-2">
        <Column
          items={leftMatches.map((m) => ({ label: m.match, winner: m.winner }))}
          side="left"
        />
        <Column
          items={r16Left.map((m) => ({ label: m }))}
          side="left"
        />
        <Column items={[{ label: qfLeft }]} side="left" />
        <div className="flex items-center justify-center">
          <div className="rounded-md border border-primary/60 bg-primary/10 px-2 py-2 text-center font-mono text-[10px] uppercase text-primary">
            {sf}
          </div>
        </div>
        <Column items={[{ label: qfRight }]} side="right" />
        <Column
          items={r16Right.map((m) => ({ label: m }))}
          side="right"
        />
        <Column
          items={rightMatches.map((m) => ({ label: m.match, winner: m.winner }))}
          side="right"
        />
      </div>
      <div className="mt-1 grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.9fr_1fr_1fr] gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        <div>{labels.r32}</div>
        <div>{labels.r16}</div>
        <div>{labels.qf}</div>
        <div className="text-center text-primary">{labels.sf}</div>
        <div className="text-right">{labels.qf}</div>
        <div className="text-right">{labels.r16}</div>
        <div className="text-right">{labels.r32}</div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-6 font-display text-3xl uppercase sm:text-4xl">
        <span className="text-primary">[</span> {heading} <span className="text-primary">]</span>
      </h2>

      {/* Desktop bracket */}
      <div className="hidden space-y-10 lg:block">
        {renderHalf(
          left,
          right,
          [BRACKET.roundOf16[0], BRACKET.roundOf16[1]],
          [BRACKET.roundOf16[2], BRACKET.roundOf16[3]],
          BRACKET.quarterfinals[0],
          BRACKET.quarterfinals[1],
          BRACKET.semifinals[0],
          labels.top,
        )}
        {renderHalf(
          bottomLeft,
          bottomRight,
          [BRACKET.roundOf16[4], BRACKET.roundOf16[5]],
          [BRACKET.roundOf16[6], BRACKET.roundOf16[7]],
          BRACKET.quarterfinals[2],
          BRACKET.quarterfinals[3],
          BRACKET.semifinals[1],
          labels.bottom,
        )}

        {/* Final */}
        <div className="flex items-center justify-center pt-4">
          <div className="rounded-xl border-2 border-primary bg-primary/10 p-4 text-center shadow-[0_0_30px_rgba(255,0,0,0.25)]">
            <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
              {labels.f}
            </div>
            <div className="mt-1 font-display text-sm uppercase">{BRACKET.final}</div>
            <div className="mt-1 font-display text-2xl text-primary">★ {labels.champ}</div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet list */}
      <div className="space-y-6 lg:hidden">
        {[
          { title: labels.top + " · " + labels.r32, items: [...left, ...right] },
          { title: labels.bottom + " · " + labels.r32, items: [...bottomLeft, ...bottomRight] },
        ].map((block) => (
          <div key={block.title}>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {block.title}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {block.items.map((m, i) => (
                <div key={i} className="rounded-md border border-border bg-card p-3">
                  <MatchCell label={m.match} winner={m.winner} />
                  <div className="mt-1 font-mono text-[9px] uppercase text-muted-foreground">
                    → {m.next}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {labels.r16}
          </h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BRACKET.roundOf16.map((m, i) => (
              <li key={i} className="rounded-md border border-dashed border-border bg-card/40 px-3 py-2 text-[11px]">
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border-2 border-primary bg-primary/10 p-4 text-center">
          <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
            {labels.f}
          </div>
          <div className="mt-1 font-display text-sm uppercase">{BRACKET.final}</div>
          <div className="mt-1 font-display text-2xl text-primary">★ {labels.champ}</div>
        </div>
      </div>
    </section>
  );
}
