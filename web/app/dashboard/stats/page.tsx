import Link from "next/link";
import { BarChart3 } from "lucide-react";

async function getTournaments() {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const res = await fetch(`${base}/tournaments`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function StatsPage() {
  const tournaments = await getTournaments();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Stats</h1>
      <p className="mt-1 text-muted-foreground">
        View player and team statistics per tournament.
      </p>
      <div className="mt-6">
        {tournaments.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No tournaments yet.</p>
            <Link
              href="/dashboard/tournaments/create"
              className="mt-2 inline-block text-primary hover:underline"
            >
              Create a tournament
            </Link>{" "}
            to see stats.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map(
              (t: { id: string; slug: string; name: string }) => (
                <Link
                  key={t.id}
                  href={`/tournament/${t.slug}/stats`}
                  className="rounded-lg border bg-card p-4 shadow-sm hover:bg-accent/50"
                >
                  <span className="font-medium">{t.name}</span>
                  <p className="text-sm text-muted-foreground">View stats →</p>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
