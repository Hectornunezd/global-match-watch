export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

// Spanish-default countries
const ES_COUNTRIES = new Set([
  "MX", "ES", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU",
  "DO", "HN", "SV", "NI", "CR", "PA", "UY", "PY", "BO",
]);

export function defaultLocaleForCountry(countryCode: string | null | undefined): Locale {
  if (!countryCode) return "en";
  return ES_COUNTRIES.has(countryCode.toUpperCase()) ? "es" : "en";
}

const messages = {
  en: {
    nav: { home: "Home", teams: "Teams", countries: "Countries", privacy: "Privacy", terms: "Terms" },
    hero: {
      title: "Where to Watch the FIFA World Cup 2026",
      subtitle: "Find every channel and streaming service for every match — anywhere in the world.",
      cta: "Find your match",
    },
    sections: {
      liveNow: "Live Now",
      upcoming: "Upcoming Matches",
      allMatches: "All Matches",
      allGroups: "All groups",
      group: "Group",
      whereToWatch: "Where to watch in",
      otherMatches: "Other matches in this round",
      odds: "Odds for this match",
      faq: "Frequently asked questions",
      schedule: "Match schedule",
      channels: "TV channels & streaming",
      upcomingFor: "Upcoming matches",
      pastResults: "Past results",
    },
    labels: {
      live: "LIVE",
      free: "FREE",
      paid: "PAID",
      streaming: "STREAMING",
      tv: "TV",
      watchNow: "Watch now",
      findChannels: "Find channels",
      notIn: "Not in",
      changeCountry: "change your location",
      vs: "VS",
      to: "to",
      kickoff: "Kickoff",
      venue: "Venue",
    },
    vpn: {
      headline: "Unlock free streams from another country",
      body: "No free channel in your country? Use a VPN to watch this match for free from {country}.",
      cta: "Try NordVPN",
    },
    cookies: {
      title: "We use cookies",
      body: "We use cookies for analytics and to improve your experience. You can choose what you allow.",
      acceptAll: "Accept all",
      essential: "Essential only",
      privacy: "Privacy policy",
    },
    footer: {
      tagline: "Your global guide to watching the FIFA World Cup 2026.",
      legal: "Legal",
      built: "Built for fans worldwide.",
    },
    countdown: { days: "days", hours: "hrs", minutes: "min", seconds: "sec", to: "to kickoff" },
  },
  es: {
    nav: { home: "Inicio", teams: "Equipos", countries: "Países", privacy: "Privacidad", terms: "Términos" },
    hero: {
      title: "Dónde ver el Mundial FIFA 2026",
      subtitle: "Encuentra todos los canales y servicios de streaming para cada partido — en cualquier parte del mundo.",
      cta: "Encuentra tu partido",
    },
    sections: {
      liveNow: "En vivo ahora",
      upcoming: "Próximos partidos",
      allMatches: "Todos los partidos",
      allGroups: "Todos los grupos",
      group: "Grupo",
      whereToWatch: "Dónde ver en",
      otherMatches: "Otros partidos de esta ronda",
      odds: "Cuotas para este partido",
      faq: "Preguntas frecuentes",
      schedule: "Calendario de partidos",
      channels: "Canales de TV y streaming",
      upcomingFor: "Próximos partidos",
      pastResults: "Resultados anteriores",
    },
    labels: {
      live: "EN VIVO",
      free: "GRATIS",
      paid: "PAGO",
      streaming: "STREAMING",
      tv: "TV",
      watchNow: "Ver ahora",
      findChannels: "Ver canales",
      notIn: "¿No estás en",
      changeCountry: "cambia tu ubicación",
      vs: "VS",
      to: "a",
      kickoff: "Inicio",
      venue: "Sede",
    },
    vpn: {
      headline: "Desbloquea transmisiones gratis desde otro país",
      body: "¿No hay canal gratuito en tu país? Usa una VPN para ver este partido gratis desde {country}.",
      cta: "Probar NordVPN",
    },
    cookies: {
      title: "Usamos cookies",
      body: "Usamos cookies para análisis y mejorar tu experiencia. Puedes elegir qué permitir.",
      acceptAll: "Aceptar todo",
      essential: "Solo esenciales",
      privacy: "Política de privacidad",
    },
    footer: {
      tagline: "Tu guía global para ver el Mundial FIFA 2026.",
      legal: "Legal",
      built: "Hecho para los fans del mundo entero.",
    },
    countdown: { days: "días", hours: "hrs", minutes: "min", seconds: "seg", to: "para el inicio" },
  },
};

export type Messages = typeof messages.en;

export function t(locale: Locale): Messages {
  return messages[locale] as Messages;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

export function localeUrl(locale: Locale, path: string = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
