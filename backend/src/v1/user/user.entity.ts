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

  // Onboarding & Preferences
  @Column({ type: 'varchar', length: 20, nullable: true })
  unitScale: string; // 'metric' or 'imperial'

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  primaryGoal: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  targetWeight: number;

  @Column({ type: 'int', nullable: true })
  goalTimeframe: number; // in weeks

  @Column({ default: false })
  onboardingCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.createdBy)
  exercises: Exercise[];

  @OneToMany(() => Workout, (workout) => workout.createdBy)
  workouts: Workout[];
}
