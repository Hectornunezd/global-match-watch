import type { Fixture, Team } from "./data";

export interface StandingRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: Array<"W" | "D" | "L">;
}

/** Liga MX regular-phase table: 3 pts win, 1 draw, sorted by pts, GD, GF. */
export function computeStandings(fixtures: Fixture[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();

  const row = (team: Team): StandingRow => {
    let r = rows.get(team.id);
    if (!r) {
      r = {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
        form: [],
      };
      rows.set(team.id, r);
    }
    return r;
  };

  const played = fixtures
    .filter(
      (f) =>
        f.stage !== "liguilla" &&
        f.home_score !== null &&
        f.away_score !== null &&
        (f.status === "finished" || f.status === "live"),
    )
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());

  // Seed every team so clubs without results still show in the table.
  fixtures.forEach((f) => {
    row(f.home_team);
    row(f.away_team);
  });

  played.forEach((f) => {
    if (f.status !== "finished") return;
    const h = row(f.home_team);
    const a = row(f.away_team);
    const hs = f.home_score ?? 0;
    const as = f.away_score ?? 0;
    h.played += 1;
    a.played += 1;
    h.goalsFor += hs;
    h.goalsAgainst += as;
    a.goalsFor += as;
    a.goalsAgainst += hs;
    if (hs > as) {
      h.won += 1;
      h.points += 3;
      h.form.push("W");
      a.lost += 1;
      a.form.push("L");
    } else if (hs < as) {
      a.won += 1;
      a.points += 3;
      a.form.push("W");
      h.lost += 1;
      h.form.push("L");
    } else {
      h.drawn += 1;
      a.drawn += 1;
      h.points += 1;
      a.points += 1;
      h.form.push("D");
      a.form.push("D");
    }
  });

  return Array.from(rows.values())
    .map((r) => ({ ...r, goalDiff: r.goalsFor - r.goalsAgainst, form: r.form.slice(-5) }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor ||
        (a.team.name_es < b.team.name_es ? -1 : 1),
    );
}

/** Groups fixtures by jornada number, ascending. */
export function byMatchday(fixtures: Fixture[]): Array<{ matchday: number; fixtures: Fixture[] }> {
  const map = new Map<number, Fixture[]>();
  fixtures
    .filter((f) => f.matchday != null)
    .forEach((f) => {
      const md = f.matchday as number;
      const list = map.get(md) ?? [];
      list.push(f);
      map.set(md, list);
    });
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([matchday, list]) => ({
      matchday,
      fixtures: list.sort(
        (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime(),
      ),
    }));
}

/** Current jornada = first one with any pending match, else the last one. */
export function currentMatchday(fixtures: Fixture[]): number {
  const groups = byMatchday(fixtures);
  const pending = groups.find((g) => g.fixtures.some((f) => f.status !== "finished"));
  return pending?.matchday ?? groups[groups.length - 1]?.matchday ?? 1;
}
