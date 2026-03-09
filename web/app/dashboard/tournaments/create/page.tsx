"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoUpload } from "@/components/ui/LogoUpload";

export default function CreateTournamentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sport, setSport] = useState("Football");
  const [participants, setParticipants] = useState(8);
  const [format, setFormat] = useState("single");
  const [stageFormat, setStageFormat] = useState("knockout");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tournamentName = name.trim() || `Tournament ${Date.now()}`;
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/tournaments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tournamentName,
        sport,
        participantCount: participants,
        format: format === "single" ? "single_elimination" : "multistage",
        firstStageFormat:
          format === "multistage" ? "round_robin_groups" : undefined,
        secondStageFormat: stageFormat === "knockout" ? "knockout" : undefined,
        logoUrl: logoUrl || null,
      }),
    });
    if (res.ok) {
      const t = await res.json();
      router.push(`/tournament/${t.slug}`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Your Tournament</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium">Tournament name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Cup 2025"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <LogoUpload
          value={logoUrl}
          onChange={setLogoUrl}
          label="Tournament logo"
        />
        <div>
          <label className="text-sm font-medium">Sport *</label>
          <input
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Number of Participants *
          </label>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setParticipants((p) => Math.max(2, p - 1))}
              className="rounded border px-2 py-1"
            >
              −
            </button>
            <input
              type="number"
              min={2}
              max={64}
              value={participants}
              onChange={(e) =>
                setParticipants(parseInt(e.target.value, 10) || 8)
              }
              className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm text-center"
            />
            <button
              type="button"
              onClick={() => setParticipants((p) => Math.min(64, p + 1))}
              className="rounded border px-2 py-1"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Format *</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                checked={format === "single"}
                onChange={() => setFormat("single")}
              />
              Single stage
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                checked={format === "multistage"}
                onChange={() => setFormat("multistage")}
              />
              Multistage
            </label>
          </div>
          <select
            value={stageFormat}
            onChange={(e) => setStageFormat(e.target.value)}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="knockout">Knockout Bracket</option>
            <option value="round_robin_groups">Round-Robin Groups</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Create Your Tournament
        </button>
      </form>
    </div>
  );
}
