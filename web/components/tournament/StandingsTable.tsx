"use client";

import { Download } from "lucide-react";

export interface StandingRow {
  rank: number;
  teamId?: string;
  teamName: string;
  teamLogoUrl?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  groupLabel?: string;
}

interface StandingsTableProps {
  standings: StandingRow[] | { groupLabel: string; rows: StandingRow[] }[];
  tournamentName?: string;
  showExport?: boolean;
  /** When set, team name becomes clickable and opens team detail (e.g. modal) */
  onTeamClick?: (teamId: string) => void;
}

function getGroups(
  standings: StandingRow[] | { groupLabel: string; rows: StandingRow[] }[],
) {
  return Array.isArray(standings) && standings.length > 0
    ? "groupLabel" in standings[0]
      ? (standings as { groupLabel: string; rows: StandingRow[] }[])
      : [{ groupLabel: "All", rows: standings as StandingRow[] }]
    : [];
}

export function exportStandingsToCsv(
  standings: StandingRow[] | { groupLabel: string; rows: StandingRow[] }[],
  filename = "standings.csv",
) {
  const groups = getGroups(standings);
  const headers = [
    "Group",
    "Rank",
    "Team",
    "P",
    "W",
    "D",
    "L",
    "Goals For",
    "Goals Against",
    "Goal Diff",
    "PTS",
  ];
  const rows: string[][] = [];
  for (const g of groups) {
    for (const row of g.rows ?? []) {
      rows.push([
        g.groupLabel,
        String(row.rank),
        row.teamName,
        String(row.played),
        String(row.wins),
        String(row.draws),
        String(row.losses),
        String(row.goalsFor),
        String(row.goalsAgainst),
        String(row.goalDifference),
        String(row.points),
      ]);
    }
  }
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StandingsTable({
  standings,
  tournamentName,
  showExport = false,
  onTeamClick,
}: StandingsTableProps) {
  const groups = getGroups(standings);

  if (groups.length === 0) {
    return (
      <div className="space-y-2">
        {showExport && (
          <p className="text-sm text-muted-foreground">
            Export available when standings data is present.
          </p>
        )}
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No standings data yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showExport && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              exportStandingsToCsv(
                standings,
                tournamentName
                  ? `${tournamentName.replace(/[^a-z0-9]/gi, "_")}_standings.csv`
                  : "standings.csv",
              )
            }
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      )}
      {groups.map((g) => (
        <div key={g.groupLabel}>
          <h3 className="mb-2 font-medium">{g.groupLabel}</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">#</th>
                  <th
                    className="p-2 text-left font-medium w-10"
                    aria-label="Logo"
                  />
                  <th className="p-2 text-left font-medium">Team</th>
                  <th className="p-2 text-center font-medium">P</th>
                  <th className="p-2 text-center font-medium">W</th>
                  <th className="p-2 text-center font-medium">D</th>
                  <th className="p-2 text-center font-medium">L</th>
                  <th className="p-2 text-center font-medium">SF</th>
                  <th className="p-2 text-center font-medium">SA</th>
                  <th className="p-2 text-center font-medium">SD</th>
                  <th className="p-2 text-center font-medium">PTS</th>
                </tr>
              </thead>
              <tbody>
                {(g.rows ?? []).map((row, i) => (
                  <tr
                    key={row.teamId ?? i}
                    className={i < 2 ? "bg-primary/5" : ""}
                  >
                    <td className="p-2">{row.rank}</td>
                    <td className="p-2">
                      {row.teamLogoUrl ? (
                        <img
                          src={row.teamLogoUrl}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover border border-input"
                        />
                      ) : (
                        <span
                          className="h-8 w-8 block rounded-full bg-muted"
                          aria-hidden
                        />
                      )}
                    </td>
                    <td className="p-2 font-medium">
                      {row.teamId && onTeamClick ? (
                        <button
                          type="button"
                          onClick={() => onTeamClick(row.teamId!)}
                          className="text-left hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                        >
                          {row.teamName}
                        </button>
                      ) : (
                        row.teamName
                      )}
                    </td>
                    <td className="p-2 text-center">{row.played}</td>
                    <td className="p-2 text-center">{row.wins}</td>
                    <td className="p-2 text-center">{row.draws}</td>
                    <td className="p-2 text-center">{row.losses}</td>
                    <td className="p-2 text-center">{row.goalsFor}</td>
                    <td className="p-2 text-center">{row.goalsAgainst}</td>
                    <td className="p-2 text-center">{row.goalDifference}</td>
                    <td className="p-2 text-center font-medium">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
