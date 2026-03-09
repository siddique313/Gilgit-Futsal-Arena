import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./team.entity";

export type CreateTeamDto = {
  tournamentId: string;
  name: string;
  logoUrl?: string | null;
  groupLabel?: string | null;
};

export type UpdateTeamDto = Partial<Omit<CreateTeamDto, "tournamentId">>;

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
  ) {}

  async findByTournament(tournamentId: string): Promise<Team[]> {
    return this.repo.find({ where: { tournamentId }, order: { name: "ASC" } });
  }

  async findOne(id: string): Promise<Team | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    const team = this.repo.create(dto);
    return this.repo.save(team);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    await this.repo.update(id, dto);
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException("Team not found");
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException("Team not found");
  }
}
