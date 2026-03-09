"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Lock, Code, Trash2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type AdvancedSettingsData = {
  matchTimezone?: string;
  participantsType?: string;
  playerStatistics?: string;
  searchVisibility?: string;
  brandColor?: string;
};

const defaultAdvanced: AdvancedSettingsData = {
  matchTimezone: "Asia/Karachi",
  participantsType: "Teams with player lists",
  playerStatistics: "Enabled",
  searchVisibility: "Can be found in Score7 and on Google",
  brandColor: "default",
};

type Props = {
  tournamentId: string;
  slug: string;
  settings: Record<string, unknown> | null;
};

function SettingRow({
  label,
  value,
  locked,
  onEdit,
}: {
  label: string;
  value: string;
  locked?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {locked ? (
          <span
            className="rounded p-1.5 text-amber-600 bg-amber-500/10"
            title="Locked"
          >
            <Lock className="h-4 w-4" />
          </span>
        ) : onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground mb-2 mt-4 first:mt-0">
      {children}
    </h3>
  );
}

export function AdvancedSettings({ tournamentId, slug, settings }: Props) {
  const router = useRouter();
  const current = { ...defaultAdvanced, ...(settings as AdvancedSettingsData) };
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteTournament() {
    if (
      !confirm(
        "Are you sure you want to delete this tournament? This cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.score7.io");
  const tournamentUrl = `${baseUrl}/tournament/${slug}`;

  async function handleSaveField(key: string, value: string) {
    setSaving(true);
    try {
      const newSettings = {
        ...(settings as Record<string, unknown>),
        [key]: value,
      };
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      });
      if (res.ok) {
        setEditField(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const openEdit = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
  };

  return (
    <>
      <section>
        <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
          <h2 className="text-xl font-semibold">Advanced Settings</h2>
        </div>

        <div className="mt-6 space-y-6">
          {/* Appearance */}
          <div>
            <SectionTitle>Appearance</SectionTitle>
            <div className="rounded-lg border bg-card p-4 space-y-0">
              <SettingRow label="Tournament URL" value={tournamentUrl} locked />
              <div className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Brand color
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {current.brandColor === "default"
                        ? "Default color"
                        : current.brandColor}
                    </p>
                  </div>
                  <span
                    className="inline-block h-5 w-5 rounded border border-border shrink-0 bg-primary"
                    aria-hidden
                  />
                </div>
                <span
                  className="rounded p-1.5 text-amber-600 bg-amber-500/10"
                  title="Locked"
                >
                  <Lock className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div>
            <SectionTitle>Behavior</SectionTitle>
            <div className="rounded-lg border bg-card p-4 space-y-0">
              {editField === "matchTimezone" ? (
                <div className="flex items-center gap-2 py-2 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Match time zone
                  </span>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField("matchTimezone", editValue)}
                    disabled={saving}
                    className="rounded bg-primary px-2 py-1.5 text-sm text-primary-foreground"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditField(null)}
                    className="rounded border px-2 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <SettingRow
                  label="Match time zone"
                  value={
                    current.matchTimezone ?? defaultAdvanced.matchTimezone!
                  }
                  onEdit={() =>
                    openEdit(
                      "matchTimezone",
                      current.matchTimezone ?? defaultAdvanced.matchTimezone!,
                    )
                  }
                />
              )}
              {editField === "participantsType" ? (
                <div className="flex items-center gap-2 py-2 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Participants type
                  </span>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveField("participantsType", editValue)
                    }
                    disabled={saving}
                    className="rounded bg-primary px-2 py-1.5 text-sm text-primary-foreground"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditField(null)}
                    className="rounded border px-2 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <SettingRow
                  label="Participants type"
                  value={
                    current.participantsType ??
                    defaultAdvanced.participantsType!
                  }
                  onEdit={() =>
                    openEdit(
                      "participantsType",
                      current.participantsType ??
                        defaultAdvanced.participantsType!,
                    )
                  }
                />
              )}
              {editField === "playerStatistics" ? (
                <div className="flex items-center gap-2 py-2 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Player statistics
                  </span>
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="rounded border border-input bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveField("playerStatistics", editValue)
                    }
                    disabled={saving}
                    className="rounded bg-primary px-2 py-1.5 text-sm text-primary-foreground"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditField(null)}
                    className="rounded border px-2 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <SettingRow
                  label="Player statistics"
                  value={
                    current.playerStatistics ??
                    defaultAdvanced.playerStatistics!
                  }
                  onEdit={() =>
                    openEdit(
                      "playerStatistics",
                      current.playerStatistics ??
                        defaultAdvanced.playerStatistics!,
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <SectionTitle>Visibility</SectionTitle>
            <div className="rounded-lg border bg-card p-4 space-y-0">
              {editField === "searchVisibility" ? (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Search visibility
                  </span>
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="rounded border border-input bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="Can be found in Score7 and on Google">
                      Can be found in Score7 and on Google
                    </option>
                    <option value="Only in Score7">Only in Score7</option>
                    <option value="Not searchable">Not searchable</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveField("searchVisibility", editValue)
                    }
                    disabled={saving}
                    className="rounded bg-primary px-2 py-1.5 text-sm text-primary-foreground"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditField(null)}
                    className="rounded border px-2 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <SettingRow
                  label="Search visibility"
                  value={
                    current.searchVisibility ??
                    defaultAdvanced.searchVisibility!
                  }
                  onEdit={() =>
                    openEdit(
                      "searchVisibility",
                      current.searchVisibility ??
                        defaultAdvanced.searchVisibility!,
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Embed Tournament */}
          <div>
            <SectionTitle>Embed Tournament</SectionTitle>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmbed(!showEmbed)}
                  className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <Code className="h-4 w-4" />
                  {showEmbed ? "Hide embed code" : "Show embed code"}
                </button>
                <span
                  className="rounded p-1.5 text-amber-600 bg-amber-500/10"
                  title="Locked"
                >
                  <Lock className="h-4 w-4" />
                </span>
              </div>
              {showEmbed && (
                <pre className="mt-3 rounded bg-muted p-3 text-xs overflow-x-auto">
                  {`<iframe src="${tournamentUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                </pre>
              )}
            </div>
          </div>

          {/* Delete tournament */}
          <div className="pt-6 border-t">
            <SectionTitle>Danger zone</SectionTitle>
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete this tournament and all its data.
              </p>
              <button
                type="button"
                onClick={handleDeleteTournament}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting…" : "Delete tournament"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
