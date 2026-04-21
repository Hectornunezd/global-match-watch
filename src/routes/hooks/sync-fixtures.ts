import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// API-Football: FIFA World Cup = league 1, season 2026
const LEAGUE_ID = 1;
const SEASON = 2026;
const API_BASE = "https://v3.football.api-sports.io";

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

// Map API-Football status codes to our internal status.
function mapStatus(s: string): string {
  if (["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(s)) return "live";
  if (["FT", "AET", "PEN"].includes(s)) return "finished";
  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(s)) return "postponed";
  return "scheduled";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Best-effort Spanish translations for common country names.
const ES_NAME: Record<string, string> = {
  "United States": "Estados Unidos",
  "United Kingdom": "Reino Unido",
  England: "Inglaterra",
  Spain: "España",
  Germany: "Alemania",
  Brazil: "Brasil",
  Mexico: "México",
  France: "Francia",
  Italy: "Italia",
  Japan: "Japón",
  "South Korea": "Corea del Sur",
  Korea: "Corea",
  Canada: "Canadá",
  Australia: "Australia",
  Argentina: "Argentina",
  Colombia: "Colombia",
  "Saudi Arabia": "Arabia Saudita",
  Qatar: "Catar",
  Netherlands: "Países Bajos",
  Portugal: "Portugal",
  Belgium: "Bélgica",
  Croatia: "Croacia",
  Switzerland: "Suiza",
  Morocco: "Marruecos",
  Senegal: "Senegal",
  Ghana: "Ghana",
  Uruguay: "Uruguay",
  Ecuador: "Ecuador",
  Chile: "Chile",
  Peru: "Perú",
  Paraguay: "Paraguay",
  Iran: "Irán",
  Iraq: "Irak",
  Egypt: "Egipto",
  Tunisia: "Túnez",
  Nigeria: "Nigeria",
  Cameroon: "Camerún",
  "Ivory Coast": "Costa de Marfil",
  Algeria: "Argelia",
  Denmark: "Dinamarca",
  Sweden: "Suecia",
  Norway: "Noruega",
  Poland: "Polonia",
  Austria: "Austria",
  Turkey: "Turquía",
  Ukraine: "Ucrania",
  Serbia: "Serbia",
  Wales: "Gales",
  Scotland: "Escocia",
  Ireland: "Irlanda",
};

async function fetchApi<T>(path: string, key: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "x-apisports-key": key },
  });
  if (!res.ok) throw new Error(`API-Football ${path} → ${res.status}`);
  const json = (await res.json()) as { response: T; errors?: unknown };
  if (json.errors && Array.isArray(json.errors) ? json.errors.length : Object.keys(json.errors ?? {}).length) {
    throw new Error(`API-Football errors: ${JSON.stringify(json.errors)}`);
  }
  return json.response;
}

async function syncTeams(key: string): Promise<Map<number, string>> {
  // Returns map of api_football_id → internal team UUID
  const teams = await fetchApi<Array<{ team: ApiTeam }>>(
    `/teams?league=${LEAGUE_ID}&season=${SEASON}`,
    key
  );

  const idMap = new Map<number, string>();

  for (const t of teams) {
    const api = t.team;
    const code = (api.code ?? api.name.slice(0, 3)).toUpperCase();
    const nameEs = ES_NAME[api.name] ?? api.name;
    const row = {
      api_football_id: api.id,
      name_en: api.name,
      name_es: nameEs,
      slug_en: slugify(api.name),
      slug_es: slugify(nameEs),
      country_code: code,
      flag_url: api.logo,
    };

    // Upsert by api_football_id
    const { data: existing } = await supabaseAdmin
      .from("teams")
      .select("id")
      .eq("api_football_id", api.id)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin.from("teams").update(row).eq("id", existing.id);
      idMap.set(api.id, existing.id);
    } else {
      const { data: inserted } = await supabaseAdmin
        .from("teams")
        .insert(row)
        .select("id")
        .single();
      if (inserted) idMap.set(api.id, inserted.id);
    }
  }

  return idMap;
}

async function syncFixtures(key: string, teamIdMap: Map<number, string>) {
  const fixtures = await fetchApi<ApiFixtureResponse[]>(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
    key
  );

  let upserted = 0;
  for (const f of fixtures) {
    const homeId = teamIdMap.get(f.teams.home.id);
    const awayId = teamIdMap.get(f.teams.away.id);
    if (!homeId || !awayId) continue;

    const slugBase = `${slugify(f.teams.home.name)}-vs-${slugify(f.teams.away.name)}`;
    const dateStr = f.fixture.date.slice(0, 10);
    const slugEn = `${slugBase}-${dateStr}`;
    const slugEs = `${slugify(ES_NAME[f.teams.home.name] ?? f.teams.home.name)}-vs-${slugify(ES_NAME[f.teams.away.name] ?? f.teams.away.name)}-${dateStr}`;

    const row = {
      api_football_id: f.fixture.id,
      home_team_id: homeId,
      away_team_id: awayId,
      match_date: f.fixture.date,
      status: mapStatus(f.fixture.status.short),
      home_score: f.goals.home,
      away_score: f.goals.away,
      venue: f.fixture.venue.name,
      city: f.fixture.venue.city,
      round: f.league.round,
      slug_en: slugEn,
      slug_es: slugEs,
    };

    const { data: existing } = await supabaseAdmin
      .from("fixtures")
      .select("id")
      .eq("api_football_id", f.fixture.id)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin.from("fixtures").update(row).eq("id", existing.id);
    } else {
      await supabaseAdmin.from("fixtures").insert(row);
    }
    upserted++;
  }
  return upserted;
}

export const Route = createFileRoute("/hooks/sync-fixtures")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Validate the cron auth header (Supabase anon key bearer)
        const authHeader = request.headers.get("authorization");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!authHeader || !expected || authHeader !== `Bearer ${expected}`) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const apiKey = process.env.API_FOOTBALL_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Missing API_FOOTBALL_KEY" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        try {
          const teamIdMap = await syncTeams(apiKey);
          const fixturesCount = await syncFixtures(apiKey, teamIdMap);
          return new Response(
            JSON.stringify({
              success: true,
              teams: teamIdMap.size,
              fixtures: fixturesCount,
              ranAt: new Date().toISOString(),
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("sync-fixtures error:", message);
          return new Response(
            JSON.stringify({ success: false, error: message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
