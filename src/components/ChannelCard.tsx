import { useState } from "react";
import type { Channel, Fixture } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { withUtm, trackClick } from "@/lib/affiliates";
import { channelLogoUrl } from "@/lib/channel-logos";

interface Props {
  channel: Channel;
  locale: Locale;
  fixture?: Fixture | null;
  pageType: "match" | "team" | "country" | "home";
  countryCode: string;
}

export function ChannelCard({ channel, locale, fixture, pageType, countryCode }: Props) {
  const m = t(locale);
  const slug = fixture ? (locale === "es" ? fixture.slug_es : fixture.slug_en) : undefined;
  const url = withUtm(channel.affiliate_url ?? channel.channel_url ?? "#", {
    pageType,
    matchSlug: slug,
    countryCode,
  });
  const handleClick = () => {
    trackClick({
      fixtureId: fixture?.id ?? null,
      countryCode,
      affiliatePartner: channel.affiliate_partner,
      channelName: channel.channel_name,
      pageType,
    });
  };
  const typeLabel =
    channel.is_free
      ? m.labels.free
      : channel.channel_type === "streaming"
        ? m.labels.streaming
        : channel.channel_type === "tv"
          ? m.labels.tv
          : m.labels.paid;
  const typeColor = channel.is_free
    ? "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
    : "border-border bg-[var(--surface-hover)] text-muted-foreground";

  const fallbackLogo = channelLogoUrl(channel.channel_name, channel.affiliate_partner);
  const logoSrc = channel.logo_url || fallbackLogo;
  const [logoFailed, setLogoFailed] = useState(false);

  // Use a white background for all logos for visual consistency.
  const bgColor = "#ffffff";
  // Compute readable text color for fallback initial.
  const isDark = (hex: string) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  };
  const logoBgStyle = bgColor ? { backgroundColor: bgColor } : undefined;
  const logoBgClass = bgColor
    ? isDark(bgColor) ? "text-white" : "text-black"
    : "bg-white/95 text-black";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary">
      <div style={logoBgStyle} className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md font-display text-sm uppercase ${logoBgClass}`}>

        {logoSrc && !logoFailed ? (
          <img
            src={logoSrc}
            alt={channel.channel_name}
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          channel.channel_name.charAt(0)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-display text-base uppercase">{channel.channel_name}</span>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${typeColor}`}>
            {typeLabel}
          </span>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={handleClick}
        className="shrink-0 border border-primary bg-transparent px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        ▸ {m.labels.watchNow}
      </a>
    </div>
  );
}
