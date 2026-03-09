"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogoUpload } from "@/components/ui/LogoUpload";
import {
  TeamDetailModal,
  type TeamRow,
  type PlayerRow,
} from "@/components/tournament/TeamDetailModal";
import { Pencil, Trash2, Plus, Download, UserPlus } from "lucide-react";

type Player = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
};

type Team = TeamRow;

function exportTeamsToCsv(
  groups: { groupLabel: string; teams: Team[] }[],
  playersByTeamId: Record<string, Player[]>,
  filename = "teams.csv",
) {
  const headers = ["Group", "Team", "Player Name", "Role"];
  const rows: string[][] = [];
  for (const g of groups) {
    for (const team of g.teams) {
      const players = playersByTeamId[team.id] ?? [];
      if (players.length === 0) {
        rows.push([g.groupLabel, team.name, "", ""]);
      } else {
        for (const p of players) {
          rows.push([g.groupLabel, team.name, p.name, p.role ?? ""]);
        }
      }
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

export function TeamsCrud({
  tournamentId,
  tournamentName,
  initialTeams,
  initialPlayersByTeamId = {},
}: {
  tournamentId: string;
  tournamentName?: string;
  initialTeams: Team[];
  initialPlayersByTeamId?: Record<string, Player[]>;
}) {
  const router = useRouter();
  const [teams, setTeams] = useState(initialTeams);
  const [playersByTeamId, setPlayersByTeamId] = useState<
    Record<string, Player[]>
  >(initialPlayersByTeamId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingPlayerTeamId, setAddingPlayerTeamId] = useState<string | null>(
    null,
  );
  const [playerName, setPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalTeam, setDetailModalTeam] = useState<Team | null>(null);
  const base = process.env.NEXT_PUBLIC_API_URL || "";

  async function loadPlayers(teamId: string): Promise<Player[]> {
    try {
      const res = await fetch(`${base}/teams/${teamId}/players`);
      if (res.ok) {
        const list = await res.json();
        setPlayersByTeamId((prev) => ({ ...prev, [teamId]: list }));
        return list;
      }
    } catch {
      //
    }
    return playersByTeamId[teamId] ?? [];
  }

  async function refetchTeamsAndPlayers() {
    try {
      const res = await fetch(`${base}/tournaments/${tournamentId}/teams`);
      if (res.ok) {
        const list = await res.json();
        setTeams(list);
        const next: Record<string, Player[]> = {};
        await Promise.all(
          list.map(async (t: Team) => {
            const pr = await fetch(`${base}/teams/${t.id}/players`);
            if (pr.ok) next[t.id] = await pr.json();
          }),
        );
        setPlayersByTeamId(next);
      }
    } catch {
      //
    }
  }

  const groups = useMemo(() => {
    const map = new Map<string, Team[]>();
    for (const team of teams) {
      const key = team.groupLabel?.trim() || "No group";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(team);
    }
    const labels = Array.from(map.keys()).sort((a, b) => {
      if (a === "No group") return 1;
      if (b === "No group") return -1;
      return a.localeCompare(b);
    });
    return labels.map((groupLabel) => ({
      groupLabel,
      teams: map.get(groupLabel)!,
    }));
  }, [teams]);

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          groupLabel: groupLabel.trim() || null,
          logoUrl: logoUrl ?? undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTeams((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setEditingId(null);
        setName("");
        setGroupLabel("");
        setLogoUrl(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/teams/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeams((prev) => prev.filter((t) => t.id !== id));
        setPlayersByTeamId((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        if (editingId === id) setEditingId(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(team: Team) {
    setEditingId(team.id);
    setName(team.name);
    setGroupLabel(team.groupLabel || "");
    setLogoUrl(team.logoUrl ?? null);
  }

  async function handleAddPlayer(e: React.FormEvent, teamId: string) {
    e.preventDefault();
    if (!playerName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, name: playerName.trim() }),
      });
      if (res.ok) {
        setPlayerName("");
        setAddingPlayerTeamId(null);
        await loadPlayers(teamId);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePlayer(
    e: React.FormEvent,
    playerId: string,
    teamId: string,
  ) {
    e.preventDefault();
    if (!editingPlayerName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingPlayerName.trim() }),
      });
      if (res.ok) {
        setEditingPlayerId(null);
        setEditingPlayerName("");
        await loadPlayers(teamId);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlayer(playerId: string, teamId: string) {
    if (!confirm("Remove this member?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/players/${playerId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlayersByTeamId((prev) => ({
          ...prev,
          [teamId]: (prev[teamId] ?? []).filter((p) => p.id !== playerId),
        }));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {teams.length} team(s)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              exportTeamsToCsv(
                groups,
                playersByTeamId,
                tournamentName
                  ? `${tournamentName.replace(/[^a-z0-9]/gi, "_")}_teams.csv`
                  : "teams.csv",
              )
            }
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          {!editingId && (
            <button
              type="button"
              onClick={() => {
                setDetailModalTeam(null);
                setDetailModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add team
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {groups.map(({ groupLabel: label, teams: groupTeams }) => (
          <div key={label}>
            <h2 className="text-center font-semibold text-foreground mb-4">
              {label}
            </h2>
            <ul className="space-y-4">
              {groupTeams.map((team) =>
                editingId === team.id ? (
                  <li key={team.id}>
                    <form
                      onSubmit={(e) => handleUpdate(e, team.id)}
                      className="rounded-lg border bg-card p-4 space-y-3"
                    >
                      <h3 className="font-medium">Edit team</h3>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Team name"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      />
                      <input
                        value={groupLabel}
                        onChange={(e) => setGroupLabel(e.target.value)}
                        placeholder="Group (e.g. Group A)"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <LogoUpload
                        value={logoUrl}
                        onChange={setLogoUrl}
                        label="Team logo"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                          {loading ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setName("");
                            setGroupLabel("");
                            setLogoUrl(null);
                          }}
                          className="rounded-md border px-4 py-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </li>
                ) : (
                  <li
                    key={team.id}
                    className="flex flex-wrap items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setDetailModalTeam(team);
                      setDetailModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDetailModalTeam(team);
                        setDetailModalOpen(true);
                      }
                    }}
                  >
                    <div className="flex flex-1 min-w-0 flex-wrap items-start gap-3">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground">
                          {team.name}
                        </h3>
                        <ul
                          className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {(playersByTeamId[team.id] ?? []).map((p) => (
                            <li
                              key={p.id}
                              className="flex items-center gap-1.5"
                            >
                              {editingPlayerId === p.id ? (
                                <form
                                  onSubmit={(e) =>
                                    handleUpdatePlayer(e, p.id, team.id)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <input
                                    value={editingPlayerName}
                                    onChange={(e) =>
                                      setEditingPlayerName(e.target.value)
                                    }
                                    className="w-32 rounded border border-input bg-background px-1.5 py-0.5 text-sm"
                                    autoFocus
                                  />
                                  <button
                                    type="submit"
                                    disabled={loading}
                                    className="text-primary text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPlayerId(null);
                                      setEditingPlayerName("");
                                    }}
                                    className="text-xs"
                                  >
                                    Cancel
                                  </button>
                                </form>
                              ) : (
                                <>
                                  {p.avatarUrl ? (
                                    <img
                                      src={p.avatarUrl}
                                      alt=""
                                      className="h-5 w-5 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="h-5 w-5 rounded-full bg-muted inline-block" />
                                  )}
                                  <span>{p.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPlayerId(p.id);
                                      setEditingPlayerName(p.name);
                                    }}
                                    className="rounded p-0.5 text-muted-foreground hover:bg-accent"
                                    aria-label="Edit member"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeletePlayer(p.id, team.id)
                                    }
                                    className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                                    aria-label="Remove member"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                        {addingPlayerTeamId === team.id ? (
                          <form
                            onSubmit={(e) => handleAddPlayer(e, team.id)}
                            className="mt-2 flex items-center gap-2"
                          >
                            <input
                              value={playerName}
                              onChange={(e) => setPlayerName(e.target.value)}
                              placeholder="Member name"
                              className="rounded border border-input bg-background px-2 py-1 text-sm w-40"
                            />
                            <button
                              type="submit"
                              disabled={loading}
                              className="text-sm text-primary"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAddingPlayerTeamId(null);
                                setPlayerName("");
                              }}
                              className="text-sm"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingPlayerTeamId(team.id);
                            }}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <UserPlus className="h-3.5 w-3.5" /> Add member
                          </button>
                        )}
                      </div>
                    </div>
                    <div
                      className="flex flex-col gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => startEdit(team)}
                        className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Edit team"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(team.id)}
                        className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      {teams.length === 0 && !showForm && (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No teams yet. Click &quot;Add team&quot; to create one.
        </p>
      )}

      <TeamDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        mode={detailModalTeam ? "edit" : "create"}
        tournamentId={tournamentId}
        team={detailModalTeam}
        initialPlayers={
          detailModalTeam ? (playersByTeamId[detailModalTeam.id] ?? []) : []
        }
        onSaved={refetchTeamsAndPlayers}
        onDeleted={refetchTeamsAndPlayers}
      />
    </div>
  );
}
