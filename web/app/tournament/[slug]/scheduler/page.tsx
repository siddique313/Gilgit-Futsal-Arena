import { notFound } from "next/navigation";
import { SchedulerContent } from "@/components/tournament/scheduler/SchedulerContent";

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

export default async function TournamentSchedulerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournament(slug);
  if (!tournament) notFound();

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Scheduler</h1>
      <SchedulerContent />
    </div>
  );
}
