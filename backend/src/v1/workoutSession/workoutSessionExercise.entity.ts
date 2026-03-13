/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutSession } from './workoutSession.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';

@Entity()
export class WorkoutSessionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutSession, (session) => session.exercises, {
    onDelete: 'CASCADE',
  })
  session: WorkoutSession;

  @ManyToOne(() => Exercise, { nullable: true, onDelete: 'SET NULL' })
  exercise: Exercise;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => WorkoutSessionSet, (set) => set.sessionExercise, {
    cascade: true,
    eager: true,
  })
  sets: WorkoutSessionSet[];

  @Column({ nullable: true })
  notes?: string;
}
