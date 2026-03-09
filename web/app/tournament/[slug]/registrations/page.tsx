import { notFound } from "next/navigation";
import Link from "next/link";
import { RegistrationsContent } from "@/components/tournament/registrations/RegistrationsContent";

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

export default async function TournamentRegistrationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Registrations</h1>
      <RegistrationsContent slug={slug} tournamentName={tournament.name} />
    </div>
  );
}
