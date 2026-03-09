import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("tournaments")
export class Tournament {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: "futsal" })
  sport: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", nullable: true })
  logoUrl: string | null;

  @Column({ default: "single_elimination" })
  format: string;

  @Column({ type: "int", default: 8 })
  participantCount: number;

  /** First round, number of legs, placements, etc. */
  @Column({ type: "jsonb", nullable: true })
  settings: Record<string, unknown> | null;

  /** Contact entries: { id, label, value }[] */
  @Column({ type: "jsonb", nullable: true })
  contacts: Array<{ id: string; label: string; value: string }> | null;

  @Column({ type: "varchar", nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
