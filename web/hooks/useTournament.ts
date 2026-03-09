"use client";
const base = process.env.NEXT_PUBLIC_API_URL || "";
export function useTournament(slug: string | null) {
  return { tournament: null, error: null, mutate: () => {} };
}
export function useTournaments() {
  return { tournaments: [], error: null, mutate: () => {} };
}
