import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Standing } from "./standing.entity";
import { StandingsController } from "./standings.controller";
import { StandingsService } from "./standings.service";
import { TeamsModule } from "../teams/teams.module";

@Module({
  imports: [TypeOrmModule.forFeature([Standing]), TeamsModule],
  controllers: [StandingsController],
  providers: [StandingsService],
  exports: [StandingsService],
})
export class StandingsModule {}
