import Link from "next/link";
import { TournamentCard } from "@/components/tournament/TournamentCard";

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

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Tournaments</h1>
        <Link
          href="/dashboard/tournaments/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 w-fit"
        >
          Create Tournament
        </Link>
      </div>
      <p className="mt-1 text-muted-foreground text-sm sm:text-base">
        Create and manage your tournaments.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.length === 0 ? (
          <p className="col-span-full rounded-lg border border-dashed p-6 sm:p-8 text-center text-muted-foreground text-sm">
            No tournaments yet. Create your first tournament to get started.
          </p>
        ) : (
          tournaments.map(
            (t: {
              id: string;
              slug: string;
              name: string;
              sport: string;
              format?: string;
              logoUrl?: string;
            }) => <TournamentCard key={t.id} tournament={t} />,
          )
        )}
      </div>
    </div>
  );
}
