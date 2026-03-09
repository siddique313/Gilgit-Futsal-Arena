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
  MatchesService,
  CreateMatchDto,
  UpdateMatchDto,
} from "./matches.service";

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private readonly service: MatchesService) {}

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateMatchDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
