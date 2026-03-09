import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerStat } from "./player-stat.entity";
import { PlayerStatsService } from "./player-stats.service";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStat])],
  providers: [PlayerStatsService],
  exports: [PlayerStatsService],
})
export class PlayerStatsModule {}
