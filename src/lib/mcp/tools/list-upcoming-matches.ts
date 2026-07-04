import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function getClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "list_upcoming_matches",
  title: "List upcoming matches",
  description: "Return the next scheduled FIFA World Cup 2026 matches, ordered by kickoff time.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max matches to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("fixtures")
      .select("id, match_date, status, round, venue, city, slug_en, slug_es, teams_home:teams!fixtures_home_team_id_fkey(name_en, name_es), teams_away:teams!fixtures_away_team_id_fkey(name_en, name_es)")
      .eq("status", "scheduled")
      .gte("match_date", new Date().toISOString())
      .order("match_date", { ascending: true })
      .limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { matches: data ?? [] },
    };
  },
});
