export type PageType = "match" | "team" | "country" | "home";

interface UtmParams {
  pageType: PageType;
  matchSlug?: string;
  countryCode?: string;
}

/**
 * Append UTM parameters to an affiliate URL.
 * If the URL already contains UTMs, they are preserved.
 */
export function withUtm(url: string, params: UtmParams): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "matchlivenow");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "affiliate");
    if (!u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", "worldcup2026");
    const content = [params.pageType, params.matchSlug, params.countryCode]
      .filter(Boolean)
      .join("_");
    if (content && !u.searchParams.has("utm_content")) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Fire-and-forget click tracking.
 * Sends to /api/track-click and dispatches a GA4 event if available.
 */
export function trackClick(payload: {
  fixtureId?: string | null;
  countryCode?: string | null;
  affiliatePartner?: string | null;
  channelName?: string | null;
  pageType: PageType;
}): void {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track-click", blob);
    } else {
      void fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
    // GA4
    const w = typeof window !== "undefined" ? (window as unknown as { gtag?: (...a: unknown[]) => void }) : undefined;
    if (w?.gtag) {
      w.gtag("event", "affiliate_click", {
        partner: payload.affiliatePartner,
        channel: payload.channelName,
        country: payload.countryCode,
        match_slug: payload.fixtureId,
        page_type: payload.pageType,
      });
    }
  } catch {
    /* swallow */
  }
}
