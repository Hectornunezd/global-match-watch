import type { Locale } from "./i18n";

const SITE_URL = "https://matchlivenow.com";
const SITE_NAME = "MatchLiveNow";

interface MetaInput {
  title: string;
  description: string;
  path: string; // current path including locale
  altPath: string; // path in the other locale
  locale: Locale;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string;
}

export function siteUrl(): string {
  return SITE_URL;
}

export function buildMeta(input: MetaInput) {
  const url = `${SITE_URL}${input.path}`;
  const altUrl = `${SITE_URL}${input.altPath}`;
  const altLocale = input.locale === "en" ? "es_ES" : "en_US";
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
    { name: "googlebot", content: "index,follow,max-image-preview:large,max-snippet:-1" },
    { name: "author", content: SITE_NAME },
    { name: "application-name", content: SITE_NAME },
    { name: "apple-mobile-web-app-title", content: SITE_NAME },
    { name: "format-detection", content: "telephone=no" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:type", content: input.ogType ?? "website" },
    { property: "og:locale", content: input.locale === "en" ? "en_US" : "es_ES" },
    { property: "og:locale:alternate", content: altLocale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:site", content: "@matchlivenow" },
    { name: "twitter:creator", content: "@matchlivenow" },
  ];
  if (input.keywords) {
    meta.push({ name: "keywords", content: input.keywords });
  }
  if (input.ogImage) {
    meta.push({ property: "og:image", content: input.ogImage });
    meta.push({ name: "twitter:image", content: input.ogImage });
  }
  const links = [
    { rel: "canonical", href: url },
    {
      rel: "alternate",
      hrefLang: input.locale === "en" ? "es" : "en",
      href: altUrl,
    },
    {
      rel: "alternate",
      hrefLang: input.locale,
      href: url,
    },
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${input.path}` },
  ];
  return { meta, links };
}

export function jsonLdScript(data: Record<string, unknown> | Array<Record<string, unknown>>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function sportsEventJsonLd(args: {
  homeName: string;
  awayName: string;
  startDate: string;
  venue?: string | null;
  city?: string | null;
  url: string;
  channels: Array<{ name: string; url?: string | null }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${args.homeName} vs ${args.awayName}`,
    startDate: args.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: args.venue
      ? {
          "@type": "Place",
          name: args.venue,
          address: args.city ?? undefined,
        }
      : undefined,
    competitor: [
      { "@type": "SportsTeam", name: args.homeName },
      { "@type": "SportsTeam", name: args.awayName },
    ],
    url: args.url,
    subEvent: args.channels.map((c) => ({
      "@type": "BroadcastEvent",
      name: c.name,
      isLiveBroadcast: true,
      videoFormat: "HD",
      url: c.url ?? undefined,
    })),
  };
}

export function sportsTeamJsonLd(name: string, url: string, logo?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    url,
    logo,
    sport: "Soccer",
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
