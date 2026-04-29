import { createFileRoute } from "@tanstack/react-router";
import { getSyncStats } from "@/server/sync-stats.functions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/sync-status")({
  loader: () => getSyncStats(),
  head: () => ({
    meta: [
      { title: "Sync Status — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SyncStatusPage,
});

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "live") return "destructive";
  if (status === "finished") return "secondary";
  if (status === "scheduled") return "default";
  return "outline";
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" });
}

function SyncStatusPage() {
  const stats = Route.useLoaderData();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="font-display text-4xl uppercase">Sync Status</h1>
        <p className="text-muted-foreground">
          Verification of imported data from API-Football. Last fixture update:{" "}
          <span className="font-mono text-foreground">{fmtDateTime(stats.lastUpdatedAt)}</span>
        </p>
      </header>

      {/* Totals */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Teams", value: stats.totals.teams },
          { label: "Fixtures", value: stats.totals.fixtures },
          { label: "Channels", value: stats.totals.channels },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-6">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {card.label}
            </div>
            <div className="font-display text-5xl mt-2 tabular-nums">{card.value}</div>
          </div>
        ))}
      </section>

      {/* By status */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase">By Status</h2>
        <div className="flex flex-wrap gap-3">
          {stats.byStatus.length === 0 ? (
            <span className="text-muted-foreground">No fixtures found.</span>
          ) : (
            stats.byStatus.map((s) => (
              <div key={s.status} className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3">
                <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
                <span className="font-mono text-lg tabular-nums">{s.count}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* By date */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase">By Date</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Scheduled</TableHead>
                <TableHead className="text-right">Live</TableHead>
                <TableHead className="text-right">Finished</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.byDate.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No fixtures yet. Trigger the sync first.
                  </TableCell>
                </TableRow>
              ) : (
                stats.byDate.map((d) => (
                  <TableRow key={d.date}>
                    <TableCell className="font-mono">{d.date}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{d.count}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{d.scheduled}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{d.live}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{d.finished}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Recently updated */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase">Recently Updated</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead>Kickoff (UTC)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentlyUpdated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No data.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentlyUpdated.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">
                      {f.home} <span className="text-muted-foreground">vs</span> {f.away}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{fmtDateTime(f.match_date)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(f.status)}>{f.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {f.home_score ?? "-"} : {f.away_score ?? "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {fmtDateTime(f.updated_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
