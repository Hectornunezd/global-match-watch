import { describe, expect, it } from "vitest";
import { LIVE_TZ, LIVE_TZ_LABEL, formatLA, laWallClockToEpoch } from "./time";

/**
 * These tests pin behavior to America/Chicago (CT) regardless of the host
 * machine's timezone. They cover:
 *   - all `formatLA` presets in both locales
 *   - CST (winter, UTC-6) and CDT (summer, UTC-5) offsets
 *   - `laWallClockToEpoch` including DST spring-forward and fall-back
 */

describe("constants", () => {
  it("exports Chicago timezone", () => {
    expect(LIVE_TZ).toBe("America/Chicago");
    expect(LIVE_TZ_LABEL).toBe("CT");
  });
});

describe("laWallClockToEpoch", () => {
  it("parses CDT summer wall-clock as UTC-5", () => {
    // 2026-07-04 12:00 CDT === 2026-07-04 17:00 UTC
    expect(laWallClockToEpoch("04/07/2026", "12:00")).toBe(
      Date.UTC(2026, 6, 4, 17, 0, 0),
    );
  });

  it("parses CST winter wall-clock as UTC-6", () => {
    // 2026-01-15 11:00 CST === 2026-01-15 17:00 UTC
    expect(laWallClockToEpoch("15/01/2026", "11:00")).toBe(
      Date.UTC(2026, 0, 15, 17, 0, 0),
    );
  });

  it("handles midnight boundary", () => {
    const late = laWallClockToEpoch("04/07/2026", "23:30");
    const early = laWallClockToEpoch("05/07/2026", "00:15");
    expect(early - late).toBe(45 * 60 * 1000);
  });

  it("resolves spring-forward DST transition (08/03/2026 03:30 → CDT)", () => {
    // DST starts 2026-03-08; 02:00 CST jumps to 03:00 CDT.
    // 03:30 on 03/08 is a valid CDT wall-clock === 08:30 UTC.
    expect(laWallClockToEpoch("08/03/2026", "03:30")).toBe(
      Date.UTC(2026, 2, 8, 8, 30, 0),
    );
  });

  it("resolves fall-back DST transition (01/11/2026 03:00 → CST)", () => {
    // DST ends 2026-11-01; 02:00 CDT falls back to 01:00 CST.
    // 03:00 on 01/11 is unambiguous CST === 09:00 UTC.
    expect(laWallClockToEpoch("01/11/2026", "03:00")).toBe(
      Date.UTC(2026, 10, 1, 9, 0, 0),
    );
  });

  it("orders bracket kickoffs across a day boundary", () => {
    const kickoffs = [
      laWallClockToEpoch("05/07/2026", "13:00"),
      laWallClockToEpoch("04/07/2026", "14:00"),
      laWallClockToEpoch("04/07/2026", "10:00"),
    ];
    const sorted = [...kickoffs].sort((a, b) => a - b);
    expect(sorted).toEqual([
      laWallClockToEpoch("04/07/2026", "10:00"),
      laWallClockToEpoch("04/07/2026", "14:00"),
      laWallClockToEpoch("05/07/2026", "13:00"),
    ]);
  });
});

describe("formatLA", () => {
  // 2026-07-04 17:00 UTC === 2026-07-04 12:00 PM CDT (Saturday)
  const cdt = new Date(Date.UTC(2026, 6, 4, 17, 0, 0));
  // 2026-01-15 17:00 UTC === 2026-01-15 11:00 AM CST (Thursday)
  const cst = new Date(Date.UTC(2026, 0, 15, 17, 0, 0));
  // 2026-07-04 05:00 UTC === 2026-07-04 12:00 AM CDT (midnight)
  const midnightCDT = new Date(Date.UTC(2026, 6, 4, 5, 0, 0));

  describe("time preset", () => {
    it("formats CDT time in en", () => {
      expect(formatLA(cdt, "en", "time")).toBe("12:00 PM CT");
    });
    it("formats CST time in en", () => {
      expect(formatLA(cst, "en", "time")).toBe("11:00 AM CT");
    });
    it("formats time in es (24h source rendered as 12h)", () => {
      const s = formatLA(cdt, "es", "time");
      expect(s).toMatch(/CT$/);
      expect(s).toMatch(/12:00/);
    });
    it("uppercases dayPeriod", () => {
      expect(formatLA(midnightCDT, "en", "time")).toContain("AM");
    });
  });

  describe("dayMonth preset", () => {
    it("orders day/month per locale", () => {
      expect(formatLA(cdt, "en", "dayMonth")).toBe("Jul 4");
      const es = formatLA(cdt, "es", "dayMonth");
      expect(es).toMatch(/^4\s/);
      expect(es.toLowerCase()).toContain("jul");
    });
  });

  describe("dayMonthShort preset", () => {
    it("pads day to two digits", () => {
      expect(formatLA(cdt, "en", "dayMonthShort")).toBe("Jul 04");
      const es = formatLA(cdt, "es", "dayMonthShort");
      expect(es).toMatch(/^04\s/);
    });
  });

  describe("full preset", () => {
    it("renders full string in en", () => {
      const s = formatLA(cdt, "en", "full");
      expect(s).toBe("Saturday, July 4, 2026 · 12:00 PM CT");
    });
    it("renders full string in es", () => {
      const s = formatLA(cdt, "es", "full");
      // ICU emits "P.<NBSP>M." for es in modern versions; also "PM" in others.
      expect(s).toMatch(/^sábado, 4 de julio de 2026, 12:00 (PM|P\.\sM\.) CT$/);
    });
  });

  describe("banner preset (default)", () => {
    it("renders banner in en", () => {
      expect(formatLA(cdt, "en")).toBe("Sat, Jul 4 · 12:00 PM CT");
    });
    it("renders banner in es", () => {
      const s = formatLA(cdt, "es");
      expect(s).toMatch(/^\S+ 4 \S+, 12:00 (PM|P\.\sM\.) CT$/);
    });
    it("uses CT label in winter too (CST)", () => {
      expect(formatLA(cst, "en")).toMatch(/CT$/);
      expect(formatLA(cst, "en")).toContain("11:00 AM");
    });
    it("crosses the CT date boundary correctly", () => {
      // 2026-07-05 04:59 UTC === 2026-07-04 11:59 PM CDT (still Saturday CT)
      const lateSat = new Date(Date.UTC(2026, 6, 5, 4, 59, 0));
      expect(formatLA(lateSat, "en")).toContain("Jul 4");
      // 2026-07-05 05:00 UTC === 2026-07-05 12:00 AM CDT (Sunday CT)
      const earlySun = new Date(Date.UTC(2026, 6, 5, 5, 0, 0));
      expect(formatLA(earlySun, "en")).toContain("Jul 5");
    });
  });

  it("is deterministic regardless of host TZ (round-trip via laWallClockToEpoch)", () => {
    const epoch = laWallClockToEpoch("04/07/2026", "12:00");
    expect(formatLA(new Date(epoch), "en", "time")).toBe("12:00 PM CT");
    expect(formatLA(new Date(epoch), "en", "dayMonth")).toBe("Jul 4");
  });
});
