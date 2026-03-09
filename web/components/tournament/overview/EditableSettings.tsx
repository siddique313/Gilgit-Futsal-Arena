"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewSection } from "./OverviewSection";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type Settings = {
  firstRound?: string;
  numberOfLegs?: number;
  placements?: string;
};

const defaultSettings: Settings = {
  firstRound: "Seeded",
  numberOfLegs: 1,
  placements: "Only 1st/2nd place final",
};

type Props = {
  tournamentId: string;
  settings: Record<string, unknown> | null;
};

export function EditableSettings({ tournamentId, settings }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const current = { ...defaultSettings, ...(settings as Settings) };
  const [firstRound, setFirstRound] = useState(current.firstRound ?? "Seeded");
  const [numberOfLegs, setNumberOfLegs] = useState(
    String(current.numberOfLegs ?? 1),
  );
  const [placements, setPlacements] = useState(
    current.placements ?? "Only 1st/2nd place final",
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            firstRound,
            numberOfLegs: parseInt(numberOfLegs, 10) || 1,
            placements,
          },
        }),
      });
      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <section>
        <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
          <h2 className="font-semibold">Tournament Settings</h2>
        </div>
        <div className="mt-3 space-y-3 pl-3">
          <div>
            <label className="text-xs text-muted-foreground">First Round</label>
            <input
              value={firstRound}
              onChange={(e) => setFirstRound(e.target.value)}
              className="mt-1 w-full max-w-xs rounded border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Number of Legs
            </label>
            <input
              type="number"
              min={1}
              value={numberOfLegs}
              onChange={(e) => setNumberOfLegs(e.target.value)}
              className="mt-1 w-full max-w-xs rounded border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Placements</label>
            <input
              value={placements}
              onChange={(e) => setPlacements(e.target.value)}
              className="mt-1 w-full max-w-xs rounded border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-input px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  const display = { ...defaultSettings, ...(settings as Settings) };
  return (
    <OverviewSection
      title="Tournament Settings"
      onEdit={() => setEditing(true)}
    >
      <dl className="space-y-1">
        <div>
          <span className="font-medium text-foreground underline decoration-muted-foreground">
            First Round:
          </span>{" "}
          {display.firstRound ?? "Seeded"}
        </div>
        <div>
          <span className="font-medium text-foreground underline decoration-muted-foreground">
            Number of Legs:
          </span>{" "}
          {display.numberOfLegs ?? 1}
        </div>
        <div>
          <span className="font-medium text-foreground">Placements:</span>{" "}
          {display.placements ?? "Only 1st/2nd place final"}
        </div>
      </dl>
    </OverviewSection>
  );
}
