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
  name: "list_teams",
  title: "List World Cup teams",
  description: "Return the 48 FIFA World Cup 2026 teams. Optionally filter by group letter (A–L).",
  inputSchema: {
    group: z.string().length(1).optional().describe("Group letter A–L to filter by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ group }) => {
    const supabase = getClient();
    let q = supabase.from("teams").select("*").order("name_en", { ascending: true });
    if (group) q = q.eq("group_letter", group.toUpperCase());
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { teams: data ?? [] },
    };
  },
});
