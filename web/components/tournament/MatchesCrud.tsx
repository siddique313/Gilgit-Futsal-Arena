"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MatchCard } from "@/components/tournament/MatchCard";
import { Pencil, Trash2, Plus } from "lucide-react";

type Match = {
  id: string;
  homePlaceholder?: string | null;
  awayPlaceholder?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  scheduledAt?: string | null;
  roundLabel?: string | null;
  venue?: string | null;
  referee?: string | null;
};

export function MatchesCrud({
  tournamentId,
  initialMatches,
}: {
  tournamentId: string;
  initialMatches: Match[];
}) {
  const router = useRouter();
  const [matches, setMatches] = useState(initialMatches);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [homePlaceholder, setHomePlaceholder] = useState("");
  const [awayPlaceholder, setAwayPlaceholder] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [roundLabel, setRoundLabel] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const base = process.env.NEXT_PUBLIC_API_URL || "";

  function resetForm() {
    setHomePlaceholder("");
    setAwayPlaceholder("");
    setHomeScore("");
    setAwayScore("");
    setRoundLabel("");
    setScheduledAt("");
    setVenue("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${base}/tournaments/${tournamentId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homePlaceholder: homePlaceholder.trim() || undefined,
          awayPlaceholder: awayPlaceholder.trim() || undefined,
          homeScore: homeScore === "" ? undefined : parseInt(homeScore, 10),
          awayScore: awayScore === "" ? undefined : parseInt(awayScore, 10),
          roundLabel: roundLabel.trim() || undefined,
          scheduledAt: scheduledAt || undefined,
          venue: venue.trim() || undefined,
          status: "scheduled",
        }),
      });
      if (res.ok) {
        const match = await res.json();
        setMatches((prev) => [...prev, match]);
        resetForm();
        setShowForm(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${base}/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homePlaceholder: homePlaceholder.trim() || null,
          awayPlaceholder: awayPlaceholder.trim() || null,
          homeScore: homeScore === "" ? null : parseInt(homeScore, 10),
          awayScore: awayScore === "" ? null : parseInt(awayScore, 10),
          roundLabel: roundLabel.trim() || null,
          scheduledAt: scheduledAt || null,
          venue: venue.trim() || null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMatches((prev) => prev.map((m) => (m.id === id ? updated : m)));
        setEditingId(null);
        resetForm();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this match?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/matches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMatches((prev) => prev.filter((m) => m.id !== id));
        if (editingId === id) setEditingId(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(m: Match) {
    setEditingId(m.id);
    setHomePlaceholder(m.homePlaceholder ?? "");
    setAwayPlaceholder(m.awayPlaceholder ?? "");
    setHomeScore(m.homeScore != null ? String(m.homeScore) : "");
    setAwayScore(m.awayScore != null ? String(m.awayScore) : "");
    setRoundLabel(m.roundLabel ?? "");
    setScheduledAt(
      m.scheduledAt ? new Date(m.scheduledAt).toISOString().slice(0, 16) : "",
    );
    setVenue(m.venue ?? "");
  }

  const formFields = (
    <>
      <input
        value={homePlaceholder}
        onChange={(e) => setHomePlaceholder(e.target.value)}
        placeholder="Home (team or placeholder)"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        value={awayPlaceholder}
        onChange={(e) => setAwayPlaceholder(e.target.value)}
        placeholder="Away (team or placeholder)"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min={0}
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          placeholder="Home score"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={0}
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          placeholder="Away score"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <input
        value={roundLabel}
        onChange={(e) => setRoundLabel(e.target.value)}
        placeholder="Round label (e.g. Quarterfinal 1)"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        placeholder="Venue"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {matches.length} match(es)
        </span>
        {!showForm && !editingId && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add match
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          <h3 className="font-medium">New match</h3>
          <div className="grid gap-2 sm:grid-cols-2">{formFields}</div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              {loading ? "Saving…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {matches.map((match) =>
          editingId === match.id ? (
            <form
              key={match.id}
              onSubmit={(e) => handleUpdate(e, match.id)}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <h3 className="font-medium">Edit match</h3>
              <div className="grid gap-2 sm:grid-cols-2">{formFields}</div>
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
                    resetForm();
                  }}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div key={match.id} className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <MatchCard match={match} />
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => startEdit(match)}
                  className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(match.id)}
                  className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {matches.length === 0 && !showForm && (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No matches yet. Click &quot;Add match&quot; to create one.
        </p>
      )}
    </div>
  );
}
