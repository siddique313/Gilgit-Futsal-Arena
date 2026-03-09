export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  logoUrl?: string;
  groupLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamCreateDto {
  tournamentId: string;
  name: string;
  logoUrl?: string;
  groupLabel?: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  avatarUrl?: string;
  role?: "captain" | "vice_captain" | "goalkeeper" | "player";
  jerseyNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerCreateDto {
  teamId: string;
  name: string;
  avatarUrl?: string;
  role?: Player["role"];
  jerseyNumber?: number;
}
