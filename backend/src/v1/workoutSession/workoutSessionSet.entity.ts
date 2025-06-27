import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';

@Entity()
export class WorkoutSessionSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutSessionExercise, (exercise) => exercise.sets, {
    onDelete: 'CASCADE',
  })
  exercise: WorkoutSessionExercise;

  @Column()
  setNumber: number;

  @Column('float')
  weight: number;

  @Column('int')
  reps: number;

  @Column('float', { nullable: true })
  rpe: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
