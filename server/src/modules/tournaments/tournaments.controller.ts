import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TournamentsService } from "./tournaments.service";
import { TeamsService } from "../teams/teams.service";
import { MatchesService } from "../matches/matches.service";
import {
  StandingsService,
  CreateStandingDto,
} from "../standings/standings.service";
import {
  PlayerStatsService,
  CreatePlayerStatDto,
  UpdatePlayerStatDto,
} from "../player-stats/player-stats.service";

@ApiTags("tournaments")
@Controller("tournaments")
export class TournamentsController {
  constructor(
    private readonly service: TournamentsService,
    private readonly teamsService: TeamsService,
    private readonly matchesService: MatchesService,
    private readonly standingsService: StandingsService,
    private readonly playerStatsService: PlayerStatsService,
  ) {}

  @Get()
  list() {
    return this.service.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      sport?: string;
      format?: string;
      participantCount?: number;
      logoUrl?: string | null;
    },
  ) {
    return this.service.create(body);
  }

  @Get("slug/:slug")
  getBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    body: Partial<{
      name: string;
      sport: string;
      description: string | null;
      logoUrl: string | null;
      settings: Record<string, unknown> | null;
      contacts: Array<{ id: string; label: string; value: string }> | null;
    }>,
  ) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }

  @Get(":id/teams")
  getTeams(@Param("id") id: string) {
    return this.teamsService.findByTournament(id);
  }

  @Post(":id/teams")
  createTeam(
    @Param("id") id: string,
    @Body() body: { name: string; logoUrl?: string; groupLabel?: string },
  ) {
    return this.teamsService.create({ ...body, tournamentId: id });
  }

  @Get(":id/matches")
  async getMatches(@Param("id") id: string) {
    const matches = await this.matchesService.findByTournament(id);
    const teams = await this.teamsService.findByTournament(id);
    const teamMap = new Map(
      teams.map((t) => [t.id, { id: t.id, name: t.name }]),
    );
    return matches.map((m) => ({
      ...m,
      homeTeam: m.homeTeamId ? (teamMap.get(m.homeTeamId) ?? null) : null,
      awayTeam: m.awayTeamId ? (teamMap.get(m.awayTeamId) ?? null) : null,
    }));
  }

  @Post(":id/matches")
  createMatch(
    @Param("id") id: string,
    @Body()
    body: {
      homeTeamId?: string;
      awayTeamId?: string;
      homePlaceholder?: string;
      awayPlaceholder?: string;
      round?: number;
      roundLabel?: string;
      status?: string;
      scheduledAt?: string;
      venue?: string;
      referee?: string;
    },
  ) {
    return this.matchesService.create({ ...body, tournamentId: id });
  }

  @Get(":id/standings")
  getStandings(@Param("id") id: string) {
    return this.standingsService.findByTournament(id);
  }

  @Post(":id/standings")
  createStanding(@Param("id") id: string, @Body() body: CreateStandingDto) {
    return this.standingsService.create(id, body);
  }

  @Get(":id/bracket")
  getBracket(@Param("id") id: string) {
    return [];
  }

  @Get(":id/stats/entries")
  getStatsEntries(@Param("id") id: string) {
    return this.playerStatsService.getEntries(id);
  }

  @Post(":id/stats/entries")
  createStatEntry(@Param("id") id: string, @Body() body: CreatePlayerStatDto) {
    return this.playerStatsService.create(id, body);
  }

  @Patch(":id/stats/entries/:entryId")
  updateStatEntry(
    @Param("entryId") entryId: string,
    @Body() body: UpdatePlayerStatDto,
  ) {
    return this.playerStatsService.update(entryId, body);
  }

  @Delete(":id/stats/entries/:entryId")
  deleteStatEntry(@Param("entryId") entryId: string) {
    return this.playerStatsService.remove(entryId);
  }

  @Get(":id/stats")
  getStats(@Param("id") id: string) {
    return this.playerStatsService.getLeaderboards(id);
  }
}
