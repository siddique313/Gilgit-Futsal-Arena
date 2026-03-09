import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tournamentId: string;

  @Column({ type: "varchar", nullable: true })
  homeTeamId: string | null;

  @Column({ type: "varchar", nullable: true })
  awayTeamId: string | null;

  @Column({ type: "varchar", nullable: true })
  homePlaceholder: string | null;

  @Column({ type: "varchar", nullable: true })
  awayPlaceholder: string | null;

  @Column({ type: "int", nullable: true })
  homeScore: number | null;

  @Column({ type: "int", nullable: true })
  awayScore: number | null;

  @Column({ type: "int", nullable: true })
  round: number | null;

  @Column({ type: "varchar", nullable: true })
  roundLabel: string | null;

  @Column({ default: "scheduled" })
  status: string;

  @Column({ type: "timestamptz", nullable: true })
  scheduledAt: Date | null;

  @Column({ type: "varchar", nullable: true })
  venue: string | null;

  @Column({ type: "varchar", nullable: true })
  referee: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
