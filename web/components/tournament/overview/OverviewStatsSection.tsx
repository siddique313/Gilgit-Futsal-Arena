"use client";

import { BarChart3, Download } from "lucide-react";

type OverviewStatsSectionProps = {
  tournamentName: string;
  slug: string;
  sport: string;
  description: string | null;
  teamsCount?: number;
  matchesCount?: number;
};

function escapeCsv(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export function OverviewStatsSection({
  tournamentName,
  slug,
  sport,
  description,
  teamsCount = 0,
  matchesCount,
}: OverviewStatsSectionProps) {
  function exportOverviewCsv() {
    const headers = [
      "Tournament Name",
      "Slug",
      "Sport",
      "Description",
      "Teams Count",
      "Matches Count",
    ];
    const row = [
      escapeCsv(tournamentName),
      escapeCsv(slug),
      escapeCsv(sport),
      escapeCsv(description ?? ""),
      escapeCsv(teamsCount),
      escapeCsv(matchesCount ?? ""),
    ];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}_overview.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasStats = teamsCount > 0 || (matchesCount != null && matchesCount > 0);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2 border-l-4 border-primary pl-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Overview</h2>
        </div>
        <button
          type="button"
          onClick={exportOverviewCsv}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      <div className="mt-2 pl-3 text-sm text-muted-foreground">
        {hasStats ? (
          <ul className="space-y-1">
            {teamsCount > 0 && <li>{teamsCount} team(s)</li>}
            {matchesCount != null && matchesCount > 0 && (
              <li>{matchesCount} match(es)</li>
            )}
          </ul>
        ) : (
          <p className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 shrink-0" />
            No statistics yet. Add teams and matches to see an overview.
          </p>
        )}
      </div>
    </section>
  );
}
