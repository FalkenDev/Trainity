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
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';

@Entity()
export class WorkoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workout, { onDelete: 'SET NULL', nullable: true })
  workout: Workout | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({
    type: 'enum',
    enum: ['in_progress', 'finished', 'abandoned'],
    default: 'in_progress',
  })
  status: 'in_progress' | 'finished' | 'abandoned';

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @OneToMany(() => WorkoutSessionExercise, (ex) => ex.session, {
    cascade: true,
    eager: true,
  })
  exercises: WorkoutSessionExercise[];

  @Column({ default: 0 })
  totalWeight: number;

  @Column({ type: 'jsonb', nullable: true })
  exerciseStats: { exerciseId: number; totalWeight: number }[];

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
