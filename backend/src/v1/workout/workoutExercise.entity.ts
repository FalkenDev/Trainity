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

  @Column()
  sets: number;

  @Column()
  reps: number;

  @Column()
  weight: number;

  @Column()
  pauseSeconds: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance?: number;
}
