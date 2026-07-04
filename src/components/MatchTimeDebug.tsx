import { useEffect, useState } from "react";
import type { Fixture } from "@/lib/data";
import { formatLA, laWallClockToEpoch, LIVE_TZ, LIVE_TZ_LABEL } from "@/lib/time";

/**
 * Floating debug panel that lists each fixture's kickoff in America/Chicago,
 * its live window ([kickoff, kickoff + 2.5h)), the current CT wall-clock
 * time, and the status derived purely from time (finished / live /
 * scheduled). Toggle with `?debug=time` in the URL or by pressing Shift+D.
 *
 * The panel intentionally ignores the DB `status` field so the operator can
 * confirm that whatever the app labels "Live" matches the true wall-clock
 * derived state.
 */

const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000;

type DerivedStatus = "finished" | "live" | "scheduled";
function deriveStatus(kickoffMs: number, now: number): DerivedStatus {
  if (now >= kickoffMs + MATCH_DURATION_MS) return "finished";
  if (now >= kickoffMs) return "live";
  return "scheduled";
}

function useDebugEnabled(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("debug") === "time";
    if (initial) setEnabled(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return [enabled, setEnabled];
}

function useTick(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function fmtCT(epoch: number) {
  return formatLA(new Date(epoch), "en", "full");
}

function statusColor(s: DerivedStatus) {
  if (s === "live") return "text-[var(--success)]";
  if (s === "finished") return "text-muted-foreground";
  return "text-foreground";
}

export function MatchTimeDebug({ fixtures }: { fixtures: Fixture[] }) {
  const [enabled, setEnabled] = useDebugEnabled();
  const now = useTick(1000);

  if (!enabled) return null;

  const rows = [...fixtures]
    .map((f) => {
      const kickoff = new Date(f.match_date).getTime();
      const dbStatus = f.status;
      const derived = deriveStatus(kickoff, now);
      return { f, kickoff, dbStatus, derived };
    })
    .sort((a, b) => a.kickoff - b.kickoff);

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[min(560px,calc(100vw-2rem))] max-h-[70vh] overflow-auto border-2 border-primary bg-background/95 p-3 shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-primary">
          [ Debug · time / status ]
        </div>
        <button
          type="button"
          onClick={() => setEnabled(false)}
          className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
          aria-label="Close debug panel"
        >
          × close
        </button>
      </div>

      <div className="mb-2 space-y-0.5 font-mono text-[10px] text-muted-foreground">
        <div>
          TZ: <span className="text-foreground">{LIVE_TZ}</span> ({LIVE_TZ_LABEL}) · Live window:
          2h30m · Toggle: <kbd className="border border-border px-1">Shift+D</kbd> or{" "}
          <code>?debug=time</code>
        </div>
        <div>
          Now: <span className="text-foreground">{fmtCT(now)}</span>{" "}
          <span className="text-muted-foreground">({now})</span>
        </div>
        <div>
          Self-check: <code>laWallClockToEpoch("04/07/2026","12:00")</code> ={" "}
          {laWallClockToEpoch("04/07/2026", "12:00")}
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 font-mono text-[10px]">
        <thead className="sticky top-0 bg-background/95">
          <tr className="text-left uppercase tracking-wider text-muted-foreground">
            <th className="border-b border-border py-1 pr-2">Match</th>
            <th className="border-b border-border py-1 pr-2">Kickoff (CT)</th>
            <th className="border-b border-border py-1 pr-2">Ends (CT)</th>
            <th className="border-b border-border py-1 pr-2">DB</th>
            <th className="border-b border-border py-1">Derived</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ f, kickoff, dbStatus, derived }) => {
            const end = kickoff + MATCH_DURATION_MS;
            const mismatch = dbStatus !== derived;
            return (
              <tr key={f.id} className={mismatch ? "bg-primary/5" : ""}>
                <td className="border-b border-border/40 py-1 pr-2 align-top text-foreground">
                  <div className="truncate">
                    {f.home_team.name_en} <span className="text-muted-foreground">vs</span>{" "}
                    {f.away_team.name_en}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {f.round ?? ""}
                    {f.home_score !== null && f.away_score !== null
                      ? ` · ${f.home_score}–${f.away_score}`
                      : ""}
                  </div>
                </td>
                <td className="border-b border-border/40 py-1 pr-2 align-top">
                  {formatLA(new Date(kickoff), "en", "full")}
                </td>
                <td className="border-b border-border/40 py-1 pr-2 align-top text-muted-foreground">
                  {formatLA(new Date(end), "en", "time")}
                </td>
                <td className="border-b border-border/40 py-1 pr-2 align-top text-muted-foreground">
                  {dbStatus}
                </td>
                <td className={`border-b border-border/40 py-1 align-top ${statusColor(derived)}`}>
                  {derived.toUpperCase()}
                  {mismatch && <span className="ml-1 text-primary">!</span>}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-2 text-center text-muted-foreground">
                No fixtures in scope.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-2 font-mono text-[9px] text-muted-foreground">
        Rows highlighted in red have a DB status that disagrees with the time-derived state.
      </div>
    </div>
  );
}
