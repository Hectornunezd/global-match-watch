import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/track-click")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const payload = {
            fixture_id: body.fixtureId ?? null,
            country_code: body.countryCode ?? null,
            affiliate_partner: body.affiliatePartner ?? null,
            channel_name: body.channelName ?? null,
            page_type: body.pageType ?? null,
          };
          await supabase.from("affiliate_clicks").insert(payload);
        } catch {
          /* swallow — fire-and-forget */
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
