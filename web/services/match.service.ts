import { api } from "@/lib/api";

export const matchService = {
  getByTournament: (tournamentId: string) =>
    api<unknown[]>(`/tournaments/${tournamentId}/matches`),
  getById: (id: string) => api<unknown>(`/matches/${id}`),
  updateScore: (id: string, homeScore: number, awayScore: number) =>
    api<unknown>(`/matches/${id}/score`, {
      method: "PATCH",
      body: JSON.stringify({ homeScore, awayScore }),
    }),
};
