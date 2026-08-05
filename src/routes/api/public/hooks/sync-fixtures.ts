import { createFileRoute } from "@tanstack/react-router";

/**
 * Liga MX Apertura 2026 sync — scrapes the official tournament page via
 * Firecrawl and refreshes kickoff times, scores and status for every
 * fixture. No API-Football dependency.
 */
const SOURCE_URL = "https://es.wikipedia.org/wiki/Torneo_Apertura_2026_(M%C3%A9xico)";
const COMPETITION = "Liga MX Apertura 2026";

/** Wikipedia club label -> our team slug_en. */
const TEAM_SLUGS: Record<string, string> = {
  america: "america",
  atlante: "atlante",
  atlas: "atlas",
  atleticodesanluis: "atletico-san-luis",
  atleticosanluis: "atletico-san-luis",
  cruzazul: "cruz-azul",
  guadalajara: "guadalajara",
  chivas: "guadalajara",
  juarez: "fc-juarez",
  fcjuarez: "fc-juarez",
  leon: "leon",
  monterrey: "monterrey",
  necaxa: "necaxa",
  pachuca: "pachuca",
  puebla: "puebla",
  pumasunam: "pumas-unam",
  queretaro: "queretaro",
  santoslaguna: "santos-laguna",
  santos: "santos-laguna",
  tigresuanl: "tigres-uanl",
  tijuana: "tijuana",
  toluca: "toluca",
};

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

function slugKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

/** Strips markdown links/bold from a table cell. */
function cellText(cell: string): string {
  return cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s*"[^"]*"\)?$/, "")
    .trim();
}

export interface ScrapedMatch {
  matchday: number;
  homeSlug: string;
  awaySlug: string;
  homeScore: number | null;
  awayScore: number | null;
  kickoffUtc: string;
}

/** Parses the "Torneo regular" jornada tables out of the page markdown. */
export function parseMatches(markdown: string): ScrapedMatch[] {
  const out: ScrapedMatch[] = [];
  let matchday: number | null = null;
  let lastDate: [number, number] | null = null;
  let lastTime: string | null = null;
  const perDay = new Map<number, number>();

  for (const line of markdown.split("\n")) {
    const jm = line.match(/^\|\s*\*\*Jornada (\d+)\*\*/);
    if (jm) {
      matchday = Number(jm[1]);
      lastDate = null;
      lastTime = null;
      continue;
    }
    if (matchday === null || !line.startsWith("|")) continue;
    if ((perDay.get(matchday) ?? 0) >= 9) continue;

    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cellText);
    if (cells.length < 4 || cells.includes("Resultado")) continue;

    const homeSlug = TEAM_SLUGS[slugKey(cells[0] ?? "")];
    const awaySlug = TEAM_SLUGS[slugKey(cells[2] ?? "")];
    if (!homeSlug || !awaySlug || homeSlug === awaySlug) continue;

    let homeScore: number | null = null;
    let awayScore: number | null = null;
    const sm = (cells[1] ?? "").match(/^(\d+)\s*[–-]\s*(\d+)$/);
    if (sm) {
      homeScore = Number(sm[1]);
      awayScore = Number(sm[2]);
    }

    for (const c of cells) {
      const dm = c.match(/^(\d{1,2}) de ([A-Za-zé]+)/);
      if (dm && MONTHS[dm[2]!.toLowerCase()]) lastDate = [Number(dm[1]), MONTHS[dm[2]!.toLowerCase()]!];
      if (/^\d{1,2}:\d{2}$/.test(c)) lastTime = c;
    }
    if (!lastDate || !lastTime) continue;

    const [day, month] = lastDate;
    const [hh, mm] = lastTime.split(":").map(Number);
    // Times are Mexico City (UTC-6, no DST).
    const kickoff = new Date(Date.UTC(2026, month - 1, day, (hh ?? 0) + 6, mm ?? 0));

    out.push({
      matchday,
      homeSlug,
      awaySlug,
      homeScore,
      awayScore,
      kickoffUtc: kickoff.toISOString(),
    });
    perDay.set(matchday, (perDay.get(matchday) ?? 0) + 1);
  }

  return out;
}

async function scrapeMarkdown(apiKey: string): Promise<string> {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url: SOURCE_URL, formats: ["markdown"], onlyMainContent: true }),
  });
  const json = (await res.json()) as {
    markdown?: string;
    data?: { markdown?: string };
    error?: string;
  };
  if (!res.ok) throw new Error(json.error ?? `Firecrawl failed with ${res.status}`);
  const markdown = json.markdown ?? json.data?.markdown;
  if (!markdown) throw new Error("Firecrawl returned no markdown");
  return markdown;
}

export const Route = createFileRoute("/api/public/hooks/sync-fixtures")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const apikey = request.headers.get("apikey");
        const expected = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
        const authorized =
          !!expected && (authHeader === `Bearer ${expected}` || apikey === expected);
        if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const firecrawlKey = process.env["FIRECRAWL_API_KEY"];
        if (!firecrawlKey) {
          return Response.json({ error: "Missing FIRECRAWL_API_KEY" }, { status: 500 });
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const markdown = await scrapeMarkdown(firecrawlKey);
          const matches = parseMatches(markdown);

          const { data: teams } = await supabaseAdmin.from("teams").select("id, slug_en");
          const teamId = new Map((teams ?? []).map((t) => [t.slug_en, t.id]));

          const { data: fixtures } = await supabaseAdmin
            .from("fixtures")
            .select("id, home_team_id, away_team_id, matchday, match_date, status, home_score, away_score")
            .eq("competition", COMPETITION);

          const key = (md: number, h: string, a: string) => `${md}|${h}|${a}`;
          const byKey = new Map(
            (fixtures ?? []).map((f) => [
              key(f.matchday ?? 0, f.home_team_id, f.away_team_id),
              f,
            ]),
          );

          const now = Date.now();
          let updated = 0;
          let skipped = 0;

          for (const m of matches) {
            const homeId = teamId.get(m.homeSlug);
            const awayId = teamId.get(m.awaySlug);
            if (!homeId || !awayId) {
              skipped++;
              continue;
            }
            const fixture = byKey.get(key(m.matchday, homeId, awayId));
            if (!fixture) {
              skipped++;
              continue;
            }

            const kickoff = new Date(m.kickoffUtc).getTime();
            const hasScore = m.homeScore !== null && m.awayScore !== null;
            const status = hasScore
              ? "finished"
              : now >= kickoff && now < kickoff + 2.5 * 60 * 60 * 1000
                ? "live"
                : "scheduled";

            const changed =
              fixture.status !== status ||
              fixture.home_score !== m.homeScore ||
              fixture.away_score !== m.awayScore ||
              new Date(fixture.match_date).getTime() !== kickoff;

            if (!changed) continue;

            await supabaseAdmin
              .from("fixtures")
              .update({
                match_date: m.kickoffUtc,
                status,
                home_score: m.homeScore,
                away_score: m.awayScore,
              })
              .eq("id", fixture.id);
            updated++;
          }

          return Response.json({
            success: true,
            source: SOURCE_URL,
            scraped: matches.length,
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
