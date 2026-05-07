import { Link } from "@tanstack/react-router";
import type { Fixture } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LiveBadge } from "./LiveBadge";
import matchCover from "@/assets/match-cover.jpg";
import mexicoImg from "@/assets/teams/mexico.jpg";
import brazilImg from "@/assets/teams/brazil.jpg";

const TEAM_IMAGES: Record<string, string> = {
  MEX: mexicoImg,
  BRA: brazilImg,
};

function pickCover(homeCode?: string, awayCode?: string): string {
  if (homeCode && TEAM_IMAGES[homeCode]) return TEAM_IMAGES[homeCode];
  if (awayCode && TEAM_IMAGES[awayCode]) return TEAM_IMAGES[awayCode];
  return matchCover;
}

interface Props {
  fixture: Fixture;
  locale: Locale;
}

function fmtTime(date: string, locale: Locale): string {
  try {
    return new Date(date).toLocaleString(locale === "es" ? "es-ES" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " HRS";
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
  const venueLine = [fixture.venue, fixture.city].filter(Boolean).join(" | ").toUpperCase();

  return (
    <Link
      to={localeUrl(locale, slug)}
      className="group relative isolate flex aspect-square flex-col overflow-hidden border border-border bg-[var(--surface)] transition-colors hover:border-primary"
    >
      {/* Background image — grayscale, turns red duotone on hover */}
      <img
        src={pickCover(home.country_code, away.country_code)}
        alt=""
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale transition-all duration-500 group-hover:opacity-90"
      />
      {/* Red duotone overlay on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-primary/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-primary/45"
      />
      {/* Dark vignette for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Top: time / live */}
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            {isLive ? "" : fmtTime(fixture.match_date, locale)}
          </span>
          {isLive && <LiveBadge locale={locale} />}
        </div>

        {/* Bottom: title block */}
        <div>
          <h3 className="font-display text-3xl font-bold uppercase leading-[0.95] text-foreground transition-colors duration-300 group-hover:text-primary sm:text-4xl">
            {homeName}{" "}
            <span className="text-primary group-hover:text-foreground">[{showScore ? String(fixture.home_score ?? 0).padStart(2, "0") : m.labels.vs}]</span>
            <br />
            {showScore ? (
              <>
                <span className="text-primary group-hover:text-foreground">[{String(fixture.away_score ?? 0).padStart(2, "0")}]</span>{" "}
                {awayName}
              </>
            ) : (
              awayName
            )}
          </h3>

          {venueLine && (
            <p className="mt-3 font-display text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground/90">
              {venueLine}
            </p>
          )}

          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            ▸ {m.labels.watchNow}
          </span>
        </div>
      </div>
    </Link>
  );
}
