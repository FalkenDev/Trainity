import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutSession } from './workoutSession.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';

@Entity()
export class WorkoutSessionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutSession, (session) => session.exercises, {
    onDelete: 'CASCADE',
  })
  session: WorkoutSession;

  @ManyToOne(() => Exercise)
  exercise: Exercise;

  @Column({ type: 'jsonb', nullable: true })
  exerciseSnapshot: {
    name: string;
    description?: string;
    img?: string;
    muscleGroups?: string[];
  };

  @OneToMany(() => WorkoutSessionSet, (set) => set.sessionExercise, {
    cascade: true,
    eager: true,
  })
  sets: WorkoutSessionSet[];

  @Column({ nullable: true })
  notes?: string;
}
