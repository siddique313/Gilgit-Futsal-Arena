import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "./match.entity";

export type CreateMatchDto = {
  tournamentId: string;
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  homePlaceholder?: string | null;
  awayPlaceholder?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  round?: number | null;
  roundLabel?: string | null;
  status?: string;
  scheduledAt?: Date | string | null;
  venue?: string | null;
  referee?: string | null;
};

export type UpdateMatchDto = Partial<CreateMatchDto>;

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private repo: Repository<Match>,
  ) {}

  async findByTournament(tournamentId: string): Promise<Match[]> {
    return this.repo.find({
      where: { tournamentId },
      order: { round: "ASC", scheduledAt: "ASC" },
    });
  }

  async findOne(id: string): Promise<Match | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateMatchDto): Promise<Match> {
    const match = this.repo.create({
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
    });
    return this.repo.save(match);
  }

  async update(id: string, dto: UpdateMatchDto): Promise<Match> {
    await this.repo.update(id, {
      ...dto,
      ...(dto.scheduledAt !== undefined && {
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      }),
    });
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException("Match not found");
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException("Match not found");
  }
}
