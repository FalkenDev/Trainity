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

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../exercise/exercise.entity';

@Entity()
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.exercises, {
    onDelete: 'CASCADE',
  })
  workout: Workout;

  @ManyToOne(() => Exercise, { eager: true })
  exercise: Exercise;

  @Column()
  order: number;

  @Column()
  sets: number;

  @Column()
  reps: number;

  @Column()
  weight: number;

  @Column()
  pauseSeconds: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance?: number;
}
