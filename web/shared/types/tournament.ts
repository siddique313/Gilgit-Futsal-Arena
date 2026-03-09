export type TournamentFormat =
  | "single_elimination"
  | "round_robin"
  | "double_elimination"
  | "swiss"
  | "multistage";
export type StageFormat = "knockout" | "round_robin_groups";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  sport: string;
  description?: string;
  logoUrl?: string;
  format: TournamentFormat;
  participantCount: number;
  firstStageFormat?: StageFormat;
  secondStageFormat?: StageFormat;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface TournamentCreateDto {
  name: string;
  sport: string;
  description?: string;
  format: TournamentFormat;
  participantCount: number;
  firstStageFormat?: StageFormat;
  secondStageFormat?: StageFormat;
  isPublic?: boolean;
}

export interface TournamentSettings {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  numberOfGroups?: number;
  promotedPerGroup?: number;
  numberOfLegs?: number;
}
