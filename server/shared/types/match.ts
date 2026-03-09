export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homePlaceholder?: string;
  awayPlaceholder?: string;
  homeScore?: number;
  awayScore?: number;
  round?: number;
  roundLabel?: string;
  stage?: string;
  venue?: string;
  scheduledAt?: string;
  status: MatchStatus;
  referee?: string;
  nextMatchId?: string;
  nextMatchSlot?: "home" | "away";
  createdAt: string;
  updatedAt: string;
}

export interface MatchCreateDto {
  tournamentId: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homePlaceholder?: string;
  awayPlaceholder?: string;
  round?: number;
  roundLabel?: string;
  stage?: string;
  venue?: string;
  scheduledAt?: string;
  status?: MatchStatus;
}

export interface BracketMatch extends Match {
  homeTeam?: { id: string; name: string; logoUrl?: string };
  awayTeam?: { id: string; name: string; logoUrl?: string };
}
