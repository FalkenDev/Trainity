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

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
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
