import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("standings")
export class Standing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tournamentId: string;

  @Column()
  teamId: string;

  @Column({ type: "int", default: 0 })
  played: number;

  @Column({ type: "int", default: 0 })
  wins: number;

  @Column({ type: "int", default: 0 })
  draws: number;

  @Column({ type: "int", default: 0 })
  losses: number;

  @Column({ type: "int", default: 0 })
  goalsFor: number;

  @Column({ type: "int", default: 0 })
  goalsAgainst: number;

  @Column({ type: "int", default: 0 })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
