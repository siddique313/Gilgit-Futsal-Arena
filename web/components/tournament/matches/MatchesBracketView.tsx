"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { List, Pencil, Trash2, ChevronDown, Plus } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type Match = {
  id: string;
  round?: number | null;
  roundLabel?: string | null;
  homePlaceholder?: string | null;
  awayPlaceholder?: string | null;
  homeTeam?: { name: string };
  awayTeam?: { name: string };
  homeScore?: number | null;
  awayScore?: number | null;
  scheduledAt?: string | null;
  venue?: string | null;
};

const ROUND_NAMES: Record<number, string> = {
  1: "Quarterfinals",
  2: "Semifinals",
  3: "Final",
};

function roundName(round: number) {
  return ROUND_NAMES[round] ?? `Round ${round}`;
}

function exportMatchesToCsv(matches: Match[]) {
  const headers = [
    "Round",
    "Round Label",
    "Home",
    "Away",
    "Home Score",
    "Away Score",
    "Date",
    "Venue",
  ];
  const rows = matches.map((m) => {
    const home = m.homeTeam?.name ?? m.homePlaceholder ?? "TBD";
    const away = m.awayTeam?.name ?? m.awayPlaceholder ?? "TBD";
    const date = m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : "";
    return [
      m.round ?? "",
      m.roundLabel ?? "",
      home,
      away,
      m.homeScore ?? "",
      m.awayScore ?? "",
      date,
      m.venue ?? "",
    ];
  });
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
  a.download = "matches.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function MatchesBracketView({
  tournamentId,
  tournamentName,
  initialMatches,
}: {
  tournamentId: string;
  tournamentName: string;
  initialMatches: Match[];
}) {
  const router = useRouter();
  const [matches, setMatches] = useState(initialMatches);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dropdownId, setDropdownId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    roundLabel: "",
    round: 1,
    homePlaceholder: "",
    awayPlaceholder: "",
    homeScore: "",
    awayScore: "",
    scheduledAt: "",
    venue: "",
  });
  const [loading, setLoading] = useState(false);

  const byRound = matches.reduce<Record<number, Match[]>>((acc, m) => {
    const r = m.round ?? 0;
    if (!acc[r]) acc[r] = [];
    acc[r].push(m);
    return acc;
  }, {});
  const rounds = Object.keys(byRound)
    .map(Number)
    .sort((a, b) => a - b);

  async function handleDelete(id: string) {
    if (!confirm("Delete this match?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/matches/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMatches((prev) => prev.filter((m) => m.id !== id));
        setDropdownId(null);
        setEditingId(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(m: Match) {
    setEditingId(m.id);
    setForm({
      roundLabel: m.roundLabel ?? "",
      round: m.round ?? 1,
      homePlaceholder: m.homePlaceholder ?? m.homeTeam?.name ?? "",
      awayPlaceholder: m.awayPlaceholder ?? m.awayTeam?.name ?? "",
      homeScore: m.homeScore != null ? String(m.homeScore) : "",
      awayScore: m.awayScore != null ? String(m.awayScore) : "",
      scheduledAt: m.scheduledAt
        ? new Date(m.scheduledAt).toISOString().slice(0, 16)
        : "",
      venue: m.venue ?? "",
    });
    setDropdownId(null);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/matches/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundLabel: form.roundLabel.trim() || null,
          round: form.round,
          homePlaceholder: form.homePlaceholder.trim() || null,
          awayPlaceholder: form.awayPlaceholder.trim() || null,
          homeScore:
            form.homeScore === "" ? null : parseInt(form.homeScore, 10),
          awayScore:
            form.awayScore === "" ? null : parseInt(form.awayScore, 10),
          scheduledAt: form.scheduledAt || null,
          venue: form.venue.trim() || null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMatches((prev) =>
          prev.map((m) => (m.id === editingId ? updated : m)),
        );
        setEditingId(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/tournaments/${tournamentId}/matches`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roundLabel: form.roundLabel.trim() || undefined,
            round: form.round,
            homePlaceholder: form.homePlaceholder.trim() || undefined,
            awayPlaceholder: form.awayPlaceholder.trim() || undefined,
            homeScore:
              form.homeScore === "" ? undefined : parseInt(form.homeScore, 10),
            awayScore:
              form.awayScore === "" ? undefined : parseInt(form.awayScore, 10),
            scheduledAt: form.scheduledAt || undefined,
            venue: form.venue.trim() || undefined,
            status: "scheduled",
          }),
        },
      );
      if (res.ok) {
        const match = await res.json();
        setMatches((prev) => [...prev, match]);
        setShowAdd(false);
        setForm({
          roundLabel: "",
          round: 1,
          homePlaceholder: "",
          awayPlaceholder: "",
          homeScore: "",
          awayScore: "",
          scheduledAt: "",
          venue: "",
        });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Matches title + Default view / CSV */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Matches</h1>
          <List className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            Default view
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCsvOpen((o) => !o)}
              className="flex items-center gap-2 rounded border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
            >
              CSV
              <ChevronDown className="h-4 w-4" />
            </button>
            {csvOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-label="Close"
                  onClick={() => setCsvOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded border bg-card py-1 shadow-lg">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => {
                      exportMatchesToCsv(matches);
                      setCsvOpen(false);
                    }}
                  >
                    Export matches to CSV
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {tournamentName} — group and knockout matches. Create, edit, and delete
        matches.
      </p>

      {/* Add match */}
      {showAdd && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          <h3 className="font-medium">New match</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={form.roundLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, roundLabel: e.target.value }))
              }
              placeholder="Round label (e.g. Match K1R1M1)"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              value={form.round}
              onChange={(e) =>
                setForm((f) => ({ ...f, round: parseInt(e.target.value, 10) }))
              }
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value={1}>Quarterfinals</option>
              <option value={2}>Semifinals</option>
              <option value={3}>Final</option>
            </select>
            <input
              value={form.homePlaceholder}
              onChange={(e) =>
                setForm((f) => ({ ...f, homePlaceholder: e.target.value }))
              }
              placeholder="Home (team or placeholder)"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.awayPlaceholder}
              onChange={(e) =>
                setForm((f) => ({ ...f, awayPlaceholder: e.target.value }))
              }
              placeholder="Away (team or placeholder)"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.homeScore}
              onChange={(e) =>
                setForm((f) => ({ ...f, homeScore: e.target.value }))
              }
              placeholder="Home score"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={0}
              value={form.awayScore}
              onChange={(e) =>
                setForm((f) => ({ ...f, awayScore: e.target.value }))
              }
              placeholder="Away score"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, scheduledAt: e.target.value }))
              }
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.venue}
              onChange={(e) =>
                setForm((f) => ({ ...f, venue: e.target.value }))
              }
              placeholder="Venue"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
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
              onClick={() => setShowAdd(false)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Bracket by rounds */}
      {rounds.map((round) => (
        <section key={round}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-semibold">{roundName(round)}</h2>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={`Edit ${roundName(round)}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {byRound[round].map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-primary/30 bg-card overflow-hidden"
              >
                <div className="bg-primary/80 px-3 py-2 text-sm font-medium text-primary-foreground">
                  {match.roundLabel ?? `Match`}
                </div>
                {editingId === match.id ? (
                  <form onSubmit={handleUpdate} className="p-3 space-y-2">
                    <input
                      value={form.roundLabel}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, roundLabel: e.target.value }))
                      }
                      placeholder="Round label"
                      className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                    <input
                      value={form.homePlaceholder}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          homePlaceholder: e.target.value,
                        }))
                      }
                      placeholder="Home"
                      className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                    <input
                      value={form.awayPlaceholder}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          awayPlaceholder: e.target.value,
                        }))
                      }
                      placeholder="Away"
                      className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        value={form.homeScore}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, homeScore: e.target.value }))
                        }
                        className="w-14 rounded border border-input bg-background px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        value={form.awayScore}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, awayScore: e.target.value }))
                        }
                        className="w-14 rounded border border-input bg-background px-2 py-1 text-sm"
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
                        onClick={() => setEditingId(null)}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-1">
                      <span className="min-w-0 truncate font-medium">
                        {match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"}
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => startEdit(match)}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Edit match"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setDropdownId(
                                dropdownId === match.id ? null : match.id,
                              )
                            }
                            className="rounded p-1 text-muted-foreground hover:bg-accent"
                            aria-label="Actions"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          {dropdownId === match.id && (
                            <>
                              <button
                                type="button"
                                className="fixed inset-0 z-10"
                                aria-label="Close"
                                onClick={() => setDropdownId(null)}
                              />
                              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded border bg-card py-1 shadow-lg">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                                  onClick={() => startEdit(match)}
                                >
                                  <Pencil className="h-3 w-3" /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(match.id)}
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-1 text-center">
                      <span className="font-semibold text-primary">
                        {match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"}{" "}
                        {match.homeScore ?? "–"} vs{" "}
                        {match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"}{" "}
                        {match.awayScore ?? "–"}
                      </span>
                    </div>
                    {match.homeScore != null && match.awayScore != null && (
                      <p className="text-center text-xs text-muted-foreground">
                        {match.homeScore > match.awayScore
                          ? `${match.homeTeam?.name ?? match.homePlaceholder ?? "Home"} wins`
                          : match.awayScore > match.homeScore
                            ? `${match.awayTeam?.name ?? match.awayPlaceholder ?? "Away"} wins`
                            : "Draw"}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-1">
                      <span className="min-w-0 truncate font-medium">
                        {match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"}
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => startEdit(match)}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Edit match"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDropdownId(
                              dropdownId === match.id ? null : match.id,
                            )
                          }
                          className="rounded p-1 text-muted-foreground hover:bg-accent"
                          aria-label="Actions"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {matches.length === 0 && !showAdd && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No matches yet.
        </div>
      )}

      {!showAdd && (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add match
        </button>
      )}
    </div>
  );
}
