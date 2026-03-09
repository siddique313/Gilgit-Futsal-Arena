"use client";
export function useTeams(tournamentId: string | null) {
  return { teams: [], error: null, mutate: () => {} };
}
