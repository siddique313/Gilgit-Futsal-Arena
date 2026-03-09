"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Pencil } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type Props = {
  tournamentId: string;
  name: string;
};

export function EditableTitle({ tournamentId, name }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (value.trim() === name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value.trim() }),
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
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded border border-input bg-background px-2 py-1 text-xl font-semibold text-primary sm:text-2xl"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(name);
            setEditing(false);
          }}
          className="rounded border border-input px-3 py-1 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Trophy className="h-6 w-6 shrink-0 text-primary sm:h-7 sm:w-7" />
      <h1 className="text-xl font-semibold text-primary sm:text-2xl">{name}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Edit title"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
