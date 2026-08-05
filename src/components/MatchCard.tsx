import { Link } from "@tanstack/react-router";
import type { Fixture, Team } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LiveBadge } from "./LiveBadge";
import { formatLA } from "@/lib/time";
import { TeamCrest } from "./TeamCrest";


interface Props {
  fixture: Fixture;
  locale: Locale;
}

function fmtDate(date: string, locale: Locale): string {
  try {
    return formatLA(new Date(date), locale, "dayMonth");
  } catch {
    return date;
  }
}

function fmtTime(date: string, locale: Locale): string {
  try {
    return formatLA(new Date(date), locale, "time");
  } catch {
    return date;
  }
}

function TeamBadge({ team }: { team: Team }) {
  return <TeamCrest team={team} size={32} />;
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
  const venueLine = [fixture.venue, fixture.city].filter(Boolean).join(" | ").toUpperCase();

  return (
    <Link
      to={localeUrl(locale, slug)}
      className="group flex items-center gap-4 border border-border bg-[var(--surface)] px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5"
    >
      {/* Date / time */}
      <div className="flex w-16 shrink-0 flex-col leading-tight">
        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {fmtDate(fixture.match_date, locale)}
        </span>
        {isLive ? (
          <LiveBadge locale={locale} />
        ) : (
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            {fmtTime(fixture.match_date, locale)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TeamBadge team={home} />
          <span className="min-w-0 flex-1 truncate font-display text-base font-bold uppercase leading-none text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {homeName}
          </span>
          {showScore && (
            <span className="font-display text-lg font-bold text-primary">
              {String(fixture.home_score ?? 0)}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <TeamBadge team={away} />
          <span className="min-w-0 flex-1 truncate font-display text-base font-bold uppercase leading-none text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {awayName}
          </span>
          {showScore && (
            <span className="font-display text-lg font-bold text-primary">
              {String(fixture.away_score ?? 0)}
            </span>
          )}
        </div>
        {venueLine && (
          <p className="mt-2 truncate font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {venueLine}
          </p>
        )}
      </div>

      {/* CTA */}
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-primary px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:inline-flex">
        ▸ {m.labels.watchNow}
      </span>
    </Link>
  );
}
