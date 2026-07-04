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
  name: "get_match",
  title: "Get match by slug",
  description: "Look up a single fixture by its English or Spanish slug (e.g. 'usa-vs-mexico').",
  inputSchema: {
    slug: z.string().min(1).describe("The match slug (slug_en or slug_es)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("fixtures")
      .select("*, teams_home:teams!fixtures_home_team_id_fkey(*), teams_away:teams!fixtures_away_team_id_fkey(*)")
      .or(`slug_en.eq.${slug},slug_es.eq.${slug}`)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No match found for slug '${slug}'.` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { match: data },
    };
  },
});
