import { notFound } from "next/navigation";
import { MatchesBracketView } from "@/components/tournament/matches/MatchesBracketView";

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

async function getMatches(tournamentId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/matches`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TournamentMatchesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();
  const matches = await getMatches(tournament.id);

  return (
    <div className="min-w-0">
      <MatchesBracketView
        tournamentId={tournament.id}
        tournamentName={tournament.name}
        initialMatches={matches}
      />
    </div>
  );
}
