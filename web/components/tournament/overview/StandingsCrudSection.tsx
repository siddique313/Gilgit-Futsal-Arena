"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type StandingRow = {
  id: string;
  teamId: string;
  teamName: string;
  groupLabel?: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

type GroupStandings = { groupLabel: string; rows: StandingRow[] };

export function StandingsCrudSection({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupStandings[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInsert, setShowInsert] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    teamId: "",
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  });

  const allRows = groups.flatMap((g) => g.rows);

  function load() {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/tournaments/${tournamentId}/standings`).then((r) =>
        r.ok ? r.json() : [],
      ),
      fetch(`${API_BASE}/tournaments/${tournamentId}/teams`).then((r) =>
        r.ok ? r.json() : [],
      ),
    ])
      .then(([standings, teamsList]) => {
        setGroups(Array.isArray(standings) ? standings : []);
        setTeams(
          (teamsList ?? []).map((t: { id: string; name: string }) => ({
            id: t.id,
            name: t.name,
          })),
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [tournamentId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.teamId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/tournaments/${tournamentId}/standings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: form.teamId,
            played: form.played,
            wins: form.wins,
            draws: form.draws,
            losses: form.losses,
            goalsFor: form.goalsFor,
            goalsAgainst: form.goalsAgainst,
            points: form.points,
          }),
        },
      );
      if (res.ok) {
        setShowInsert(false);
        setForm({
          teamId: "",
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        });
        load();
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.message ?? "Failed to create standing");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent, row: StandingRow) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/standings/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          played: form.played,
          wins: form.wins,
          draws: form.draws,
          losses: form.losses,
          goalsFor: form.goalsFor,
          goalsAgainst: form.goalsAgainst,
          points: form.points,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        load();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(row: StandingRow) {
    if (!confirm(`Delete standing for ${row.teamName}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/standings/${row.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        load();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(row: StandingRow) {
    setEditingId(row.id);
    setForm({
      teamId: row.teamId,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      points: row.points,
    });
  }

  const teamIdsInStandings = new Set(allRows.map((r) => r.teamId));
  const teamsWithoutStanding = teams.filter(
    (t) => !teamIdsInStandings.has(t.id),
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Standings (create, update, delete)
        </h2>
        <button
          type="button"
          onClick={() => setShowInsert(true)}
          disabled={teamsWithoutStanding.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Insert
        </button>
      </div>

      {showInsert && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          <h3 className="font-medium">New standing row</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={form.teamId}
              onChange={(e) =>
                setForm((f) => ({ ...f, teamId: e.target.value }))
              }
              required
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select team</option>
              {teamsWithoutStanding.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={form.played}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  played: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Played"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.wins}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  wins: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Wins"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.draws}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  draws: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Draws"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.losses}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  losses: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Losses"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.goalsFor}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  goalsFor: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Goals for"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.goalsAgainst}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  goalsAgainst: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Goals against"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.points}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  points: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder="Points"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            >
              <Check className="h-4 w-4" /> Create
            </button>
            <button
              type="button"
              onClick={() => setShowInsert(false)}
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left font-medium">Team</th>
              <th className="p-2 text-left font-medium">Group</th>
              <th className="p-2 text-center font-medium">P</th>
              <th className="p-2 text-center font-medium">W</th>
              <th className="p-2 text-center font-medium">D</th>
              <th className="p-2 text-center font-medium">L</th>
              <th className="p-2 text-center font-medium">GF</th>
              <th className="p-2 text-center font-medium">GA</th>
              <th className="p-2 text-center font-medium">PTS</th>
              <th className="p-2 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRows.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={10}
                  className="p-6 text-center text-muted-foreground"
                >
                  No standings. Click Insert to add a row.
                </td>
              </tr>
            )}
            {allRows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30">
                {editingId === row.id ? (
                  <>
                    <td className="p-2 font-medium">{row.teamName}</td>
                    <td className="p-2">{row.groupLabel ?? "–"}</td>
                    <td colSpan={7}>
                      <form
                        onSubmit={(e) => handleUpdate(e, row)}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <input
                          type="number"
                          min={0}
                          value={form.played}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              played: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.wins}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              wins: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.draws}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              draws: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.losses}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              losses: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.goalsFor}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              goalsFor: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.goalsAgainst}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              goalsAgainst: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          value={form.points}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              points: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="w-14 rounded border px-2 py-1 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                    <td className="p-2" />
                  </>
                ) : (
                  <>
                    <td className="p-2 font-medium">{row.teamName}</td>
                    <td className="p-2">{row.groupLabel ?? "–"}</td>
                    <td className="p-2 text-center">{row.played}</td>
                    <td className="p-2 text-center">{row.wins}</td>
                    <td className="p-2 text-center">{row.draws}</td>
                    <td className="p-2 text-center">{row.losses}</td>
                    <td className="p-2 text-center">{row.goalsFor}</td>
                    <td className="p-2 text-center">{row.goalsAgainst}</td>
                    <td className="p-2 text-center font-medium">
                      {row.points}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
