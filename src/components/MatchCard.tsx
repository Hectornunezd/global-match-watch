import { Link } from "@tanstack/react-router";
import type { Fixture } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LiveBadge } from "./LiveBadge";
import { formatLA } from "@/lib/time";
import matchCover from "@/assets/match-cover.jpg";
import mexicoImg from "@/assets/teams/mexico.jpg";
import mexico2Img from "@/assets/teams/mexico-2.jpg";
import brazilImg from "@/assets/teams/brazil.jpg";
import argentinaImg from "@/assets/teams/argentina.jpg";
import argentina2Img from "@/assets/teams/argentina-2.jpg";
import usaImg from "@/assets/teams/usa.jpg";
import usa2Img from "@/assets/teams/usa-2.jpg";
import usa3Img from "@/assets/teams/usa-3.jpg";
import canadaImg from "@/assets/teams/canada.jpg";
import germanyImg from "@/assets/teams/germany.jpg";
import germany2Img from "@/assets/teams/germany-2.jpg";
import germany3Img from "@/assets/teams/germany-3.jpg";
import haitiImg from "@/assets/teams/haiti.jpg";
import haiti2Img from "@/assets/teams/haiti-2.jpg";
import koreaImg from "@/assets/teams/korea.jpg";
import korea2Img from "@/assets/teams/korea-2.jpg";
import japanImg from "@/assets/teams/japan.jpg";
import japan2Img from "@/assets/teams/japan-2.jpg";
import englandImg from "@/assets/teams/england.jpg";
import england2Img from "@/assets/teams/england-2.jpg";
import england3Img from "@/assets/teams/england-3.jpg";
import england4Img from "@/assets/teams/england-4.jpg";
import england5Img from "@/assets/teams/england-5.jpg";
import england6Img from "@/assets/teams/england-6.jpg";
import england7Img from "@/assets/teams/england-7.jpg";
import england8Img from "@/assets/teams/england-8.jpg";
import uzbekistanImg from "@/assets/teams/uzbekistan.jpg";
import austriaImg from "@/assets/teams/austria.jpg";
import saudiArabiaImg from "@/assets/teams/saudi-arabia.jpg";
import ivoryImg from "@/assets/teams/ivory-coast.jpg";
import paraguayImg from "@/assets/teams/paraguay.jpg";
import turkeyImg from "@/assets/teams/turkey.jpg";
import australiaImg from "@/assets/teams/australia.jpg";
import moroccoImg from "@/assets/teams/morocco.jpg";
import scotlandImg from "@/assets/teams/scotland.jpg";
import bosniaImg from "@/assets/teams/bosnia.jpg";
import switzerlandImg from "@/assets/teams/switzerland.jpg";
import qatarImg from "@/assets/teams/qatar.jpg";
import czechImg from "@/assets/teams/czech.jpg";
import tunisiaImg from "@/assets/teams/tunisia.jpg";
import netherlandsImg from "@/assets/teams/netherlands.jpg";
import swedenImg from "@/assets/teams/sweden.webp";
import ecuadorImg from "@/assets/teams/ecuador.jpg";
import curacaoImg from "@/assets/teams/curacao.jpg";
import spainImg from "@/assets/teams/spain.jpg";
import spain2Img from "@/assets/teams/spain-2.jpg";
import belgiumImg from "@/assets/teams/belgium.jpg";
import uruguayImg from "@/assets/teams/uruguay.jpg";
import colombiaImg from "@/assets/teams/colombia.jpg";
import ecuador2Img from "@/assets/teams/ecuador-2.jpg";
import ivory2Img from "@/assets/teams/ivory-coast-2.jpg";
import australia2Img from "@/assets/teams/australia-2.jpg";
import australia3Img from "@/assets/teams/australia-3.jpg";
import qatar2Img from "@/assets/teams/qatar-2.jpg";
import portugalImg from "@/assets/teams/portugal.jpg";
import norwayImg from "@/assets/teams/norway.jpg";
import senegalImg from "@/assets/teams/senegal.jpg";
import franceImg from "@/assets/teams/france.jpg";
import brazil2Img from "@/assets/teams/brazil-2.jpg";
import croatiaImg from "@/assets/teams/croatia.jpg";
import panamaImg from "@/assets/teams/panama.jpg";
import jordanImg from "@/assets/teams/jordan.jpg";
import iranImg from "@/assets/teams/iran.jpg";
import newZealandImg from "@/assets/teams/new-zealand.jpg";
import portugal2Img from "@/assets/teams/portugal-2.jpg";

const TEAM_IMAGES: Record<string, string[]> = {
  MEX: [mexicoImg, mexico2Img], MX: [mexicoImg, mexico2Img],
  BRA: [brazilImg, brazil2Img], BR: [brazilImg, brazil2Img],
  ARG: [argentinaImg, argentina2Img], AR: [argentinaImg, argentina2Img],
  USA: [usaImg, usa2Img, usa3Img], US: [usaImg, usa2Img, usa3Img],
  CAN: [canadaImg], CA: [canadaImg],
  GER: [germanyImg, germany2Img, germany3Img], DE: [germanyImg, germany2Img, germany3Img], DEU: [germanyImg, germany2Img, germany3Img],
  HAI: [haitiImg, haiti2Img], HT: [haitiImg, haiti2Img], HTI: [haitiImg, haiti2Img],
  KOR: [koreaImg, korea2Img], KR: [koreaImg, korea2Img],
  JPN: [japanImg, japan2Img], JP: [japanImg, japan2Img],
  ENG: [englandImg, england2Img, england3Img, england4Img, england5Img, england6Img, england7Img, england8Img], GB: [englandImg, england2Img, england3Img, england4Img, england5Img, england6Img, england7Img, england8Img], GBR: [englandImg, england2Img, england3Img, england4Img, england5Img, england6Img, england7Img, england8Img], "GB-ENG": [englandImg, england2Img, england3Img, england4Img, england5Img, england6Img, england7Img, england8Img],
  CIV: [ivoryImg, ivory2Img], CI: [ivoryImg, ivory2Img], IVC: [ivoryImg, ivory2Img],
  PAR: [paraguayImg], PY: [paraguayImg], PRY: [paraguayImg],
  TUR: [turkeyImg], TR: [turkeyImg],
  AUS: [australiaImg, australia2Img, australia3Img], AU: [australiaImg, australia2Img, australia3Img],
  MAR: [moroccoImg], MA: [moroccoImg], MOR: [moroccoImg],
  SCO: [scotlandImg], SCT: [scotlandImg],
  BIH: [bosniaImg], BA: [bosniaImg], BOS: [bosniaImg],
  SUI: [switzerlandImg], CH: [switzerlandImg], CHE: [switzerlandImg], SWI: [switzerlandImg],
  QAT: [qatarImg, qatar2Img], QA: [qatarImg, qatar2Img],
  CZE: [czechImg], CZ: [czechImg],
  TUN: [tunisiaImg], TN: [tunisiaImg],
  NED: [netherlandsImg], NL: [netherlandsImg], NLD: [netherlandsImg], HOL: [netherlandsImg],
  SWE: [swedenImg], SE: [swedenImg],
  ECU: [ecuadorImg, ecuador2Img], EC: [ecuadorImg, ecuador2Img],
  CUW: [curacaoImg], CW: [curacaoImg], CUR: [curacaoImg],
  ESP: [spainImg, spain2Img], ES: [spainImg, spain2Img], SPA: [spainImg, spain2Img],
  BEL: [belgiumImg], BE: [belgiumImg],
  URU: [uruguayImg], UY: [uruguayImg], URY: [uruguayImg],
  COL: [colombiaImg], CO: [colombiaImg],
  POR: [portugalImg, portugal2Img], PT: [portugalImg, portugal2Img], PRT: [portugalImg, portugal2Img],
  NOR: [norwayImg], NO: [norwayImg],
  SEN: [senegalImg], SN: [senegalImg],
  FRA: [franceImg], FR: [franceImg],
  CRO: [croatiaImg], HR: [croatiaImg], HRV: [croatiaImg],
  PAN: [panamaImg], PA: [panamaImg],
  JOR: [jordanImg], JO: [jordanImg], JRD: [jordanImg],
  IRN: [iranImg], IR: [iranImg], IRI: [iranImg],
  NZL: [newZealandImg], NZ: [newZealandImg],
  UZB: [uzbekistanImg], UZ: [uzbekistanImg],
  AUT: [austriaImg], AT: [austriaImg],
  KSA: [saudiArabiaImg], SAU: [saudiArabiaImg], SA: [saudiArabiaImg], ARS: [saudiArabiaImg],
};

// Per-fixture overrides: force a specific image pool for known matches.
const FIXTURE_IMAGE_OVERRIDES: Record<string, string[]> = {
  // England vs Ghana
  "ef65d3a5-1ff2-4e80-8cd6-4f683395485f": [england6Img, england7Img, england8Img],
};

function pickCover(id: string, homeCode?: string, awayCode?: string): string {
  const override = FIXTURE_IMAGE_OVERRIDES[id];
  if (override) {
    return override[0];
  }
  // Prefer the home team's cover (first team in the match).
  if (homeCode && TEAM_IMAGES[homeCode]) {
    const pool = TEAM_IMAGES[homeCode];
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 131 + id.charCodeAt(i)) >>> 0;
    return pool[h % pool.length];
  }
  if (awayCode && TEAM_IMAGES[awayCode]) {
    const pool = TEAM_IMAGES[awayCode];
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 131 + id.charCodeAt(i)) >>> 0;
    return pool[h % pool.length];
  }
  return matchCover;
}

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
        src={pickCover(fixture.id, home.country_code, away.country_code)}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
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
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-primary/80">
              {fmtDate(fixture.match_date, locale)}
            </span>
            {!isLive && (
              <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
                {fmtTime(fixture.match_date, locale)}
              </span>
            )}
          </div>
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
