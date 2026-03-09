import { notFound } from "next/navigation";
import { TeamsCrud } from "@/components/tournament/TeamsCrud";

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

async function getTeams(tournamentId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/teams`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPlayersForTeam(teamId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/teams/${teamId}/players`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TournamentTeamsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();
  const teams = await getTeams(tournament.id);
  const playersByTeamId: Record<
    string,
    { id: string; name: string; avatarUrl?: string | null }[]
  > = {};
  await Promise.all(
    teams.map(async (t: { id: string }) => {
      playersByTeamId[t.id] = await getPlayersForTeam(t.id);
    }),
  );

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
        <h1 className="text-2xl font-semibold">Teams</h1>
      </div>
      <p className="text-muted-foreground pl-3">
        {tournament.name} — participants (teams and rosters). Create, update,
        and delete teams and players. Export to CSV using the button below.
      </p>
      <div className="pl-3">
        <TeamsCrud
          tournamentId={tournament.id}
          tournamentName={tournament.name}
          initialTeams={teams}
          initialPlayersByTeamId={playersByTeamId}
        />
      </div>
    </div>
  );
}
