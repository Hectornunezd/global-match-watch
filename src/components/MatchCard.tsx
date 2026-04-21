import { Link } from "@tanstack/react-router";
import type { Fixture } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LiveBadge } from "./LiveBadge";
import { Flag } from "./Flag";

interface Props {
  fixture: Fixture;
  locale: Locale;
}

function fmtTime(date: string, locale: Locale): string {
  try {
    // Force UTC to keep SSR (server tz) and client output identical → no hydration mismatch.
    return new Date(date).toLocaleString(locale === "es" ? "es-ES" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  } catch {
    return date;
  }
}

export function MatchCard({ fixture, locale }: Props) {
  const m = t(locale);
  const home = fixture.home_team;
  const away = fixture.away_team;
  const homeName = locale === "es" ? home.name_es : home.name_en;
  const awayName = locale === "es" ? away.name_es : away.name_en;
  const slug = locale === "es" ? fixture.slug_es : fixture.slug_en;
  const isLive = fixture.status === "live";
  const isFinished = fixture.status === "finished";
  const showScore = isLive || isFinished;

  return (
    <Link
      to={localeUrl(locale, slug)}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-[var(--surface-hover)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {fixture.round ?? "World Cup 2026"}
        </span>
        {isLive ? <LiveBadge locale={locale} /> : (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {fmtTime(fixture.match_date, locale)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 min-w-0">
          <Flag src={home.flag_url} name={homeName} className="h-6 w-9 rounded-sm" />
          <span className="truncate font-display text-base uppercase">{homeName}</span>
        </div>
        {showScore ? (
          <span className="font-mono text-xl font-bold tabular-nums">
            {fixture.home_score ?? 0}
            <span className="px-1.5 text-muted-foreground">-</span>
            {fixture.away_score ?? 0}
          </span>
        ) : (
          <span className="font-display text-xs text-muted-foreground">{m.labels.vs}</span>
        )}
        <div className="flex flex-1 items-center justify-end gap-2.5 min-w-0">
          <span className="truncate text-right font-display text-base uppercase">{awayName}</span>
          <Flag src={away.flag_url} name={awayName} className="h-6 w-9 rounded-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-xs text-muted-foreground truncate">
          {fixture.venue ?? ""}
          {fixture.city ? `, ${fixture.city}` : ""}
        </span>
        <span className="text-xs font-medium text-primary group-hover:underline">
          {m.labels.findChannels} →
        </span>
      </div>
    </Link>
  );
}
