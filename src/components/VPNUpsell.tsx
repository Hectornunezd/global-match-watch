import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { withUtm, trackClick } from "@/lib/affiliates";

export function VPNUpsell({
  locale,
  countryWithFreeStream,
  countryCode,
  fixtureId,
}: {
  locale: Locale;
  countryWithFreeStream: string;
  countryCode: string;
  fixtureId?: string;
}) {
  const m = t(locale);
  const url = withUtm("https://nordvpn.com/?ref=matchlivenow", {
    pageType: "match",
    matchSlug: fixtureId,
    countryCode,
  });
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          🔓
        </div>
        <div className="flex-1">
          <h3 className="text-lg">{m.vpn.headline}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {m.vpn.body.replace("{country}", countryWithFreeStream)}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() =>
            trackClick({
              fixtureId,
              countryCode,
              affiliatePartner: "nordvpn",
              channelName: "NordVPN",
              pageType: "match",
            })
          }
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
        >
          {m.vpn.cta}
        </a>
      </div>
    </div>
  );
}
