import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Player } from "./player.entity";

export type CreatePlayerDto = {
  teamId: string;
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
  jerseyNumber?: number | null;
};

export type UpdatePlayerDto = Partial<Omit<CreatePlayerDto, "teamId">>;

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private repo: Repository<Player>,
  ) {}

  async findByTeam(teamId: string): Promise<Player[]> {
    return this.repo.find({
      where: { teamId },
      order: { name: "ASC" },
    });
  }

  async findOne(id: string): Promise<Player | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreatePlayerDto): Promise<Player> {
    const player = this.repo.create(dto);
    return this.repo.save(player);
  }

  async update(id: string, dto: UpdatePlayerDto): Promise<Player> {
    await this.repo.update(id, dto);
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException("Player not found");
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException("Player not found");
  }
}
