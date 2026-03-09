import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableTitle } from "@/components/tournament/overview/EditableTitle";
import { EditableDetails } from "@/components/tournament/overview/EditableDetails";
import { EditableSettings } from "@/components/tournament/overview/EditableSettings";
import { ContactsSection } from "@/components/tournament/overview/ContactsSection";
import { StandingsCrudSection } from "@/components/tournament/overview/StandingsCrudSection";
import { OverviewStatsSection } from "@/components/tournament/overview/OverviewStatsSection";

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

async function getTeamsCount(tournamentId: string): Promise<number> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/tournaments/${tournamentId}/teams`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return 0;
    const list = await res.json();
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export default async function TournamentOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();

  const contacts = tournament.contacts ?? null;
  const settings = tournament.settings ?? null;
  const teamsCount = await getTeamsCount(tournament.id);

  return (
    <div className="min-w-0 space-y-8">
      {/* Title with edit */}
      <div className="text-center sm:text-left">
        <EditableTitle tournamentId={tournament.id} name={tournament.name} />
        <p className="mt-2 text-sm text-muted-foreground">
          Want to come back later? Log in to save your tournament now, or it
          will be deleted in 24 hours.
        </p>
      </div>

      {/* Details */}
      <EditableDetails
        tournamentId={tournament.id}
        sport={tournament.sport}
        description={tournament.description ?? null}
      />

      {/* Overview & CSV export */}
      <OverviewStatsSection
        tournamentName={tournament.name}
        slug={slug}
        sport={tournament.sport}
        description={tournament.description ?? null}
        teamsCount={teamsCount}
      />

      {/* Tournament Settings */}
      <EditableSettings tournamentId={tournament.id} settings={settings} />

      {/* Contacts */}
      <ContactsSection tournamentId={tournament.id} contacts={contacts} />

      {/* Standings CRUD (create, update, delete) */}
      <StandingsCrudSection tournamentId={tournament.id} />

      {/* Quick links */}
      <nav className="flex flex-wrap gap-2 border-t pt-6 text-sm">
        <Link
          href={`/tournament/${slug}/teams`}
          className="font-medium text-primary hover:underline"
        >
          Teams
        </Link>
        <Link
          href={`/tournament/${slug}/matches`}
          className="text-muted-foreground hover:text-foreground"
        >
          Groups Matches
        </Link>
        <Link
          href={`/tournament/${slug}/standings`}
          className="text-muted-foreground hover:text-foreground"
        >
          Groups Standings
        </Link>
        <Link
          href={`/tournament/${slug}/bracket`}
          className="text-muted-foreground hover:text-foreground"
        >
          Knockout
        </Link>
        <Link
          href={`/tournament/${slug}/stats`}
          className="text-muted-foreground hover:text-foreground"
        >
          Stats
        </Link>
        <Link
          href={`/tournament/${slug}/settings`}
          className="text-muted-foreground hover:text-foreground"
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}
