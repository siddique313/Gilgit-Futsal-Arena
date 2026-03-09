"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/Dialog";
import type { StatEntry } from "./StatsView";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type StatEntryRow = StatEntry & {
  goals: number;
  assists: number;
  yellowCards: number;
  mvp: number;
};

type PlayerOption = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  avatarUrl: string | null;
};

interface StatEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  entry: StatEntry | null;
  onSaved: () => void;
}

export function StatEntryModal({
  open,
  onOpenChange,
  tournamentId,
  entry,
  onSaved,
}: StatEntryModalProps) {
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [entries, setEntries] = useState<StatEntryRow[]>([]);
  const [playerId, setPlayerId] = useState("");
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [mvp, setMvp] = useState(0);
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!entry?.id;

  useEffect(() => {
    if (!open || !tournamentId) return;
    setLoading(true);
    (async () => {
      try {
        const [teamsRes, entriesRes] = await Promise.all([
          fetch(`${API_BASE}/tournaments/${tournamentId}/teams`),
          fetch(`${API_BASE}/tournaments/${tournamentId}/stats/entries`),
        ]);
        const teams: { id: string; name: string }[] = teamsRes.ok
          ? await teamsRes.json()
          : [];
        const entriesList: StatEntryRow[] = entriesRes.ok
          ? await entriesRes.json()
          : [];
        setEntries(entriesList);

        const options: PlayerOption[] = [];
        for (const t of teams) {
          const res = await fetch(`${API_BASE}/teams/${t.id}/players`);
          if (!res.ok) continue;
          const list: {
            id: string;
            name: string;
            avatarUrl?: string | null;
          }[] = await res.json();
          for (const p of list) {
            options.push({
              id: p.id,
              name: p.name,
              teamId: t.id,
              teamName: t.name,
              avatarUrl: p.avatarUrl ?? null,
            });
          }
        }
        setPlayers(options);

        if (entry?.id) {
          const existing = entriesList.find((e) => e.id === entry.id);
          if (existing) {
            setPlayerId(existing.playerId);
            setGoals(existing.goals ?? 0);
            setAssists(existing.assists ?? 0);
            setYellowCards(existing.yellowCards ?? 0);
            setMvp(existing.mvp ?? 0);
            setStatus(existing.status ?? "active");
          }
        } else {
          setPlayerId("");
          setGoals(0);
          setAssists(0);
          setYellowCards(0);
          setMvp(0);
          setStatus("active");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [open, tournamentId, entry?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && entry?.id) {
      setSaving(true);
      try {
        const res = await fetch(
          `${API_BASE}/tournaments/${tournamentId}/stats/entries/${entry.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              goals,
              assists,
              yellowCards,
              mvp,
              status,
            }),
          },
        );
        if (res.ok) onSaved();
      } finally {
        setSaving(false);
      }
    } else {
      if (!playerId) return;
      setSaving(true);
      try {
        const res = await fetch(
          `${API_BASE}/tournaments/${tournamentId}/stats/entries`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerId,
              goals,
              assists,
              yellowCards,
              mvp,
              status,
            }),
          },
        );
        if (res.ok) onSaved();
      } finally {
        setSaving(false);
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit stat entry" : "Add stat entry"}
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="stat-entry-form" disabled={saving || loading}>
            {saving ? "Saving…" : isEdit ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <form id="stat-entry-form" onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium">Player</label>
              <select
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select player</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.teamName})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Goals</label>
              <input
                type="number"
                min={0}
                value={goals}
                onChange={(e) => setGoals(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Assists</label>
              <input
                type="number"
                min={0}
                value={assists}
                onChange={(e) => setAssists(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Yellow cards
              </label>
              <input
                type="number"
                min={0}
                value={yellowCards}
                onChange={(e) =>
                  setYellowCards(parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">MVP</label>
              <input
                type="number"
                min={0}
                value={mvp}
                onChange={(e) => setMvp(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      )}
    </Dialog>
  );
}
