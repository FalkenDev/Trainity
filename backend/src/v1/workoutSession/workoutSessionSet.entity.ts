import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';

@Entity()
export class WorkoutSessionSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutSessionExercise, (ex) => ex.sets, {
    onDelete: 'CASCADE',
  })
  sessionExercise: WorkoutSessionExercise;

  @Column()
  setNumber: number;

  @Column()
  weight: number;

  @Column()
  reps: number;

  @Column({ nullable: true })
  rpe: number;

  @Column({ nullable: true })
  notes: string;
}
