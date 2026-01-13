import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

@Entity()
export class GlobalExercise {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Stable key intended for frontend i18n lookup, e.g. "exercise.bench_press".
   * Must remain stable even if the defaultName changes.
   */
  @Column({ unique: true })
  i18nKey: string;

  /**
   * Default/fallback display name (English for now).
   * Frontend can replace this with i18n translations using i18nKey.
   */
  @Column()
  defaultName: string;

  @Column({ nullable: true })
  defaultDescription?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  defaultSets?: number;

  @Column({ nullable: true })
  defaultReps?: number;

  @Column({ nullable: true })
  defaultPauseSeconds?: number;

  @ManyToMany(() => MuscleGroup, { cascade: true })
  @JoinTable()
  muscleGroups: MuscleGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
