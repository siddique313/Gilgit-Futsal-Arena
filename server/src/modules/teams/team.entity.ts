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

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tournamentId: string;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: "tournamentId" })
  tournament: Tournament;

  @Column()
  name: string;

  @Column({ type: "varchar", nullable: true })
  logoUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  groupLabel: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
