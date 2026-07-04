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
  name: "list_channels_by_country",
  title: "List channels by country",
  description: "Return TV and streaming channels showing the FIFA World Cup 2026 in a given country (ISO 3166-1 alpha-2 code, e.g. 'US', 'MX', 'GB').",
  inputSchema: {
    country_code: z.string().length(2).describe("ISO 3166-1 alpha-2 country code."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ country_code }) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("channels")
      .select("id, channel_name, channel_type, channel_url, is_free, affiliate_partner, logo_url, sort_order")
      .eq("country_code", country_code.toUpperCase())
      .order("sort_order", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { channels: data ?? [] },
    };
  },
});
