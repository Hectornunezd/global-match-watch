/**
 * Unified date/time helpers. Everything in the app renders and reasons about
 * matches in America/Los_Angeles (PT), never in UTC or the visitor's local zone.
 *
 * All formatters use Intl.DateTimeFormat#formatToParts so that server (Node)
 * and browser render identical strings — avoiding React hydration mismatches
 * that occur when ICU emits locale-specific separators (e.g. "," vs " at ").
 */
import type { Locale } from "@/lib/i18n";

export const LIVE_TZ = "America/Chicago";
export const LIVE_TZ_LABEL = "CT";

type Preset = "banner" | "time" | "dayMonth" | "full" | "dayMonthShort";

function partsFor(date: Date, locale: Locale, opts: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    timeZone: LIVE_TZ,
    ...opts,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { get, parts };
}

function clean(s: string) {
  return s.replace(/\.$/, "");
}

/** Format a Date in LA time using a stable, hydration-safe preset. */
export function formatLA(date: Date, locale: Locale, preset: Preset = "banner"): string {
  if (preset === "time") {
    const { get } = partsFor(date, locale, { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()} ${LIVE_TZ_LABEL}`;
  }
  if (preset === "dayMonth") {
    const { get } = partsFor(date, locale, { day: "numeric", month: "short" });
    return locale === "es"
      ? `${get("day")} ${clean(get("month"))}`
      : `${clean(get("month"))} ${get("day")}`;
  }
  if (preset === "dayMonthShort") {
    const { get } = partsFor(date, locale, { day: "2-digit", month: "short" });
    return locale === "es"
      ? `${get("day")} ${clean(get("month"))}`
      : `${clean(get("month"))} ${get("day")}`;
  }
  if (preset === "full") {
    const { get } = partsFor(date, locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const weekday = clean(get("weekday"));
    const month = clean(get("month"));
    const day = get("day");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");
    const dp = get("dayPeriod").toUpperCase();
    return locale === "es"
      ? `${weekday}, ${day} de ${month} de ${year}, ${hour}:${minute} ${dp} ${LIVE_TZ_LABEL}`
      : `${weekday}, ${month} ${day}, ${year} · ${hour}:${minute} ${dp} ${LIVE_TZ_LABEL}`;
  }
  // banner
  const { get } = partsFor(date, locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const weekday = clean(get("weekday"));
  const month = clean(get("month"));
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const dp = get("dayPeriod").toUpperCase();
  return locale === "es"
    ? `${weekday} ${day} ${month}, ${hour}:${minute} ${dp} ${LIVE_TZ_LABEL}`
    : `${weekday}, ${month} ${day} · ${hour}:${minute} ${dp} ${LIVE_TZ_LABEL}`;
}

/**
 * Parse a LA wall-clock date/time (e.g. "04/07/2026" + "10:00") as an epoch
 * instant. Treats the input as America/Los_Angeles local time, not UTC and
 * not the browser's local zone.
 */
export function laWallClockToEpoch(dateDMY: string, timeHM: string): number {
  const [d, mo, y] = dateDMY.split("/");
  const [hh, mm] = timeHM.split(":");
  const target = Date.UTC(+y, +mo - 1, +d, +hh, +mm, 0);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: LIVE_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const offsetAt = (instant: number) => {
    const parts = fmt.formatToParts(new Date(instant));
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
    const asLA = Date.UTC(
      +get("year"), +get("month") - 1, +get("day"),
      +get("hour").replace("24", "00"), +get("minute"), +get("second"),
    );
    return asLA - instant; // LA is behind UTC → negative
  };
  // Two-pass fix so DST transitions resolve correctly: the first offset is
  // measured at the wrong instant, the second at the corrected one.
  let epoch = target - offsetAt(target);
  epoch = target - offsetAt(epoch);
  return epoch;
}

