import { createFileRoute } from "@tanstack/react-router";

// API-Football: Liga MX = league 262
const LEAGUE_ID = 262;
const DEFAULT_SEASON = 2026;
const API_BASE = "https://v3.football.api-sports.io";
const COMPETITION = "Liga MX Apertura 2026";

interface ApiTeam {
  id: number;
  name: string;
  code: string | null;
  logo: string | null;
}

interface ApiFixtureResponse {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
    venue: { name: string | null; city: string | null };
  };
  league: { round: string };
  teams: { home: ApiTeam; away: ApiTeam };
  goals: { home: number | null; away: number | null };
}

function mapStatus(s: string): string {
  if (["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"].includes(s)) return "live";
  if (["FT", "AET", "PEN"].includes(s)) return "finished";
  if (["PST", "CANC", "ABD", "AWD", "WO", "SUSP"].includes(s)) return "postponed";
  return "scheduled";
}

/** "Apertura - 7" / "Regular Season - 7" -> 7 ; "Liguilla" rounds -> null */
function parseRound(round: string): { matchday: number | null; stage: string } {
  const lower = round.toLowerCase();
  const isKnockout =
    lower.includes("final") ||
    lower.includes("semi") ||
    lower.includes("quarter") ||
    lower.includes("liguilla") ||
    lower.includes("play");
  const m = round.match(/(\d+)\s*$/);
  return {
    matchday: isKnockout ? null : m ? Number(m[1]) : null,
    stage: isKnockout ? "liguilla" : "regular",
  };
}

async function fetchApi<T>(path: string, key: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { "x-apisports-key": key } });
  if (!res.ok) throw new Error(`API-Football ${path} -> ${res.status}`);
  const json = (await res.json()) as { response: T; errors?: unknown };
  const errs = json.errors;
  const hasErrors = Array.isArray(errs)
    ? errs.length > 0
    : errs && Object.keys(errs).length > 0;
  if (hasErrors) throw new Error(`API-Football errors: ${JSON.stringify(errs)}`);
  return json.response;
}

export const Route = createFileRoute("/api/public/hooks/sync-fixtures")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const expected = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!authHeader || !expected || authHeader !== `Bearer ${expected}`) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const apiKey = process.env["API_FOOTBALL_KEY"];
        if (!apiKey) {
          return Response.json({ error: "Missing API_FOOTBALL_KEY" }, { status: 500 });
        }

        const url = new URL(request.url);
        const season = Number(url.searchParams.get("season") ?? DEFAULT_SEASON);

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // --- Teams: refresh logos / stadiums, build api id -> uuid map ---
          const apiTeams = await fetchApi<
            Array<{ team: ApiTeam; venue: { name: string | null; city: string | null } }>
          >(`/teams?league=${LEAGUE_ID}&season=${season}`, apiKey);

          const { data: dbTeams } = await supabaseAdmin
            .from("teams")
            .select("id, api_football_id, short_code, name_en");

          const byApiId = new Map<number, string>();
          const norm = (s: string) =>
            s
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z]/g, "");

          for (const row of dbTeams ?? []) {
            if (row.api_football_id) byApiId.set(row.api_football_id, row.id);
          }

          for (const t of apiTeams) {
            let id = byApiId.get(t.team.id);
            if (!id) {
              const match = (dbTeams ?? []).find((r) =>
                norm(t.team.name).includes(norm(r.name_en).slice(0, 6)),
              );
              if (match) {
                id = match.id;
                byApiId.set(t.team.id, id);
                await supabaseAdmin
                  .from("teams")
                  .update({ api_football_id: t.team.id })
                  .eq("id", id);
              }
            }
            if (!id) continue;
            await supabaseAdmin
              .from("teams")
              .update({
                flag_url: t.team.logo,
                ...(t.venue.name ? { stadium: t.venue.name } : {}),
              })
              .eq("id", id);
          }

          // --- Fixtures: upsert scores, status, dates ---
          const apiFixtures = await fetchApi<ApiFixtureResponse[]>(
            `/fixtures?league=${LEAGUE_ID}&season=${season}`,
            apiKey,
          );

          let updated = 0;
          let skipped = 0;

          for (const f of apiFixtures) {
            const homeId = byApiId.get(f.teams.home.id);
            const awayId = byApiId.get(f.teams.away.id);
            if (!homeId || !awayId) {
              skipped++;
              continue;
            }
            const { matchday, stage } = parseRound(f.league.round);
            const patch = {
              api_football_id: f.fixture.id,
              match_date: f.fixture.date,
              status: mapStatus(f.fixture.status.short),
              home_score: f.goals.home,
              away_score: f.goals.away,
              venue: f.fixture.venue.name,
              city: f.fixture.venue.city,
              round: f.league.round,
              matchday,
              stage,
            };

            // Prefer matching on api_football_id, else on teams + matchday.
            const { data: existing } = await supabaseAdmin
              .from("fixtures")
              .select("id")
              .eq("api_football_id", f.fixture.id)
              .maybeSingle();

            let targetId = existing?.id ?? null;
            if (!targetId && matchday != null) {
              const { data: byTeams } = await supabaseAdmin
                .from("fixtures")
                .select("id")
                .eq("home_team_id", homeId)
                .eq("away_team_id", awayId)
                .eq("competition", COMPETITION)
                .maybeSingle();
              targetId = byTeams?.id ?? null;
            }

            if (targetId) {
              await supabaseAdmin.from("fixtures").update(patch).eq("id", targetId);
              updated++;
            } else {
              skipped++;
            }
          }

          return Response.json({
            success: true,
            season,
            teams: byApiId.size,
            fixturesFromApi: apiFixtures.length,
            updated,
            skipped,
            ranAt: new Date().toISOString(),
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("sync-fixtures error:", message);
          return Response.json({ success: false, error: message }, { status: 500 });
        }
      },
    },
  },
});
