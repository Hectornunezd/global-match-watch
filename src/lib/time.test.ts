import { describe, expect, it } from "vitest";
import { LIVE_TZ, LIVE_TZ_LABEL, formatLA, laWallClockToEpoch } from "./time";

/**
 * These tests pin behavior to America/Los_Angeles regardless of the host
 * machine's timezone. They cover:
 *   - all `formatLA` presets in both locales
 *   - PST (winter, UTC-8) and PDT (summer, UTC-7) offsets
 *   - `laWallClockToEpoch` including DST spring-forward and fall-back
 */

describe("constants", () => {
  it("exports LA timezone", () => {
    expect(LIVE_TZ).toBe("America/Los_Angeles");
    expect(LIVE_TZ_LABEL).toBe("CT");
  });
});

describe("laWallClockToEpoch", () => {
  it("parses PDT summer wall-clock as UTC-7", () => {
    // 2026-07-04 10:00 PDT === 2026-07-04 17:00 UTC
    expect(laWallClockToEpoch("04/07/2026", "10:00")).toBe(
      Date.UTC(2026, 6, 4, 17, 0, 0),
    );
  });

  it("parses PST winter wall-clock as UTC-8", () => {
    // 2026-01-15 09:00 PST === 2026-01-15 17:00 UTC
    expect(laWallClockToEpoch("15/01/2026", "09:00")).toBe(
      Date.UTC(2026, 0, 15, 17, 0, 0),
    );
  });

  it("handles midnight boundary", () => {
    const late = laWallClockToEpoch("04/07/2026", "23:30");
    const early = laWallClockToEpoch("05/07/2026", "00:15");
    expect(early - late).toBe(45 * 60 * 1000);
  });

  it("resolves spring-forward DST transition (03/08/2026 03:30 → PDT)", () => {
    // DST starts 2026-03-08; 02:00 PST jumps to 03:00 PDT.
    // 03:30 on 03/08 is a valid PDT wall-clock === 10:30 UTC.
    expect(laWallClockToEpoch("08/03/2026", "03:30")).toBe(
      Date.UTC(2026, 2, 8, 10, 30, 0),
    );
  });

  it("resolves fall-back DST transition (01/11/2026 03:00 → PST)", () => {
    // DST ends 2026-11-01; 02:00 PDT falls back to 01:00 PST.
    // 03:00 on 01/11 is unambiguous PST === 11:00 UTC.
    expect(laWallClockToEpoch("01/11/2026", "03:00")).toBe(
      Date.UTC(2026, 10, 1, 11, 0, 0),
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
  // 2026-07-04 17:00 UTC === 2026-07-04 10:00 AM PDT (Saturday)
  const pdt = new Date(Date.UTC(2026, 6, 4, 17, 0, 0));
  // 2026-01-15 17:00 UTC === 2026-01-15 09:00 AM PST (Thursday)
  const pst = new Date(Date.UTC(2026, 0, 15, 17, 0, 0));
  // 2026-07-04 07:00 UTC === 2026-07-04 12:00 AM PDT (midnight)
  const midnightPDT = new Date(Date.UTC(2026, 6, 4, 7, 0, 0));

  describe("time preset", () => {
    it("formats PDT time in en", () => {
      expect(formatLA(pdt, "en", "time")).toBe("10:00 AM CT");
    });
    it("formats PST time in en", () => {
      expect(formatLA(pst, "en", "time")).toBe("09:00 AM CT");
    });
    it("formats time in es (24h source rendered as 12h)", () => {
      const s = formatLA(pdt, "es", "time");
      expect(s).toMatch(/PT$/);
      expect(s).toMatch(/10:00/);
    });
    it("uppercases dayPeriod", () => {
      expect(formatLA(midnightPDT, "en", "time")).toContain("AM");
    });
  });

  describe("dayMonth preset", () => {
    it("orders day/month per locale", () => {
      expect(formatLA(pdt, "en", "dayMonth")).toBe("Jul 4");
      const es = formatLA(pdt, "es", "dayMonth");
      expect(es).toMatch(/^4\s/);
      expect(es.toLowerCase()).toContain("jul");
    });
  });

  describe("dayMonthShort preset", () => {
    it("pads day to two digits", () => {
      expect(formatLA(pdt, "en", "dayMonthShort")).toBe("Jul 04");
      const es = formatLA(pdt, "es", "dayMonthShort");
      expect(es).toMatch(/^04\s/);
    });
  });

  describe("full preset", () => {
    it("renders full string in en", () => {
      const s = formatLA(pdt, "en", "full");
      expect(s).toBe("Saturday, July 4, 2026 · 10:00 AM CT");
    });
    it("renders full string in es", () => {
      const s = formatLA(pdt, "es", "full");
      // ICU emite "A.<NBSP>M." para es en versiones modernas; también "AM" en otras.
      expect(s).toMatch(/^sábado, 4 de julio de 2026, 10:00 (AM|A\.\sM\.) PT$/);
    });
  });

  describe("banner preset (default)", () => {
    it("renders banner in en", () => {
      expect(formatLA(pdt, "en")).toBe("Sat, Jul 4 · 10:00 AM CT");
    });
    it("renders banner in es", () => {
      const s = formatLA(pdt, "es");
      expect(s).toMatch(/^\S+ 4 \S+, 10:00 (AM|A\.\sM\.) PT$/);
    });
    it("uses PST label in winter", () => {
      // Both PDT and PST render as "PT" (the label is unified)
      expect(formatLA(pst, "en")).toMatch(/PT$/);
      expect(formatLA(pst, "en")).toContain("09:00 AM");
    });
    it("crosses the LA date boundary correctly", () => {
      // 2026-07-05 06:59 UTC === 2026-07-04 11:59 PM PDT (still Saturday LA)
      const lateSat = new Date(Date.UTC(2026, 6, 5, 6, 59, 0));
      expect(formatLA(lateSat, "en")).toContain("Jul 4");
      // 2026-07-05 07:00 UTC === 2026-07-05 12:00 AM PDT (Sunday LA)
      const earlySun = new Date(Date.UTC(2026, 6, 5, 7, 0, 0));
      expect(formatLA(earlySun, "en")).toContain("Jul 5");
    });
  });

  it("is deterministic regardless of host TZ (round-trip via laWallClockToEpoch)", () => {
    const epoch = laWallClockToEpoch("04/07/2026", "10:00");
    expect(formatLA(new Date(epoch), "en", "time")).toBe("10:00 AM CT");
    expect(formatLA(new Date(epoch), "en", "dayMonth")).toBe("Jul 4");
  });
});
