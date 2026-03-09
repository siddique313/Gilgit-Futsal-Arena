"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  CircleDot,
  Hand,
  RectangleHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatEntryModal } from "./StatEntryModal";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

export type StatEntry = {
  id: string;
  playerId: string;
  name: string;
  teamName: string;
  teamId: string;
  avatarUrl: string | null;
  count: number;
  status: string;
};

export type TournamentStats = {
  goals: StatEntry[];
  assists: StatEntry[];
  yellowCards: StatEntry[];
  mvp: StatEntry[];
};

function exportStatsToCsv(
  stats: TournamentStats,
  tournamentName: string,
  filename?: string,
) {
  const name = (tournamentName || "stats").replace(/[^a-z0-9]/gi, "_");
  const out = filename ?? `${name}_stats.csv`;
  const sections = [
    { title: "Most Goals", key: "goals" as const, rows: stats.goals },
    { title: "Most Assists", key: "assists" as const, rows: stats.assists },
    {
      title: "Most Yellow Cards",
      key: "yellowCards" as const,
      rows: stats.yellowCards,
    },
    { title: "Most MVP", key: "mvp" as const, rows: stats.mvp },
  ];
  const headers = ["Section", "Player", "Team", "Count", "Status"];
  const rows: string[][] = [];
  for (const s of sections) {
    for (const r of s.rows) {
      rows.push([s.title, r.name, r.teamName, String(r.count), r.status]);
    }
  }
  const csv = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((r) =>
      r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = out;
  a.click();
  URL.revokeObjectURL(url);
}

function StatCard({
  title,
  icon: Icon,
  entries,
  emptyLabel,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  entries: StatEntry[];
  emptyLabel: string;
  onEdit?: (entry: StatEntry) => void;
  onDelete?: (entry: StatEntry) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="flex items-center gap-2 font-medium text-primary">
        <Icon className="h-5 w-5" />
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {entries.length === 0 ? (
          <li className="text-sm text-muted-foreground">{emptyLabel}</li>
        ) : (
          entries.slice(0, 10).map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                  {p.avatarUrl ? (
                    <Image
                      src={p.avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                      {(p.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{p.name}</span>
                  {p.teamName && (
                    <span className="ml-1 text-muted-foreground">
                      ({p.teamName})
                    </span>
                  )}
                </div>
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs capitalize">
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold tabular-nums">{p.count}</span>
                {(onEdit || onDelete) && (
                  <span className="flex items-center gap-0.5">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(p)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

interface StatsViewProps {
  tournamentId: string;
  tournamentName: string;
  initialStats: TournamentStats;
}

export function StatsView({
  tournamentId,
  tournamentName,
  initialStats,
}: StatsViewProps) {
  const [stats, setStats] = useState<TournamentStats>(initialStats);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<StatEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  const handleCreate = () => {
    setEditingEntry(null);
    setEntryModalOpen(true);
  };

  const handleEdit = (entry: StatEntry) => {
    setEditingEntry(entry);
    setEntryModalOpen(true);
  };

  const handleDelete = async (entry: StatEntry) => {
    if (!confirm("Remove this stat entry?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/tournaments/${tournamentId}/stats/entries/${entry.id}`,
        { method: "DELETE" },
      );
      if (res.ok) await refetch();
    } catch {
      //
    }
  };

  const handleSaved = () => {
    setEntryModalOpen(false);
    setEditingEntry(null);
    refetch();
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-primary">Stats</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportStatsToCsv(stats, tournamentName)}
            className="inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={handleCreate}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <StatCard
          title="Most Goals"
          icon={CircleDot}
          entries={stats.goals}
          emptyLabel="No data yet."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <StatCard
          title="Most Assist"
          icon={Hand}
          entries={stats.assists}
          emptyLabel="No data yet."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <StatCard
          title="Most Yellow Cards"
          icon={RectangleHorizontal}
          entries={stats.yellowCards}
          emptyLabel="No data yet."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <StatCard
          title="Most MVP"
          icon={Star}
          entries={stats.mvp}
          emptyLabel="No data yet."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Updating…</p>}

      <StatEntryModal
        open={entryModalOpen}
        onOpenChange={(open) => {
          setEntryModalOpen(open);
          if (!open) setEditingEntry(null);
        }}
        tournamentId={tournamentId}
        entry={editingEntry}
        onSaved={handleSaved}
      />
    </div>
  );
}
