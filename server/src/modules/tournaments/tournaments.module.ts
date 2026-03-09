import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tournament } from "./tournament.entity";
import { TournamentsController } from "./tournaments.controller";
import { TournamentsService } from "./tournaments.service";
import { TeamsModule } from "../teams/teams.module";
import { MatchesModule } from "../matches/matches.module";
import { StandingsModule } from "../standings/standings.module";
import { PlayerStatsModule } from "../player-stats/player-stats.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    TeamsModule,
    MatchesModule,
    StandingsModule,
    PlayerStatsModule,
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
