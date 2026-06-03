import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface SyncStats {
  totals: {
    teams: number;
    fixtures: number;
    channels: number;
  };
  byStatus: Array<{ status: string; count: number }>;
  byDate: Array<{ date: string; count: number; live: number; finished: number; scheduled: number }>;
  recentlyUpdated: Array<{
    id: string;
    match_date: string;
    status: string;
    updated_at: string;
    home: string;
    away: string;
    home_score: number | null;
    away_score: number | null;
  }>;
  lastUpdatedAt: string | null;
}

export const getSyncStats = createServerFn({ method: "GET" }).handler(async (): Promise<SyncStats> => {
  const [{ count: teamsCount }, { count: fixturesCount }, { count: channelsCount }] = await Promise.all([
    supabaseAdmin.from("teams").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("fixtures").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("channels").select("*", { count: "exact", head: true }),
  ]);

  const { data: allFixtures } = await supabaseAdmin
    .from("fixtures")
    .select("id, match_date, status, updated_at, home_score, away_score, home_team_id, away_team_id")
    .order("match_date", { ascending: true });

  const fixtures = allFixtures ?? [];

  // by status
  const statusMap = new Map<string, number>();
  for (const f of fixtures) {
    statusMap.set(f.status, (statusMap.get(f.status) ?? 0) + 1);
  }
  const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

  // by date
  const dateMap = new Map<string, { count: number; live: number; finished: number; scheduled: number }>();
  for (const f of fixtures) {
    const date = f.match_date.slice(0, 10);
    const entry = dateMap.get(date) ?? { count: 0, live: 0, finished: 0, scheduled: 0 };
    entry.count++;
    if (f.status === "live") entry.live++;
    else if (f.status === "finished") entry.finished++;
    else if (f.status === "scheduled") entry.scheduled++;
    dateMap.set(date, entry);
  }
  const byDate = Array.from(dateMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // recently updated
  const recent = [...fixtures]
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, 15);

  const teamIds = new Set<string>();
  recent.forEach((f) => {
    teamIds.add(f.home_team_id);
    teamIds.add(f.away_team_id);
  });
  const { data: teamsData } = await supabaseAdmin
    .from("teams")
    .select("id, name_en")
    .in("id", Array.from(teamIds));
  const teamMap = new Map((teamsData ?? []).map((t) => [t.id, t.name_en]));

  const recentlyUpdated = recent.map((f) => ({
    id: f.id,
    match_date: f.match_date,
    status: f.status,
    updated_at: f.updated_at,
    home: teamMap.get(f.home_team_id) ?? "?",
    away: teamMap.get(f.away_team_id) ?? "?",
    home_score: f.home_score,
    away_score: f.away_score,
  }));

  const lastUpdatedAt = recent[0]?.updated_at ?? null;

  return {
    totals: {
      teams: teamsCount ?? 0,
      fixtures: fixturesCount ?? 0,
      channels: channelsCount ?? 0,
    },
    byStatus,
    byDate,
    recentlyUpdated,
    lastUpdatedAt,
  };
});
