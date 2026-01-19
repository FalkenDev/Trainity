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

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  reps: number;

  @Column({ nullable: true })
  rpe: number;

  @Column({ nullable: true })
  notes: string;

  // Cardio exercise fields
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance?: number;

  @Column({ nullable: true })
  duration?: number; // in minutes

  @Column({ nullable: true })
  calories?: number;
}
