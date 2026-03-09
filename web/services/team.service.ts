import { api } from "@/lib/api";
export const teamService = {
  getByTournament: (id: string) => api(`/tournaments/${id}/teams`),
  getById: (id: string) => api(`/teams/${id}`),
};
