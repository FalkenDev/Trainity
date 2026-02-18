import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { WorkoutExercise } from './workoutExercise.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

export enum WorkoutType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  HIIT = 'hiit',
  FLEXIBILITY = 'flexibility',
  ENDURANCE = 'endurance',
}

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

  @Column({ type: 'enum', enum: WorkoutType, nullable: true })
  type?: WorkoutType;

  @Column({
    type: 'enum',
    enum: ['default', 'latest'],
    default: 'default',
  })
  defaultWeightAndReps: 'default' | 'latest';

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToMany(() => MuscleGroup, { eager: false })
  @JoinTable({ name: 'workout_target_muscle_groups' })
  targetMuscleGroups: MuscleGroup[];

  @OneToMany(() => WorkoutExercise, (we) => we.workout, {
    cascade: true,
    eager: true,
  })
  exercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
