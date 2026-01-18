import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';
import { Workout } from '../workout/workout.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 50, nullable: true })
  firstName: string;

  @Column({ length: 50, nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  showRpe: boolean;

  @Column({ default: 3 })
  weeklyWorkoutGoal: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ type: 'timestamp', nullable: true })
  lastStreakCheckDate: Date;

  @Column({ default: 0 })
  currentWeekWorkouts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.createdBy)
  exercises: Exercise[];

  @OneToMany(() => Workout, (workout) => workout.createdBy)
  workouts: Workout[];
}
