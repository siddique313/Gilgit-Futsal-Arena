import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TeamsService, CreateTeamDto, UpdateTeamDto } from "./teams.service";
import { PlayersService } from "../players/players.service";

@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(
    private readonly service: TeamsService,
    private readonly playersService: PlayersService,
  ) {}

  @Get(":id/players")
  getPlayers(@Param("id") teamId: string) {
    return this.playersService.findByTeam(teamId);
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTeamDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateTeamDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
