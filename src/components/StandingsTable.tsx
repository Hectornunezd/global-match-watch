import { Link } from "@tanstack/react-router";
import type { StandingRow } from "@/lib/standings";
import { t, localeUrl, type Locale } from "@/lib/i18n";

const FORM_COLORS: Record<string, string> = {
  W: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/40",
  D: "bg-white/5 text-muted-foreground border-white/15",
  L: "bg-primary/20 text-primary border-primary/40",
};

export function StandingsTable({
  rows,
  locale,
  limit,
  showForm = true,
}: {
  rows: StandingRow[];
  locale: Locale;
  limit?: number;
  showForm?: boolean;
}) {
  const m = t(locale);
  const list = limit ? rows.slice(0, limit) : rows;

  return (
    <div className="overflow-x-auto border border-border bg-[var(--surface)]">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-primary/40 text-left font-display text-[10px] uppercase tracking-wider text-primary">
            <th className="px-3 py-2 text-center">{m.table.pos}</th>
            <th className="px-3 py-2">{m.table.club}</th>
            <th className="px-2 py-2 text-center">{m.table.played}</th>
            <th className="px-2 py-2 text-center">{m.table.won}</th>
            <th className="px-2 py-2 text-center">{m.table.drawn}</th>
            <th className="px-2 py-2 text-center">{m.table.lost}</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell">{m.table.goalsFor}</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell">{m.table.goalsAgainst}</th>
            <th className="px-2 py-2 text-center">{m.table.goalDiff}</th>
            <th className="px-3 py-2 text-center">{m.table.points}</th>
            {showForm && (
              <th className="hidden px-3 py-2 text-center md:table-cell">{m.table.form}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {list.map((r, i) => {
            const pos = i + 1;
            const zone =
              pos <= 6
                ? "border-l-2 border-l-[var(--success)]"
                : pos <= 10
                  ? "border-l-2 border-l-primary"
                  : "border-l-2 border-l-transparent";
            const name = locale === "es" ? r.team.name_es : r.team.name_en;
            const slug = locale === "es" ? r.team.slug_es : r.team.slug_en;
            return (
              <tr
                key={r.team.id}
                className={`border-b border-border/60 transition-colors hover:bg-primary/5 ${zone}`}
              >
                <td className="px-3 py-2 text-center font-mono text-xs text-muted-foreground">
                  {pos}
                </td>
                <td className="px-3 py-2">
                  <Link
                    to={localeUrl(locale, `/team/${slug}`)}
                    className="flex items-center gap-2 font-display text-xs uppercase tracking-wide text-foreground hover:text-primary"
                  >
                    <TeamCrest team={r.team} size={22} />

                    <span className="truncate">{name}</span>
                  </Link>
                </td>
                <td className="px-2 py-2 text-center font-mono text-xs">{r.played}</td>
                <td className="px-2 py-2 text-center font-mono text-xs">{r.won}</td>
                <td className="px-2 py-2 text-center font-mono text-xs">{r.drawn}</td>
                <td className="px-2 py-2 text-center font-mono text-xs">{r.lost}</td>
                <td className="hidden px-2 py-2 text-center font-mono text-xs sm:table-cell">
                  {r.goalsFor}
                </td>
                <td className="hidden px-2 py-2 text-center font-mono text-xs sm:table-cell">
                  {r.goalsAgainst}
                </td>
                <td className="px-2 py-2 text-center font-mono text-xs text-muted-foreground">
                  {r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}
                </td>
                <td className="px-3 py-2 text-center font-display text-sm font-bold text-primary">
                  {r.points}
                </td>
                {showForm && (
                  <td className="hidden px-3 py-2 md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {r.form.length === 0 ? (
                        <span className="font-mono text-[10px] text-muted-foreground">—</span>
                      ) : (
                        r.form.map((f, k) => (
                          <span
                            key={k}
                            className={`inline-flex h-4 w-4 items-center justify-center border font-mono text-[9px] ${FORM_COLORS[f]}`}
                          >
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-4 border-t border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-[var(--success)]" /> {m.table.liguillaZone}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-primary" /> {m.table.playInZone}
        </span>
      </div>
    </div>
  );
}
