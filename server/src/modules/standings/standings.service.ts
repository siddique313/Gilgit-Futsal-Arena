import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Standing } from "./standing.entity";
import { TeamsService } from "../teams/teams.service";

export type StandingRow = {
  id: string;
  tournamentId: string;
  teamId: string;
  teamName: string;
  groupLabel: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
};

export type CreateStandingDto = {
  teamId: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  points?: number;
};

export type UpdateStandingDto = Partial<Omit<CreateStandingDto, "teamId">>;

@Injectable()
export class StandingsService {
  constructor(
    @InjectRepository(Standing)
    private repo: Repository<Standing>,
    private teamsService: TeamsService,
  ) {}

  async findByTournament(
    tournamentId: string,
  ): Promise<{ groupLabel: string; rows: StandingRow[] }[]> {
    const standings = await this.repo.find({
      where: { tournamentId },
      order: { points: "DESC", goalsFor: "DESC" },
    });
    const teams = await this.teamsService.findByTournament(tournamentId);
    const teamMap = new Map(
      teams.map((t) => [
        t.id,
        { name: t.name, groupLabel: t.groupLabel ?? null },
      ]),
    );
    const rows: StandingRow[] = standings.map((s) => {
      const t = teamMap.get(s.teamId);
      return {
        id: s.id,
        tournamentId: s.tournamentId,
        teamId: s.teamId,
        teamName: t?.name ?? "Unknown",
        groupLabel: t?.groupLabel ?? null,
        played: s.played,
        wins: s.wins,
        draws: s.draws,
        losses: s.losses,
        goalsFor: s.goalsFor,
        goalsAgainst: s.goalsAgainst,
        goalDifference: s.goalsFor - s.goalsAgainst,
        points: s.points,
        rank: 0,
      };
    });
    const byGroup = new Map<string, StandingRow[]>();
    for (const row of rows) {
      const g = row.groupLabel ?? "All";
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g)!.push(row);
    }
    for (const [, groupRows] of byGroup) {
      groupRows.sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor,
      );
      groupRows.forEach((r, i) => {
        r.rank = i + 1;
      });
    }
    const groupOrder = Array.from(byGroup.keys()).sort((a, b) =>
      a === "All" ? 1 : b === "All" ? -1 : a.localeCompare(b),
    );
    return groupOrder.map((groupLabel) => ({
      groupLabel,
      rows: byGroup.get(groupLabel) ?? [],
    }));
  }

  async create(
    tournamentId: string,
    dto: CreateStandingDto,
  ): Promise<Standing> {
    const existing = await this.repo.findOne({
      where: { tournamentId, teamId: dto.teamId },
    });
    if (existing)
      throw new ConflictException("Standing for this team already exists");
    const s = this.repo.create({
      tournamentId,
      teamId: dto.teamId,
      played: dto.played ?? 0,
      wins: dto.wins ?? 0,
      draws: dto.draws ?? 0,
      losses: dto.losses ?? 0,
      goalsFor: dto.goalsFor ?? 0,
      goalsAgainst: dto.goalsAgainst ?? 0,
      points: dto.points ?? 0,
    });
    return this.repo.save(s);
  }

  async update(id: string, dto: UpdateStandingDto): Promise<Standing> {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException("Standing not found");
    if (dto.played != null) s.played = dto.played;
    if (dto.wins != null) s.wins = dto.wins;
    if (dto.draws != null) s.draws = dto.draws;
    if (dto.losses != null) s.losses = dto.losses;
    if (dto.goalsFor != null) s.goalsFor = dto.goalsFor;
    if (dto.goalsAgainst != null) s.goalsAgainst = dto.goalsAgainst;
    if (dto.points != null) s.points = dto.points;
    return this.repo.save(s);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException("Standing not found");
  }
}
