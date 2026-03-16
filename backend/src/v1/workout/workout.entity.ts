/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
