import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';

export enum RecordType {
  MAX_WEIGHT = 'max_weight',
  MAX_VOLUME_SET = 'max_volume_set',
  MAX_VOLUME_SESSION = 'max_volume_session',
  MAX_REPS = 'max_reps',
  ESTIMATED_1RM = 'estimated_1rm',
}

@Entity()
@Unique(['user', 'exercise', 'recordType'])
export class ExerciseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE', eager: true })
  exercise: Exercise;

  @Column({ type: 'enum', enum: RecordType })
  recordType: RecordType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => WorkoutSession, { onDelete: 'SET NULL', nullable: true })
  workoutSession: WorkoutSession | null;

  @Column({ type: 'timestamp' })
  achievedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  setDetails: { weight: number; reps: number; rpe?: number } | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
