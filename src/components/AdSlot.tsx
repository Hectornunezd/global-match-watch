/**
 * Renders an AdSense slot only when the publisher ID env var is configured AND
 * the user has accepted full cookies. Otherwise renders nothing.
 */
export function AdSlot({ slot, format = "auto" }: { slot: "leaderboard" | "rectangle" | "responsive"; format?: string }) {
  const clientId = (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined) ?? "";
  if (!clientId) return null;
  const dim =
    slot === "leaderboard"
      ? "min-h-[90px]"
      : slot === "rectangle"
        ? "min-h-[250px]"
        : "min-h-[120px]";
  return (
    <div className={`flex w-full items-center justify-center rounded-xl border border-dashed border-border bg-card/50 ${dim}`}>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
