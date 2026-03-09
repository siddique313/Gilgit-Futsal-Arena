"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import {
  StandingsTable,
  exportStandingsToCsv,
  type StandingRow,
} from "./StandingsTable";
import {
  TeamDetailModal,
  type TeamRow,
  type PlayerRow,
} from "./TeamDetailModal";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

function getGroups(
  standings: StandingRow[] | { groupLabel: string; rows: StandingRow[] }[],
) {
  return Array.isArray(standings) && standings.length > 0
    ? "groupLabel" in standings[0]
      ? (standings as { groupLabel: string; rows: StandingRow[] }[])
      : [{ groupLabel: "All", rows: standings as StandingRow[] }]
    : [];
}

interface StandingsViewProps {
  standings: StandingRow[] | { groupLabel: string; rows: StandingRow[] }[];
  tournamentName?: string;
  tournamentId?: string;
  showExport?: boolean;
}

export function StandingsView({
  standings,
  tournamentName,
  tournamentId,
  showExport = false,
}: StandingsViewProps) {
  const groups = getGroups(standings);
  const [activeGroup, setActiveGroup] = useState(
    groups.length > 0 ? groups[0].groupLabel : null,
  );
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamModalTeam, setTeamModalTeam] = useState<TeamRow | null>(null);
  const [teamModalPlayers, setTeamModalPlayers] = useState<PlayerRow[]>([]);

  const handleTeamClick = useCallback(
    async (teamId: string) => {
      if (!tournamentId) return;
      try {
        const [teamRes, playersRes] = await Promise.all([
          fetch(`${API_BASE}/teams/${teamId}`),
          fetch(`${API_BASE}/teams/${teamId}/players`),
        ]);
        if (teamRes.ok && playersRes.ok) {
          const team: TeamRow = await teamRes.json();
          const players: PlayerRow[] = await playersRes.json();
          setTeamModalTeam(team);
          setTeamModalPlayers(players);
          setTeamModalOpen(true);
        }
      } catch {
        //
      }
    },
    [tournamentId],
  );

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

  const activeData =
    activeGroup !== null
      ? groups.find((g) => g.groupLabel === activeGroup)
      : null;
  const displayStandings = activeData
    ? [{ groupLabel: activeData.groupLabel, rows: activeData.rows }]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Group tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1">
          {groups.map((g) => (
            <button
              key={g.groupLabel}
              type="button"
              onClick={() => setActiveGroup(g.groupLabel)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeGroup === g.groupLabel
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.groupLabel}
            </button>
          ))}
        </div>
        {showExport && (
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
        )}
      </div>
      <StandingsTable
        standings={displayStandings}
        tournamentName={tournamentName}
        showExport={false}
        onTeamClick={tournamentId ? handleTeamClick : undefined}
      />
      {tournamentId && (
        <TeamDetailModal
          open={teamModalOpen}
          onOpenChange={setTeamModalOpen}
          mode="edit"
          tournamentId={tournamentId}
          team={teamModalTeam}
          initialPlayers={teamModalPlayers}
        />
      )}
    </div>
  );
}
