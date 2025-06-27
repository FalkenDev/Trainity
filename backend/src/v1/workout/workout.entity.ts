import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { WorkoutExercise } from './workoutExercise.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  time: number;

  @Column({ default: false })
  defaultWeightAndReps: boolean;

  @ManyToOne(() => User, (user) => user.workouts, { onDelete: 'CASCADE' })
  createdBy: User;

  @OneToMany(() => WorkoutExercise, (we) => we.workout, {
    cascade: true,
    eager: true,
  })
  exercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
