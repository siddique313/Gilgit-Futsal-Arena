import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Team } from "../teams/team.entity";

@Entity("players")
export class Player {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "teamId" })
  team: Team;

  @Column()
  name: string;

  @Column({ type: "varchar", nullable: true })
  avatarUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  role: string | null;

  @Column({ type: "int", nullable: true })
  jerseyNumber: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
