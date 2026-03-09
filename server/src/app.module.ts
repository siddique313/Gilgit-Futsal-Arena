import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TournamentsModule } from "./modules/tournaments/tournaments.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { PlayersModule } from "./modules/players/players.module";
import { MatchesModule } from "./modules/matches/matches.module";
import { StandingsModule } from "./modules/standings/standings.module";
import { UploadModule } from "./modules/uploads/upload.module";
import { EventsModule } from "./modules/events/events.module";

@Module({
  controllers: [AppController],
  imports: [
    EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT", 5432),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD") ?? "",
        database: config.get<string>("DB_NAME"),
        autoLoadEntities: true,
        synchronize: config.get<string>("TYPEORM_SYNCHRONIZE") === "true",
        logging: config.get<string>("TYPEORM_LOGGING") === "true",
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TournamentsModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    StandingsModule,
    UploadModule,
  ],
})
export class AppModule {}
