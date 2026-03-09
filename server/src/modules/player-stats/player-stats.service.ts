import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerStat } from "./player-stat.entity";

export type StatLeaderboardEntry = {
  id: string;
  playerId: string;
  name: string;
  teamName: string;
  teamId: string;
  avatarUrl: string | null;
  count: number;
  status: string;
};

export type TournamentStatsResponse = {
  goals: StatLeaderboardEntry[];
  assists: StatLeaderboardEntry[];
  yellowCards: StatLeaderboardEntry[];
  mvp: StatLeaderboardEntry[];
};

export type CreatePlayerStatDto = {
  playerId: string;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  mvp?: number;
  status?: string;
};

export type UpdatePlayerStatDto = Partial<
  Omit<CreatePlayerStatDto, "playerId">
>;

type StatWithPlayer = PlayerStat & {
  player: {
    name: string;
    teamId: string;
    avatarUrl: string | null;
    team?: { name: string };
  };
};

@Injectable()
export class PlayerStatsService {
  constructor(
    @InjectRepository(PlayerStat)
    private repo: Repository<PlayerStat>,
  ) {}

  async getLeaderboards(
    tournamentId: string,
  ): Promise<TournamentStatsResponse> {
    const stats = await this.repo.find({
      where: { tournamentId },
      relations: ["player", "player.team"],
      order: { createdAt: "ASC" },
    });

    const toEntry = (
      ps: StatWithPlayer,
      key: "goals" | "assists" | "yellowCards" | "mvp",
    ): StatLeaderboardEntry => ({
      id: ps.id,
      playerId: ps.playerId,
      name: ps.player?.name ?? "",
      teamName: ps.player?.team?.name ?? "",
      teamId: ps.player?.teamId ?? "",
      avatarUrl: ps.player?.avatarUrl ?? null,
      count: ps[key],
      status: ps.status,
    });

    type Row = StatLeaderboardEntry & {
      goals: number;
      assists: number;
      yellowCards: number;
      mvp: number;
    };
    const rows: Row[] = (stats as StatWithPlayer[]).map((ps) => ({
      id: ps.id,
      playerId: ps.playerId,
      name: ps.player?.name ?? "",
      teamName: ps.player?.team?.name ?? "",
      teamId: ps.player?.teamId ?? "",
      avatarUrl: ps.player?.avatarUrl ?? null,
      count: 0,
      status: ps.status,
      goals: ps.goals,
      assists: ps.assists,
      yellowCards: ps.yellowCards,
      mvp: ps.mvp,
    }));

    const sortBy = (
      key: keyof Pick<Row, "goals" | "assists" | "yellowCards" | "mvp">,
    ): StatLeaderboardEntry[] =>
      [...rows]
        .filter((e) => e[key] > 0)
        .sort((a, b) => b[key] - a[key])
        .slice(0, 10)
        .map((e) => ({
          id: e.id,
          playerId: e.playerId,
          name: e.name,
          teamName: e.teamName,
          teamId: e.teamId,
          avatarUrl: e.avatarUrl,
          count: e[key],
          status: e.status,
        }));

    return {
      goals: sortBy("goals"),
      assists: sortBy("assists"),
      yellowCards: sortBy("yellowCards"),
      mvp: sortBy("mvp"),
    };
  }

  async getEntries(tournamentId: string) {
    const stats = await this.repo.find({
      where: { tournamentId },
      relations: ["player", "player.team"],
      order: { createdAt: "ASC" },
    });
    return (stats as StatWithPlayer[]).map((ps) => ({
      id: ps.id,
      tournamentId: ps.tournamentId,
      playerId: ps.playerId,
      name: ps.player?.name ?? "",
      teamName: ps.player?.team?.name ?? "",
      teamId: ps.player?.teamId ?? "",
      avatarUrl: ps.player?.avatarUrl ?? null,
      goals: ps.goals,
      assists: ps.assists,
      yellowCards: ps.yellowCards,
      mvp: ps.mvp,
      status: ps.status,
    }));
  }

  async create(
    tournamentId: string,
    dto: CreatePlayerStatDto,
  ): Promise<PlayerStat> {
    const existing = await this.repo.findOne({
      where: { tournamentId, playerId: dto.playerId },
    });
    if (existing) {
      existing.goals = dto.goals ?? existing.goals;
      existing.assists = dto.assists ?? existing.assists;
      existing.yellowCards = dto.yellowCards ?? existing.yellowCards;
      existing.mvp = dto.mvp ?? existing.mvp;
      existing.status = dto.status ?? existing.status;
      return this.repo.save(existing);
    }
    const stat = this.repo.create({
      tournamentId,
      playerId: dto.playerId,
      goals: dto.goals ?? 0,
      assists: dto.assists ?? 0,
      yellowCards: dto.yellowCards ?? 0,
      mvp: dto.mvp ?? 0,
      status: dto.status ?? "active",
    });
    return this.repo.save(stat);
  }

  async update(id: string, dto: UpdatePlayerStatDto): Promise<PlayerStat> {
    const stat = await this.repo.findOne({ where: { id } });
    if (!stat) throw new NotFoundException("Stat entry not found");
    if (dto.goals != null) stat.goals = dto.goals;
    if (dto.assists != null) stat.assists = dto.assists;
    if (dto.yellowCards != null) stat.yellowCards = dto.yellowCards;
    if (dto.mvp != null) stat.mvp = dto.mvp;
    if (dto.status != null) stat.status = dto.status;
    return this.repo.save(stat);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException("Stat entry not found");
  }
}
