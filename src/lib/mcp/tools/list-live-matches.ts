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
  name: "list_live_matches",
  title: "List live matches",
  description: "Return FIFA World Cup 2026 matches currently live (status = 'live').",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("fixtures")
      .select("id, match_date, status, home_score, away_score, round, venue, city, slug_en, slug_es, home_team_id, away_team_id, teams_home:teams!fixtures_home_team_id_fkey(name_en, name_es), teams_away:teams!fixtures_away_team_id_fkey(name_en, name_es)")
      .eq("status", "live")
      .order("match_date", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { matches: data ?? [] },
    };
  },
});
