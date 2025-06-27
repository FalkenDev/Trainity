import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../exercise/exercise.entity';

@Entity()
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.exercises, {
    onDelete: 'CASCADE',
  })
  workout: Workout;

  @ManyToOne(() => Exercise, { eager: true })
  exercise: Exercise;

  @Column()
  order: number;

  @Column({ default: 3 })
  sets: number;

  @Column({ default: 10 })
  reps: number;

  @Column({ default: 0 })
  weight: number;

  @Column({ default: 60 }) // seconds
  pauseSeconds: number;
}
