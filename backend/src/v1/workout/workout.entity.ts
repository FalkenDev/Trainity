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

  @Column()
  time: number;

  @Column({
    type: 'enum',
    enum: ['default', 'latest', 'exercise'],
    default: 'default',
  })
  defaultWeightAndReps: 'default' | 'latest' | 'exercise';

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
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
