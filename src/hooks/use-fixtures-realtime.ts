import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to Realtime updates on `public.fixtures` and refreshes the
 * current route's loader whenever a row changes. Debounces bursts of
 * events so we don't hammer the loader when several fixtures update
 * within a few seconds (typical of a goal + status flip).
 *
 * The `fixtures` table has a public SELECT policy so the anon key can
 * receive changes; no auth is required.
 */
export function useFixturesRealtime() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleInvalidate = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        router.invalidate();
      }, 400);
    };

    const channel = supabase
      .channel("fixtures-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fixtures" },
        scheduleInvalidate,
      )
      .subscribe();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      supabase.removeChannel(channel);
    };
  }, [router]);
}
