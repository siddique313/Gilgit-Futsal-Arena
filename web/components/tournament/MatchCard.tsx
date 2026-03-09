interface MatchCardProps {
  match: {
    id: string;
    homePlaceholder?: string;
    awayPlaceholder?: string;
    homeTeam?: { name: string };
    awayTeam?: { name: string };
    homeScore?: number;
    awayScore?: number;
    scheduledAt?: string;
    roundLabel?: string;
    venue?: string;
    referee?: string;
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const home = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD";
  const away = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD";
  const date = match.scheduledAt
    ? new Date(match.scheduledAt).toLocaleString()
    : null;

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 min-w-0">
      {match.roundLabel && (
        <p className="text-xs font-medium text-muted-foreground truncate">
          {match.roundLabel}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2 sm:gap-4">
        <span className="flex-1 min-w-0 truncate text-right text-sm sm:text-base font-medium">
          {home}
        </span>
        <span className="flex-shrink-0 text-base sm:text-lg font-semibold text-primary px-1">
          {match.homeScore ?? "–"} : {match.awayScore ?? "–"}
        </span>
        <span className="flex-1 min-w-0 truncate text-left text-sm sm:text-base font-medium">
          {away}
        </span>
      </div>
      {(date || match.venue) && (
        <p className="mt-2 text-xs text-muted-foreground truncate">
          {date}
          {match.venue && ` · ${match.venue}`}
          {match.referee && ` · Ref: ${match.referee}`}
        </p>
      )}
    </div>
  );
}
