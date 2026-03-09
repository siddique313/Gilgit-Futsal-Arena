"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { LogoUpload } from "@/components/ui/LogoUpload";
import { Pencil, Trash2, UserPlus, Loader2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

export type PlayerRow = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
};

export type TeamRow = {
  id: string;
  name: string;
  logoUrl?: string | null;
  groupLabel?: string | null;
};

type TeamDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  tournamentId: string;
  team: TeamRow | null;
  initialPlayers?: PlayerRow[];
  onSaved?: () => void;
  onDeleted?: () => void;
};

export function TeamDetailModal({
  open,
  onOpenChange,
  mode,
  tournamentId,
  team,
  initialPlayers = [],
  onSaved,
  onDeleted,
}: TeamDetailModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>(initialPlayers);
  const [loading, setLoading] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  const [editingPlayerAvatar, setEditingPlayerAvatar] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open && team) {
      setName(team.name);
      setGroupLabel(team.groupLabel ?? "");
      setLogoUrl(team.logoUrl ?? null);
      setPlayers(initialPlayers);
    } else if (open && mode === "create") {
      setName("");
      setGroupLabel("");
      setLogoUrl(null);
      setPlayers([]);
    }
  }, [open, team, mode, initialPlayers]);

  async function loadPlayers(teamId: string) {
    try {
      const res = await fetch(`${API_BASE}/teams/${teamId}/players`);
      if (res.ok) {
        const list = await res.json();
        setPlayers(list);
        return list;
      }
    } catch {
      //
    }
    return players;
  }

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (mode === "create") {
        const res = await fetch(
          `${API_BASE}/tournaments/${tournamentId}/teams`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              groupLabel: groupLabel.trim() || undefined,
              logoUrl: logoUrl || undefined,
            }),
          },
        );
        if (res.ok) {
          onOpenChange(false);
          onSaved?.();
          router.refresh();
        }
      } else if (team) {
        const res = await fetch(`${API_BASE}/teams/${team.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            groupLabel: groupLabel.trim() || null,
            logoUrl: logoUrl ?? undefined,
          }),
        });
        if (res.ok) {
          onOpenChange(false);
          onSaved?.();
          router.refresh();
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTeam() {
    if (!team || !confirm("Delete this team? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/teams/${team.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onOpenChange(false);
        onDeleted?.();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!playerName.trim() || !team) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, name: playerName.trim() }),
      });
      if (res.ok) {
        setPlayerName("");
        setAddingPlayer(false);
        await loadPlayers(team.id);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePlayer(e: React.FormEvent, playerId: string) {
    e.preventDefault();
    if (!editingPlayerName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingPlayerName.trim(),
          avatarUrl: editingPlayerAvatar ?? undefined,
        }),
      });
      if (res.ok) {
        setEditingPlayerId(null);
        setEditingPlayerName("");
        setEditingPlayerAvatar(null);
        if (team) await loadPlayers(team.id);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlayer(playerId: string) {
    if (!confirm("Remove this player?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/players/${playerId}`, {
        method: "DELETE",
      });
      if (res.ok && team) {
        setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "create" ? "New Team" : `Team: ${team?.name ?? ""}`;

  const footer = (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
      >
        Cancel
      </button>
      {mode === "edit" && team && (
        <button
          type="button"
          onClick={handleDeleteTeam}
          disabled={loading}
          className="rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
        >
          Delete team
        </button>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !name.trim()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {mode === "create" ? "Create" : "Update"}
      </button>
    </>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={footer}
      description={
        mode === "create"
          ? "Create a new team with logo and players"
          : "Edit team and players"
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">
            Team name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">
            Group (optional)
          </label>
          <input
            value={groupLabel}
            onChange={(e) => setGroupLabel(e.target.value)}
            placeholder="e.g. Group A"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <LogoUpload
            value={logoUrl}
            onChange={setLogoUrl}
            label="Team logo"
            accept="image/jpeg,image/png,image/gif,image/webp"
          />
        </div>

        {mode === "edit" && team && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Players
            </h3>
            <ul className="space-y-3">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-2"
                >
                  {editingPlayerId === p.id ? (
                    <form
                      onSubmit={(e) => handleUpdatePlayer(e, p.id)}
                      className="flex flex-1 flex-wrap items-center gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <LogoUpload
                          value={editingPlayerAvatar ?? p.avatarUrl ?? null}
                          onChange={setEditingPlayerAvatar}
                          label=""
                          accept="image/jpeg,image/png,image/gif,image/webp"
                        />
                        <input
                          value={editingPlayerName}
                          onChange={(e) => setEditingPlayerName(e.target.value)}
                          className="flex-1 min-w-0 rounded border border-input bg-background px-2 py-1 text-sm"
                          placeholder="Player name"
                        />
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlayerId(null);
                            setEditingPlayerName("");
                            setEditingPlayerAvatar(null);
                          }}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {p.avatarUrl ? (
                        <img
                          src={p.avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover border border-input"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-sm">{p.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPlayerId(p.id);
                          setEditingPlayerName(p.name);
                          setEditingPlayerAvatar(p.avatarUrl ?? null);
                        }}
                        className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Edit player"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlayer(p.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove player"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {addingPlayer ? (
              <form
                onSubmit={handleAddPlayer}
                className="mt-2 flex flex-wrap items-center gap-2"
              >
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="rounded border border-input bg-background px-2 py-1.5 text-sm w-40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingPlayer(false);
                    setPlayerName("");
                  }}
                  className="rounded border px-3 py-1.5 text-sm"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingPlayer(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <UserPlus className="h-4 w-4" /> Add player
              </button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
