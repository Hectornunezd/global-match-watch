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
    nav: {
      home: "Home",
      teams: "Clubs",
      table: "Table",
      calendar: "Schedule",
      liguilla: "Liguilla",
      countries: "Countries",
      privacy: "Privacy",
      terms: "Terms",
    },
    hero: {
      title: "Where to Watch Liga MX Live",
      subtitle:
        "Every Liga MX Apertura 2026 match, the full table and every TV channel and streaming service — wherever you are.",
      cta: "See the fixtures",
      badge: "LIGA MX APERTURA 2026",
      leagueIsOn: "Apertura 2026 is on",
    },
    sections: {
      liveNow: "Live Now",
      upcoming: "Upcoming Matches",
      allMatches: "All Matches",
      allGroups: "All matchdays",
      group: "Matchday",
      matchday: "Matchday",
      standings: "Liga MX Table",
      fullTable: "Full table",
      fullCalendar: "Full schedule",
      liguilla: "Liguilla",
      whereToWatch: "Where to watch in",
      otherMatches: "Other matches in this matchday",
      odds: "Odds for this match",
      faq: "Frequently asked questions",
      schedule: "Match schedule",
      channels: "TV channels & streaming",
      upcomingFor: "Upcoming matches",
      pastResults: "Past results",
    },
    table: {
      pos: "#",
      club: "Club",
      played: "P",
      won: "W",
      drawn: "D",
      lost: "L",
      goalsFor: "GF",
      goalsAgainst: "GA",
      goalDiff: "GD",
      points: "PTS",
      form: "Form",
      liguillaZone: "Direct Liguilla spots",
      playInZone: "Play-in zone",
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
      venue: "Stadium",
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
      tagline: "Your guide to watching every Liga MX match.",
      legal: "Legal",
      built: "Built for Liga MX fans.",
    },
    countdown: { days: "days", hours: "hrs", minutes: "min", seconds: "sec", to: "to kickoff" },
  },
  es: {
    nav: {
      home: "Inicio",
      teams: "Clubes",
      table: "Tabla",
      calendar: "Calendario",
      liguilla: "Liguilla",
      countries: "Países",
      privacy: "Privacidad",
      terms: "Términos",
    },
    hero: {
      title: "Dónde ver la Liga MX en vivo",
      subtitle:
        "Todos los partidos del Apertura 2026, la tabla general y cada canal de TV y streaming — desde donde estés.",
      cta: "Ver los partidos",
      badge: "LIGA MX APERTURA 2026",
      leagueIsOn: "El Apertura 2026 está en marcha",
    },
    sections: {
      liveNow: "En vivo ahora",
      upcoming: "Próximos partidos",
      allMatches: "Todos los partidos",
      allGroups: "Todas las jornadas",
      group: "Jornada",
      matchday: "Jornada",
      standings: "Tabla general Liga MX",
      fullTable: "Tabla completa",
      fullCalendar: "Calendario completo",
      liguilla: "Liguilla",
      whereToWatch: "Dónde ver en",
      otherMatches: "Otros partidos de esta jornada",
      odds: "Cuotas para este partido",
      faq: "Preguntas frecuentes",
      schedule: "Calendario de partidos",
      channels: "Canales de TV y streaming",
      upcomingFor: "Próximos partidos",
      pastResults: "Resultados anteriores",
    },
    table: {
      pos: "#",
      club: "Club",
      played: "JJ",
      won: "G",
      drawn: "E",
      lost: "P",
      goalsFor: "GF",
      goalsAgainst: "GC",
      goalDiff: "DIF",
      points: "PTS",
      form: "Últimos 5",
      liguillaZone: "Liguilla directa",
      playInZone: "Zona de play-in",
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
      venue: "Estadio",
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
      tagline: "Tu guía para ver todos los partidos de la Liga MX.",
      legal: "Legal",
      built: "Hecho para los aficionados de la Liga MX.",
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
