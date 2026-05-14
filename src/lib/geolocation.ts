import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getCookie, setCookie } from "@tanstack/react-start/server";
import { defaultLocaleForCountry, type Locale } from "./i18n";

// ISO 3166-1 alpha-2 → alpha-3 mapping for the countries we support
const ALPHA2_TO_ALPHA3: Record<string, string> = {
  US: "USA", GB: "GBR", CA: "CAN", AU: "AUS", MX: "MEX", ES: "ESP",
  AR: "ARG", CO: "COL", BR: "BRA", FR: "FRA", DE: "DEU", IT: "ITA",
  JP: "JPN", KR: "KOR", IN: "IND", SA: "SAU", QA: "QAT",
  BE: "BEL", BZ: "BLZ", BO: "BOL", CH: "CHE", CL: "CHL", CR: "CRI",
  EC: "ECU", EG: "EGY", GT: "GTM", GY: "GUY", HN: "HND", HR: "HRV",
  IE: "IRL", MA: "MAR", NI: "NIC", NL: "NLD", NZ: "NZL", PA: "PAN",
  PE: "PER", PL: "POL", PT: "PRT", PY: "PRY", SN: "SEN", SV: "SLV",
  SR: "SUR", TR: "TUR", UY: "URY", VE: "VEN", ZA: "ZAF",
  FI: "FIN", DK: "DNK", SI: "SVN",
  HK: "HKG", SG: "SGP", ID: "IDN", PH: "PHL", TW: "TWN", MN: "MNG",
  KH: "KHM", MO: "MAC", TL: "TLS", NP: "NPL", MV: "MDV", MY: "MYS",
  TH: "THA", BN: "BRN", LA: "LAO", AE: "ARE", KW: "KWT",
  KZ: "KAZ", KG: "KGZ", TJ: "TJK", TM: "TKM",
};

const ALPHA3_TO_ALPHA2: Record<string, string> = Object.fromEntries(
  Object.entries(ALPHA2_TO_ALPHA3).map(([a2, a3]) => [a3, a2])
);

export const SUPPORTED_ALPHA3 = Object.values(ALPHA2_TO_ALPHA3);

export function alpha2ToAlpha3(a2: string | null | undefined): string | null {
  if (!a2) return null;
  return ALPHA2_TO_ALPHA3[a2.toUpperCase()] ?? null;
}

export function alpha3ToAlpha2(a3: string | null | undefined): string | null {
  if (!a3) return null;
  return ALPHA3_TO_ALPHA2[a3.toUpperCase()] ?? null;
}

async function lookupCountryByIP(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      headers: { "User-Agent": "matchlivenow/1.0" },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const text = (await res.text()).trim().toUpperCase();
    return /^[A-Z]{2}$/.test(text) ? text : null;
  } catch {
    return null;
  }
}

export const detectGeo = createServerFn({ method: "GET" }).handler(async () => {
  const cookieCountry = getCookie("user_country");
  const cfCountry =
    getRequestHeader("CF-IPCountry") ?? getRequestHeader("cf-ipcountry");
  const vercelCountry =
    getRequestHeader("X-Vercel-IP-Country") ?? getRequestHeader("x-vercel-ip-country");

  let alpha2 = (cookieCountry || cfCountry || vercelCountry || "").toUpperCase();

  // Fallback: real IP lookup when no edge geo header is available
  if (!alpha2) {
    const fwd =
      getRequestHeader("x-forwarded-for") ?? getRequestHeader("X-Forwarded-For");
    const realIp =
      getRequestHeader("x-real-ip") ?? getRequestHeader("X-Real-IP");
    const ip = (fwd?.split(",")[0]?.trim() || realIp || "").trim();
    if (ip && !ip.startsWith("127.") && !ip.startsWith("10.") && !ip.startsWith("192.168.")) {
      const looked = await lookupCountryByIP(ip);
      if (looked) alpha2 = looked;
    }
  }

  if (!alpha2) alpha2 = "US";
  const alpha3 = alpha2ToAlpha3(alpha2) ?? "USA";
  // Persist for next request if not already set
  if (!cookieCountry) {
    setCookie("user_country", alpha2, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  const locale: Locale = defaultLocaleForCountry(alpha2);
  return { alpha2, alpha3, locale };
});

/**
 * Client-side cookie helpers for country override.
 */
export function setCountryCookieClient(alpha2: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `user_country=${alpha2.toUpperCase()}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function getCountryCookieClient(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)user_country=([^;]+)/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
}
