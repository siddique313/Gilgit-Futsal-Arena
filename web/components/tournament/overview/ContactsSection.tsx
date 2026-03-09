"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

export type Contact = { id: string; label: string; value: string };

type Props = {
  tournamentId: string;
  contacts: Contact[] | null;
};

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

export function ContactsSection({ tournamentId, contacts }: Props) {
  const router = useRouter();
  const list = contacts ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function patchContacts(next: Contact[]) {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: next }),
      });
      if (res.ok) {
        setAdding(false);
        setEditingId(null);
        setNewLabel("");
        setNewValue("");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    if (!newLabel.trim() || !newValue.trim()) return;
    const next = [
      ...list,
      { id: genId(), label: newLabel.trim(), value: newValue.trim() },
    ];
    patchContacts(next);
  }

  function handleUpdate(id: string) {
    const next = list.map((c) =>
      c.id === id
        ? { ...c, label: editLabel.trim(), value: editValue.trim() }
        : c,
    );
    patchContacts(next);
  }

  function handleDelete(id: string) {
    const next = list.filter((c) => c.id !== id);
    patchContacts(next);
  }

  return (
    <section>
      <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
        <h2 className="font-semibold">Contacts</h2>
      </div>
      <div className="mt-2 pl-3">
        {list.length === 0 && !adding ? (
          <div className="text-sm text-muted-foreground">
            <p>No contacts available.</p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-1 text-primary hover:underline"
            >
              Add contact info so participants can reach you
            </button>
          </div>
        ) : list.length > 0 ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {list.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                {editingId === c.id ? (
                  <>
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Label"
                      className="w-24 rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Value"
                      className="min-w-0 flex-1 rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdate(c.id)}
                      disabled={saving}
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
                  </>
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {c.label}:
                    </span>{" "}
                    {c.value}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditLabel(c.label);
                        setEditValue(c.value);
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Edit contact"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Delete contact"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        {adding && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Email)"
              className="w-28 rounded border border-input bg-background px-2 py-1.5 text-sm"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value"
              className="min-w-0 flex-1 rounded border border-input bg-background px-2 py-1.5 text-sm sm:max-w-xs"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !newLabel.trim() || !newValue.trim()}
              className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setNewLabel("");
                setNewValue("");
              }}
              className="rounded border border-input px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
        {list.length > 0 && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Add contact info so participants can reach you
          </button>
        )}
      </div>
    </section>
  );
}
