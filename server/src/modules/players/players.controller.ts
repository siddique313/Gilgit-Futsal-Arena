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
import {
  PlayersService,
  CreatePlayerDto,
  UpdatePlayerDto,
} from "./players.service";

@ApiTags("players")
@Controller("players")
export class PlayersController {
  constructor(private readonly service: PlayersService) {}

  @Post()
  create(@Body() body: CreatePlayerDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdatePlayerDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
