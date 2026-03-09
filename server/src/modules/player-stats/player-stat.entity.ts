import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tournament } from "../tournaments/tournament.entity";
import { Player } from "../players/player.entity";

@Entity("player_stats")
export class PlayerStat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tournamentId: string;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: "tournamentId" })
  tournament: Tournament;

  @Column()
  playerId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: "playerId" })
  player: Player;

  @Column({ type: "int", default: 0 })
  goals: number;

  @Column({ type: "int", default: 0 })
  assists: number;

  @Column({ type: "int", default: 0 })
  yellowCards: number;

  @Column({ type: "int", default: 0 })
  mvp: number;

  @Column({ type: "varchar", default: "active" })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
