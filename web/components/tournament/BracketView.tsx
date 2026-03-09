"use client";

import type { BracketMatch } from "@/shared/types/match";

interface BracketViewProps {
  matches: BracketMatch[];
}

export function BracketView({ matches }: BracketViewProps) {
  if (!matches?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Knockout bracket will appear here once matches are generated.
      </div>
    );
  }

  const byRound = matches.reduce<Record<number, BracketMatch[]>>((acc, m) => {
    const r = m.round ?? 0;
    if (!acc[r]) acc[r] = [];
    acc[r].push(m);
    return acc;
  }, {});
  const rounds = Object.keys(byRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {rounds.map((round) => (
        <div key={round}>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
            {round === 1
              ? "Quarterfinals"
              : round === 2
                ? "Semifinals"
                : round === 3
                  ? "Final"
                  : "Round " + round}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {byRound[round].map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-primary/30 bg-primary/5 p-3"
              >
                <p className="mb-2 text-xs font-medium text-primary">
                  {match.roundLabel ?? "Match"}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"}
                    </span>
                    {match.homeScore != null && (
                      <span className="font-medium">{match.homeScore}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"}
                    </span>
                    {match.awayScore != null && (
                      <span className="font-medium">{match.awayScore}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
