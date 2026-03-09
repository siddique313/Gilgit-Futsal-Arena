import { notFound } from "next/navigation";
import { BracketView } from "@/components/tournament/BracketView";

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

async function getBracket(tournamentId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/bracket`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TournamentBracketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();
  const bracket = await getBracket(tournament.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Matches</h1>
      <p className="mt-1 text-muted-foreground">
        {tournament.name} — knockout bracket.
      </p>
      <div className="mt-6">
        <BracketView matches={bracket} />
      </div>
    </div>
  );
}
