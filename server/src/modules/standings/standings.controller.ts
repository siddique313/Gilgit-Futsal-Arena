import { Controller, Patch, Delete, Param, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StandingsService, UpdateStandingDto } from "./standings.service";

@ApiTags("standings")
@Controller("standings")
export class StandingsController {
  constructor(private readonly service: StandingsService) {}

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateStandingDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
