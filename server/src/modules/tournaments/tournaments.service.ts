import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tournament } from "./tournament.entity";
import { EventsGateway } from "../events/events.gateway";
import { MatchesService } from "../matches/matches.service";
import { TeamsService } from "../teams/teams.service";

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private repo: Repository<Tournament>,
    private events: EventsGateway,
    private matchesService: MatchesService,
    private teamsService: TeamsService,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.repo.find({ order: { createdAt: "DESC" } });
  }

  async findBySlug(slug: string): Promise<Tournament | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async findById(id: string): Promise<Tournament | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: {
    name: string;
    sport?: string;
    format?: string;
    participantCount?: number;
    logoUrl?: string | null;
  }): Promise<Tournament> {
    const slug = this.slugify(dto.name) + "-" + Date.now().toString(36);
    const t = this.repo.create({
      name: dto.name,
      slug,
      sport: dto.sport ?? "futsal",
      format: dto.format ?? "single_elimination",
      participantCount: dto.participantCount ?? 8,
      logoUrl: dto.logoUrl ?? null,
    });
    const saved = await this.repo.save(t);
    this.events.broadcastTournamentUpdate({
      tournamentId: saved.id,
      slug: saved.slug,
    });
    return saved;
  }

  async update(
    id: string,
    dto: Partial<{
      name: string;
      sport: string;
      description: string | null;
      logoUrl: string | null;
      settings: Record<string, unknown> | null;
      contacts: Array<{ id: string; label: string; value: string }> | null;
    }>,
  ): Promise<Tournament | null> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) return null;
    if (dto.name != null) t.name = dto.name;
    if (dto.sport != null) t.sport = dto.sport;
    if (dto.description !== undefined) t.description = dto.description;
    if (dto.logoUrl !== undefined) t.logoUrl = dto.logoUrl;
    if (dto.settings !== undefined) t.settings = dto.settings;
    if (dto.contacts !== undefined) t.contacts = dto.contacts;
    const saved = await this.repo.save(t);
    this.events.broadcastTournamentUpdate({
      tournamentId: saved.id,
      slug: saved.slug,
    });
    return saved;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) return { deleted: false };
    const matches = await this.matchesService.findByTournament(id);
    for (const m of matches) await this.matchesService.remove(m.id);
    const teams = await this.teamsService.findByTournament(id);
    for (const team of teams) await this.teamsService.remove(team.id);
    await this.repo.remove(t);
    return { deleted: true };
  }

  slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
}
