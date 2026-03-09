import { notFound } from "next/navigation";
import { AdvancedSettings } from "@/components/tournament/settings/AdvancedSettings";

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

export default async function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();

  const settings = tournament.settings ?? null;

  return (
    <div className="min-w-0 space-y-8">
      <AdvancedSettings
        tournamentId={tournament.id}
        slug={slug}
        settings={settings}
      />
    </div>
  );
}
