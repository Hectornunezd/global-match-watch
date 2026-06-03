import { useEffect, useRef } from "react";

type SlotKind = "leaderboard" | "rectangle" | "responsive" | "in-feed";

/**
 * Reserves visible space for a Google AdSense unit.
 * Auto Ads is enabled site-wide in __root.tsx (Google decides placements).
 * This component also renders an explicit <ins.adsbygoogle data-ad-format="auto">
 * so Auto Ads can fill these reserved containers when appropriate.
 */
export function AdSlot({
  slot,
  format = "auto",
  className = "",
  adSlot,
}: {
  slot: SlotKind;
  format?: string;
  className?: string;
  adSlot?: string;
}) {
  const clientId =
    (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined) ??
    "ca-pub-7422798753725684";
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!clientId) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* noop */
    }
  }, [clientId]);

  const dim =
    slot === "leaderboard"
      ? "min-h-[100px] sm:min-h-[120px] lg:min-h-[150px]"
      : slot === "rectangle"
        ? "min-h-[260px] sm:min-h-[300px]"
        : slot === "in-feed"
          ? "min-h-[200px] sm:min-h-[250px]"
          : "min-h-[140px] sm:min-h-[180px]";

  return (
    <aside
      aria-label="Advertisement"
      className={`relative flex w-full items-center justify-center overflow-hidden border border-dashed border-border/60 bg-card/40 ${dim} ${className}`}
    >
      <span className="pointer-events-none absolute left-2 top-1.5 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
        Advertisement
      </span>
      {clientId ? (
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: "block", width: "100%", minHeight: "inherit" }}
          data-ad-client={clientId}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground/50">
          Ad space
        </span>
      )}
    </aside>
  );
}
