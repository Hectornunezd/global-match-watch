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
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3 sm:flex-1 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            🔓
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg">{m.vpn.headline}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {m.vpn.body.replace("{country}", countryWithFreeStream)}
            </p>
          </div>
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
          className="block w-full shrink-0 rounded-md bg-primary px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:self-center"
        >
          {m.vpn.cta}
        </a>
      </div>
    </div>
  );
}
