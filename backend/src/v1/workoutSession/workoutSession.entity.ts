import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutStatus } from '../types/WorkoutStatus.type';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';

@Entity()
export class WorkoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workout, { nullable: true, onDelete: 'SET NULL' })
  workout: Workout;

  @Column('json', { nullable: true })
  workoutSnapshot: {
    title: string;
    description?: string;
    time?: number;
    exercises: {
      exerciseId: number;
      order: number;
      sets: number;
      reps: number;
      weight: number;
      pauseSeconds?: number;
    }[];
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({
    type: 'enum',
    enum: ['in_progress', 'finished', 'abandoned'],
    default: 'in_progress',
  })
  status: WorkoutStatus;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @OneToMany(() => WorkoutSessionExercise, (e) => e.session, {
    cascade: true,
    eager: true,
  })
  exercises: WorkoutSessionExercise[];

  @Column({ type: 'float', default: 0 })
  totalWeight: number;

  @Column('json', { nullable: true })
  exerciseStats: {
    exerciseId: number;
    totalWeight: number;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
