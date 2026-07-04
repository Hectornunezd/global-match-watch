import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { laWallClockToEpoch } from "@/lib/time";

/**
 * Static World Cup 2026 knockout bracket.
 * Format inspired by FIFA-style bracket cards: flag + 3-letter code,
 * date/time on top, match ID on the side, winner underlined in primary.
 */

type Team = { code: string; flag: string; name: string };

const T: Record<string, Team> = {
  CAN: { code: "CAN", flag: "🇨🇦", name: "Canada" },
  RSA: { code: "RSA", flag: "🇿🇦", name: "South Africa" },
  NED: { code: "NED", flag: "🇳🇱", name: "Netherlands" },
  MAR: { code: "MAR", flag: "🇲🇦", name: "Morocco" },
  GER: { code: "GER", flag: "🇩🇪", name: "Germany" },
  PAR: { code: "PAR", flag: "🇵🇾", name: "Paraguay" },
  FRA: { code: "FRA", flag: "🇫🇷", name: "France" },
  SWE: { code: "SWE", flag: "🇸🇪", name: "Sweden" },
  BRA: { code: "BRA", flag: "🇧🇷", name: "Brazil" },
  JPN: { code: "JPN", flag: "🇯🇵", name: "Japan" },
  CIV: { code: "CIV", flag: "🇨🇮", name: "Ivory Coast" },
  NOR: { code: "NOR", flag: "🇳🇴", name: "Norway" },
  MEX: { code: "MEX", flag: "🇲🇽", name: "Mexico" },
  ECU: { code: "ECU", flag: "🇪🇨", name: "Ecuador" },
  ENG: { code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "England" },
  COD: { code: "COD", flag: "🇨🇩", name: "DR Congo" },
  USA: { code: "USA", flag: "🇺🇸", name: "United States" },
  BIH: { code: "BIH", flag: "🇧🇦", name: "Bosnia & Herzegovina" },
  BEL: { code: "BEL", flag: "🇧🇪", name: "Belgium" },
  SEN: { code: "SEN", flag: "🇸🇳", name: "Senegal" },
  ESP: { code: "ESP", flag: "🇪🇸", name: "Spain" },
  AUT: { code: "AUT", flag: "🇦🇹", name: "Austria" },
  POR: { code: "POR", flag: "🇵🇹", name: "Portugal" },
  CRO: { code: "CRO", flag: "🇭🇷", name: "Croatia" },
  SUI: { code: "SUI", flag: "🇨🇭", name: "Switzerland" },
  ALG: { code: "ALG", flag: "🇩🇿", name: "Algeria" },
  AUS: { code: "AUS", flag: "🇦🇺", name: "Australia" },
  EGY: { code: "EGY", flag: "🇪🇬", name: "Egypt" },
  ARG: { code: "ARG", flag: "🇦🇷", name: "Argentina" },
  CPV: { code: "CPV", flag: "🇨🇻", name: "Cape Verde" },
  COL: { code: "COL", flag: "🇨🇴", name: "Colombia" },
  GHA: { code: "GHA", flag: "🇬🇭", name: "Ghana" },
};

type Match = {
  id: string;
  date: string; // DD/MM/YYYY
  time: string; // HH:MM (LA time)
  home: Team;
  away: Team;
  homeScore?: number;
  awayScore?: number;
  winner?: "home" | "away";
  status?: "scheduled" | "finished";
};

const M: Record<string, Match> = {
  M81: { id: "M81", date: "28/06/2026", time: "12:00", home: T.CAN, away: T.RSA, homeScore: 1, awayScore: 0, winner: "home", status: "finished" },
  M82: { id: "M82", date: "29/06/2026", time: "10:00", home: T.BRA, away: T.JPN, homeScore: 2, awayScore: 1, winner: "home", status: "finished" },
  M83: { id: "M83", date: "29/06/2026", time: "13:00", home: T.GER, away: T.PAR, homeScore: 1, awayScore: 2, winner: "away", status: "finished" },
  M84: { id: "M84", date: "29/06/2026", time: "18:00", home: T.NED, away: T.MAR, homeScore: 0, awayScore: 1, winner: "away", status: "finished" },
  M85: { id: "M85", date: "30/06/2026", time: "10:00", home: T.CIV, away: T.NOR, homeScore: 0, awayScore: 2, winner: "away", status: "finished" },
  M86: { id: "M86", date: "30/06/2026", time: "14:00", home: T.FRA, away: T.SWE, homeScore: 3, awayScore: 1, winner: "home", status: "finished" },
  M87: { id: "M87", date: "30/06/2026", time: "18:00", home: T.MEX, away: T.ECU, homeScore: 2, awayScore: 0, winner: "home", status: "finished" },
  M88: { id: "M88", date: "01/07/2026", time: "09:00", home: T.ENG, away: T.COD, homeScore: 2, awayScore: 1, winner: "home", status: "finished" },
  M89: { id: "M89", date: "01/07/2026", time: "13:00", home: T.BEL, away: T.SEN, homeScore: 3, awayScore: 2, winner: "home", status: "finished" },
  M90: { id: "M90", date: "01/07/2026", time: "17:00", home: T.USA, away: T.BIH, homeScore: 2, awayScore: 0, winner: "home", status: "finished" },
  M91: { id: "M91", date: "02/07/2026", time: "12:00", home: T.ESP, away: T.AUT, homeScore: 3, awayScore: 0, winner: "home", status: "finished" },
  M92: { id: "M92", date: "02/07/2026", time: "16:00", home: T.POR, away: T.CRO, homeScore: 2, awayScore: 1, winner: "home", status: "finished" },
  M93: { id: "M93", date: "02/07/2026", time: "20:00", home: T.SUI, away: T.ALG, homeScore: 2, awayScore: 0, winner: "home", status: "finished" },
  M94: { id: "M94", date: "03/07/2026", time: "11:00", home: T.AUS, away: T.EGY, homeScore: 1, awayScore: 1, winner: "away", status: "finished" },
  M95: { id: "M95", date: "03/07/2026", time: "15:00", home: T.ARG, away: T.CPV, homeScore: 3, awayScore: 2, winner: "home", status: "finished" },
  M96: { id: "M96", date: "03/07/2026", time: "18:30", home: T.COL, away: T.GHA, homeScore: 1, awayScore: 0, winner: "home", status: "finished" },
};

/* Round of 16 pairings (winner codes: W<matchId>) */
type BracketMatch = { id: string; a: string; b: string; date: string; time: string; homeScore?: number; awayScore?: number; winner?: "home" | "away"; status?: "scheduled" | "finished" };

const R16: BracketMatch[] = [
  { id: "M97", a: "M81", b: "M84", date: "04/07/2026", time: "10:00", homeScore: 0, awayScore: 3, winner: "away", status: "finished" }, // CAN 0-3 MAR
  { id: "M98", a: "M83", b: "M86", date: "04/07/2026", time: "14:00", homeScore: 0, awayScore: 0 }, // PAR vs FRA (live)
  { id: "M99", a: "M82", b: "M85", date: "05/07/2026", time: "13:00" }, // BRA vs NOR
  { id: "M100", a: "M87", b: "M88", date: "05/07/2026", time: "17:00" }, // MEX vs ENG
  { id: "M101", a: "M90", b: "M89", date: "06/07/2026", time: "17:00" }, // USA vs BEL
  { id: "M102", a: "M92", b: "M91", date: "06/07/2026", time: "12:00" }, // POR vs ESP
  { id: "M103", a: "M93", b: "M96", date: "07/07/2026", time: "13:00" }, // SUI vs COL
  { id: "M104", a: "M95", b: "M94", date: "07/07/2026", time: "09:00" }, // ARG vs EGY
];

const QF = [
  { id: "M105", a: "M97", b: "M98", date: "10/07/2026", time: "14:00" },
  { id: "M106", a: "M99", b: "M100", date: "11/07/2026", time: "14:00" },
  { id: "M107", a: "M101", b: "M102", date: "10/07/2026", time: "18:00" },
  { id: "M108", a: "M103", b: "M104", date: "11/07/2026", time: "18:00" },
];

const SF = [
  { id: "M109", a: "M105", b: "M106", date: "14/07/2026", time: "15:00" },
  { id: "M110", a: "M107", b: "M108", date: "15/07/2026", time: "15:00" },
];

const FINAL = { id: "M111", a: "M109", b: "M110", date: "19/07/2026", time: "12:00" };

/* ---------- UI atoms ---------- */

function TeamRow({ team, score, winner }: { team?: Team; score?: number; winner?: boolean; placeholder?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border border-border bg-card px-2 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base leading-none">{team?.flag ?? "▫︎"}</span>
        <span className={`font-mono text-xs uppercase tracking-wider ${winner ? "text-primary font-bold" : "text-foreground/90"}`}>
          {team?.code ?? "TBD"}
        </span>
      </div>
      {score !== undefined && (
        <span className={`font-mono text-xs tabular-nums ${winner ? "text-primary font-bold underline decoration-primary decoration-2 underline-offset-4" : "text-muted-foreground"}`}>
          {score}
        </span>
      )}
    </div>
  );
}

function PlaceholderRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded border border-dashed border-border bg-card/40 px-2 py-1.5">
      <span className="h-3 w-4 rounded-sm bg-muted/40" />
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Derive a match's live-status from its LA wall-clock kickoff, not the
 * server's local clock or the hardcoded `status` field. If the match has
 * an explicit `finished` status (with scores) that wins; otherwise we
 * compare `Date.now()` against the LA-epoch kickoff.
 */
const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000;
type DerivedStatus = "finished" | "live" | "scheduled";
function deriveStatus(
  date: string,
  time: string,
  explicit?: "scheduled" | "finished",
): DerivedStatus {
  if (explicit === "finished") return "finished";
  const kickoff = laWallClockToEpoch(date, time);
  const now = Date.now();
  if (now >= kickoff + MATCH_DURATION_MS) return "finished";
  if (now >= kickoff) return "live";
  return "scheduled";
}

function StatusLabel({ status, side }: { status: DerivedStatus; side: "left" | "right" }) {
  if (status === "scheduled") return null;
  const align = side === "right" ? "text-right" : "";
  if (status === "live") {
    return (
      <div className={`mb-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--success)] ${side === "right" ? "flex-row-reverse" : ""}`}>
        <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
        <span>Live</span>
      </div>
    );
  }
  return (
    <div className={`mb-1 font-mono text-[9px] uppercase tracking-wider text-primary/80 ${align}`}>
      Full time
    </div>
  );
}

function MatchCard({ match, side = "left" }: { match: Match; side?: "left" | "right" }) {
  const homeWin = match.winner === "home";
  const awayWin = match.winner === "away";
  const status = deriveStatus(match.date, match.time, match.status);
  return (
    <div className="w-[180px]">
      <div className={`mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground ${side === "right" ? "flex-row-reverse" : ""}`}>
        <span>{match.date}</span>
        <span>{match.time}</span>
      </div>
      <StatusLabel status={status} side={side} />
      <div className="space-y-1">
        <TeamRow team={match.home} score={match.homeScore} winner={homeWin} />
        <TeamRow team={match.away} score={match.awayScore} winner={awayWin} />
      </div>
    </div>
  );
}

/**
 * Resolves the winner team of a given match id by walking the match graph.
 * Returns undefined until the match is finished.
 */
function winnerTeam(matchId: string): Team | undefined {
  const r32 = M[matchId];
  if (r32) {
    if (r32.winner === "home") return r32.home;
    if (r32.winner === "away") return r32.away;
    return undefined;
  }
  const r16 = R16.find((r) => r.id === matchId);
  if (r16 && r16.winner) {
    return r16.winner === "home" ? winnerTeam(r16.a) : winnerTeam(r16.b);
  }
  return undefined;
}

function WinnerCard({
  match,
  side = "left",
}: {
  match: { id: string; a: string; b: string; date: string; time: string; homeScore?: number; awayScore?: number; winner?: "home" | "away"; status?: "scheduled" | "finished" };
  side?: "left" | "right";
}) {
  const teamA = winnerTeam(match.a);
  const teamB = winnerTeam(match.b);
  const status = deriveStatus(match.date, match.time, match.status);
  const homeWin = match.winner === "home";
  const awayWin = match.winner === "away";
  return (
    <div className="w-[180px]">
      <div className={`mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground ${side === "right" ? "flex-row-reverse" : ""}`}>
        <span>{match.date}</span>
        <span>{match.time}</span>
      </div>
      <StatusLabel status={status} side={side} />
      <div className="space-y-1">
        {teamA ? <TeamRow team={teamA} score={match.homeScore} winner={homeWin} /> : <PlaceholderRow label={`W${match.a.replace("M", "")}`} />}
        {teamB ? <TeamRow team={teamB} score={match.awayScore} winner={awayWin} /> : <PlaceholderRow label={`W${match.b.replace("M", "")}`} />}
      </div>
    </div>
  );
}

function MatchIdBadge({ id }: { id: string }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2">
      {id}
    </div>
  );
}

/* ---------- Bracket layout ---------- */

function BracketSide({ r32Ids, r16Ids, qfId, side }: { r32Ids: string[]; r16Ids: string[]; qfId: string; side: "left" | "right" }) {
  const r32 = r32Ids.map((id) => M[id]);
  const r16 = r16Ids.map((id) => R16.find((r) => r.id === id)!);
  const qf = QF.find((q) => q.id === qfId)!;

  const cols = (
    <>
      {/* R32 column */}
      <div className="flex flex-col justify-around gap-8">
        {r32.map((m) => (
          <div key={m.id} className={`flex items-start gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
            <MatchIdBadge id={m.id} />
            <MatchCard match={m} side={side} />
          </div>
        ))}
      </div>
      {/* R16 column */}
      <div className="flex flex-col justify-around gap-24">
        {r16.map((m) => (
          <div key={m.id} className={`flex items-start gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
            <MatchIdBadge id={m.id} />
            <WinnerCard match={m} side={side} />
          </div>
        ))}
      </div>
      {/* QF column */}
      <div className="flex flex-col justify-around">
        <div className={`flex items-start gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
          <MatchIdBadge id={qf.id} />
          <WinnerCard match={qf} side={side} />
        </div>
      </div>
    </>
  );

  return (
    <div className={`grid gap-4 ${side === "right" ? "grid-cols-[1fr_1fr_1fr]" : "grid-cols-[1fr_1fr_1fr]"}`}>
      {side === "right" ? <>{cols}</> : cols}
    </div>
  );
}

export function StaticBracket({ locale, title }: { locale: Locale; title?: string }) {
  const heading = title ?? (locale === "es" ? "BRACKET MUNDIAL 2026" : "WORLD CUP 2026 BRACKET");

  const leftR32 = ["M81", "M84", "M83", "M86", "M90", "M89", "M92", "M91"];
  const rightR32 = ["M82", "M85", "M87", "M88", "M93", "M96", "M95", "M94"];
  const leftR16 = ["M97", "M98", "M101", "M102"];
  const rightR16 = ["M99", "M100", "M103", "M104"];
  const leftQF = ["M105", "M107"];
  const rightQF = ["M106", "M108"];


  return (
    <section className="mx-auto max-w-[1600px] px-2 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-6 font-display text-3xl uppercase sm:text-4xl">
        <span className="text-primary">[</span> {heading} <span className="text-primary">]</span>
      </h2>

      {/* Desktop bracket */}
      <div className="hidden overflow-x-auto xl:block">
        <div className="grid min-w-[1500px] grid-cols-[1fr_auto_1fr] items-start gap-4">
          {/* LEFT SIDE */}
          <div className="grid grid-cols-3 gap-6">
            {/* R32 */}
            <div className="flex flex-col gap-6">
              {leftR32.map((id) => {
                const m = M[id];
                return (
                  <div key={id} className="flex items-start gap-2">
                    <MatchIdBadge id={id} />
                    <MatchCard match={m} side="left" />
                  </div>
                );
              })}
            </div>
            {/* R16 */}
            <div className="flex flex-col justify-around gap-6 pt-16">
              {leftR16.map((id) => {
                const m = R16.find((r) => r.id === id)!;
                return (
                  <div key={id} className="flex items-start gap-2">
                    <MatchIdBadge id={id} />
                    <WinnerCard match={m} side="left" />
                  </div>
                );
              })}
            </div>
            {/* QF */}
            <div className="flex flex-col justify-around gap-16 pt-40">
              {leftQF.map((id) => {
                const m = QF.find((q) => q.id === id)!;
                return (
                  <div key={id} className="flex items-start gap-2">
                    <MatchIdBadge id={id} />
                    <WinnerCard match={m} side="left" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER — SF + Final */}
          <div className="flex flex-col items-center gap-8 pt-32">
            <div className="flex items-start gap-2">
              <MatchIdBadge id={SF[0].id} />
              <WinnerCard match={SF[0]} side="left" />
            </div>
            <div className="rounded-xl border-2 border-primary bg-primary/10 p-3 shadow-[0_0_30px_rgba(255,0,0,0.25)]">
              <div className="mb-1 text-center font-mono text-[10px] uppercase tracking-wider text-primary">
                {FINAL.date} · {FINAL.time} · FINAL
              </div>
              <div className="space-y-1">
                <PlaceholderRow label={`W${FINAL.a.replace("M", "")}`} />
                <PlaceholderRow label={`W${FINAL.b.replace("M", "")}`} />
              </div>
              <div className="mt-2 text-center font-display text-lg text-primary">★</div>
            </div>
            <div className="flex items-start gap-2">
              <MatchIdBadge id={SF[1].id} />
              <WinnerCard match={SF[1]} side="right" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid grid-cols-3 gap-6">
            {/* QF */}
            <div className="flex flex-col justify-around gap-16 pt-40">
              {rightQF.map((id) => {
                const m = QF.find((q) => q.id === id)!;
                return (
                  <div key={id} className="flex flex-row-reverse items-start gap-2">
                    <MatchIdBadge id={id} />
                    <WinnerCard match={m} side="right" />
                  </div>
                );
              })}
            </div>
            {/* R16 */}
            <div className="flex flex-col justify-around gap-6 pt-16">
              {rightR16.map((id) => {
                const m = R16.find((r) => r.id === id)!;
                return (
                  <div key={id} className="flex flex-row-reverse items-start gap-2">
                    <MatchIdBadge id={id} />
                    <WinnerCard match={m} side="right" />
                  </div>
                );
              })}
            </div>
            {/* R32 */}
            <div className="flex flex-col gap-6">
              {rightR32.map((id) => {
                const m = M[id];
                return (
                  <div key={id} className="flex flex-row-reverse items-start gap-2">
                    <MatchIdBadge id={id} />
                    <MatchCard match={m} side="right" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet — interactive round tabs */}
      <div className="xl:hidden">
        <MobileBracket
          locale={locale}
          leftR32={leftR32}
          rightR32={rightR32}
          leftR16={leftR16}
          rightR16={rightR16}
          leftQF={leftQF}
          rightQF={rightQF}
        />
      </div>
    </section>
  );
}

type RoundKey = "R32" | "R16" | "QF" | "SF" | "F";

function MobileBracket({
  locale,
  leftR32,
  rightR32,
  leftR16,
  rightR16,
  leftQF,
  rightQF,
}: {
  locale: Locale;
  leftR32: string[];
  rightR32: string[];
  leftR16: string[];
  rightR16: string[];
  leftQF: string[];
  rightQF: string[];
}) {
  // Choose the initial round based on the most recent match with a scheduled
  // or in-progress kickoff — so a visitor lands on the "current" round.
  const now = Date.now();
  const initialRound = useMemo<RoundKey>(() => {
    const roundsOrder: { key: RoundKey; ids: string[]; source: "R32" | "R16" | "QF" | "SF" | "F" }[] = [
      { key: "R32", ids: [...leftR32, ...rightR32], source: "R32" },
      { key: "R16", ids: [...leftR16, ...rightR16], source: "R16" },
      { key: "QF", ids: [...leftQF, ...rightQF], source: "QF" },
      { key: "SF", ids: SF.map((s) => s.id), source: "SF" },
      { key: "F", ids: [FINAL.id], source: "F" },
    ];
    for (const round of roundsOrder) {
      const anyUpcoming = round.ids.some((id) => {
        const match = round.source === "R32" ? M[id]
          : round.source === "R16" ? R16.find((r) => r.id === id)
          : round.source === "QF" ? QF.find((q) => q.id === id)
          : round.source === "SF" ? SF.find((s) => s.id === id)
          : FINAL;
        if (!match) return false;
        return laWallClockToEpoch(match.date, match.time) + 2.5 * 60 * 60 * 1000 > now;
      });
      if (anyUpcoming) return round.key;
    }
    return "F";
  }, [leftR32, rightR32, leftR16, rightR16, leftQF, rightQF, now]);

  const [active, setActive] = useState<RoundKey>(initialRound);

  const labels: Record<RoundKey, { en: string; es: string }> = {
    R32: { en: "Round of 32", es: "Ronda 32" },
    R16: { en: "Round of 16", es: "Octavos" },
    QF: { en: "Quarterfinals", es: "Cuartos" },
    SF: { en: "Semifinals", es: "Semis" },
    F: { en: "Final", es: "Final" },
  };
  const shortLabels: Record<RoundKey, string> = {
    R32: "R32", R16: "R16", QF: "QF", SF: "SF", F: "F",
  };

  const roundIds: Record<RoundKey, string[]> = {
    R32: [...leftR32, ...rightR32],
    R16: [...leftR16, ...rightR16],
    QF: [...leftQF, ...rightQF],
    SF: SF.map((s) => s.id),
    F: [FINAL.id],
  };

  // Sort each round chronologically using LA-epoch.
  const sortedIds = useMemo(() => {
    const ids = [...roundIds[active]];
    return ids.sort((a, b) => {
      const ma = active === "R32" ? M[a] : active === "R16" ? R16.find((r) => r.id === a)! : active === "QF" ? QF.find((q) => q.id === a)! : active === "SF" ? SF.find((s) => s.id === a)! : FINAL;
      const mb = active === "R32" ? M[b] : active === "R16" ? R16.find((r) => r.id === b)! : active === "QF" ? QF.find((q) => q.id === b)! : active === "SF" ? SF.find((s) => s.id === b)! : FINAL;
      return laWallClockToEpoch(ma.date, ma.time) - laWallClockToEpoch(mb.date, mb.time);
    });
  }, [active]);

  const rounds: RoundKey[] = ["R32", "R16", "QF", "SF", "F"];

  return (
    <div className="space-y-4">
      {/* Round tabs — horizontal scroll on very narrow screens */}
      <div
        role="tablist"
        aria-label={locale === "es" ? "Rondas del bracket" : "Bracket rounds"}
        className="sticky top-16 z-10 -mx-2 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:top-20"
      >
        {rounds.map((r) => {
          const isActive = r === active;
          return (
            <button
              key={r}
              role="tab"
              aria-selected={isActive}
              aria-controls={`bracket-panel-${r}`}
              onClick={() => setActive(r)}
              className={`shrink-0 whitespace-nowrap border px-3 py-1.5 font-display text-[11px] uppercase tracking-wider transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">{shortLabels[r]}</span>
              <span className="hidden sm:inline">{labels[r][locale]}</span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`bracket-panel-${active}`}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sortedIds.map((id) => {
          if (active === "R32") {
            const m = M[id];
            return (
              <div key={id} className="flex items-start gap-2">
                <MatchIdBadge id={id} />
                <MatchCard match={m} side="left" />
              </div>
            );
          }
          const match = active === "R16"
            ? R16.find((r) => r.id === id)!
            : active === "QF"
              ? QF.find((q) => q.id === id)!
              : active === "SF"
                ? SF.find((s) => s.id === id)!
                : FINAL;
          return (
            <div key={id} className="flex items-start gap-2">
              <MatchIdBadge id={id} />
              <WinnerCard match={match} side="left" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
