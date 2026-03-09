import Link from "next/link";
import Image from "next/image";
import type { Tournament } from "@/shared/types/tournament";

const DEFAULT_TOURNAMENT_IMG =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&q=80";

interface TournamentCardProps {
  tournament: Pick<Tournament, "id" | "slug" | "name" | "sport" | "logoUrl"> & {
    format?: string;
  };
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const imgSrc = tournament.logoUrl ?? DEFAULT_TOURNAMENT_IMG;
  return (
    <Link
      href={`/tournament/${tournament.slug}`}
      className="block rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 min-w-0"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0 rounded-full overflow-hidden bg-primary/20">
          <Image
            src={imgSrc}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{tournament.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {tournament.sport} ·{" "}
            {(tournament as { format?: string }).format ?? "Tournament"}
          </p>
        </div>
      </div>
    </Link>
  );
}
