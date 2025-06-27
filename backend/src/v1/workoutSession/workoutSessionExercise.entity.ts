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

  @ManyToOne(() => Exercise, { onDelete: 'SET NULL', nullable: true })
  exercise: Exercise;

  @Column('json', { nullable: true })
  exerciseSnapshot: {
    name: string;
    description?: string;
    img?: string;
    muscleGroups?: string[]; // or number[] if you're linking them
  };

  @OneToMany(() => WorkoutSessionSet, (s) => s.exercise, {
    cascade: true,
    eager: true,
  })
  sets: WorkoutSessionSet[];
}
