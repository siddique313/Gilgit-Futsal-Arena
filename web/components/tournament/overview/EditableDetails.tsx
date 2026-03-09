"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewSection } from "./OverviewSection";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type Props = {
  tournamentId: string;
  sport: string;
  description: string | null;
};

export function EditableDetails({ tournamentId, sport, description }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [sportVal, setSportVal] = useState(sport);
  const [descVal, setDescVal] = useState(description ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: sportVal.trim() || sport,
          description: descVal.trim() || null,
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
          <h2 className="font-semibold">Details</h2>
        </div>
        <div className="mt-3 space-y-3 pl-3">
          <div>
            <label className="text-xs text-muted-foreground">Sport</label>
            <input
              value={sportVal}
              onChange={(e) => setSportVal(e.target.value)}
              className="mt-1 w-full max-w-xs rounded border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
              placeholder="Add a description"
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
              onClick={() => {
                setSportVal(sport);
                setDescVal(description ?? "");
                setEditing(false);
              }}
              className="rounded border border-input px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <OverviewSection title="Details" onEdit={() => setEditing(true)}>
      <dl className="space-y-1">
        <div>
          <span className="font-medium text-foreground">Sport:</span> {sport}
        </div>
        <div>
          <span className="font-medium text-foreground">Description:</span>{" "}
          {description?.trim() || "Add a description"}
        </div>
      </dl>
    </OverviewSection>
  );
}
