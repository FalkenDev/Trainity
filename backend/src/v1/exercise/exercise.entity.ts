import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';
import { ExerciseMedia } from './exerciseMedia.entity';

export enum ExerciseType {
  COMPOUND = 'compound',
  ISOLATION = 'isolation',
  BODYWEIGHT = 'bodyweight',
}

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /**
   * Optional i18n key (copied from the global exercise when imported).
   * Frontend can use this to translate the display name in the future.
   */
  @Column({ nullable: true })
  i18nKey?: string;

  /**
   * If true, user has edited the name and we should use `name` instead of the i18n translation.
   */
  @Column({ default: false })
  isNameCustom: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: ExerciseType, nullable: true })
  exerciseType?: ExerciseType;

  @Column()
  defaultSets: number;

  @Column()
  defaultReps: number;

  @Column()
  defaultPauseSeconds: number;

  @Column({ type: 'jsonb', nullable: true })
  equipment?: string[];

  @Column({ type: 'jsonb', nullable: true })
  instructions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  proTips?: string[];

  @Column({ type: 'jsonb', nullable: true })
  mistakes?: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToOne(() => MuscleGroup, { nullable: true, eager: false })
  primaryMuscleGroup?: MuscleGroup;

  @ManyToMany(() => MuscleGroup, (mg) => mg.exercises, { cascade: true })
  @JoinTable()
  muscleGroups: MuscleGroup[];

  @OneToMany(() => ExerciseMedia, (media) => media.exercise, {
    cascade: true,
    eager: true,
  })
  media: ExerciseMedia[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
