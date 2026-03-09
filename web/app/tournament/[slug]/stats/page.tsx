import { notFound } from "next/navigation";
import { StatsView } from "../../../../components/tournament/StatsView";

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

async function getStats(tournamentId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/stats`, {
      next: { revalidate: 30 },
    });
    if (!res.ok)
      return { goals: [], assists: [], yellowCards: [], mvp: [] };
    return res.json();
  } catch {
    return { goals: [], assists: [], yellowCards: [], mvp: [] };
  }
}

export default async function TournamentStatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();
  const stats = await getStats(tournament.id);

  return (
    <div className="min-w-0">
      <StatsView
        tournamentId={tournament.id}
        tournamentName={tournament.name}
        initialStats={stats}
      />
    </div>
  );
}
