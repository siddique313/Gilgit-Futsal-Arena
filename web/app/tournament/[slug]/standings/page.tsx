import { notFound } from "next/navigation";
import { StandingsView } from "../../../../components/tournament/StandingsView";

async function getTournament(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/slug/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getStandings(tournamentId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/standings`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TournamentStandingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();
  const standings = await getStandings(tournament.id);

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Standings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tournament.name} — group standings. P: Played, W: Wins, D: Draws, L:
          Losses, SF: Score For, SA: Score Against, SD: Score Difference, PTS:
          Points.
        </p>
      </div>
      <StandingsView
        standings={standings}
        tournamentName={tournament.name}
        tournamentId={tournament.id}
        showExport
      />
      <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        <h3 className="mb-2 font-medium text-foreground">Standings criteria</h3>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Points (descendant)</li>
          <li>Score difference (descendant)</li>
          <li>Score for (descendant)</li>
          <li>Head-to-head</li>
          <li>Played (ascendant)</li>
        </ol>
      </section>
    </div>
  );
}
