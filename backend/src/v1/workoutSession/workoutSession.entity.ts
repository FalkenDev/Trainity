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
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';
import { ScheduledSession } from '../scheduledSession/scheduledSession.entity';

@Entity()
export class WorkoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workout, { onDelete: 'SET NULL', nullable: true })
  workout: Workout | null;

  @ManyToOne(() => ScheduledSession, { onDelete: 'SET NULL', nullable: true })
  scheduledSession: ScheduledSession | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({
    type: 'enum',
    enum: ['in_progress', 'finished', 'abandoned'],
    default: 'in_progress',
  })
  status: 'in_progress' | 'finished' | 'abandoned';

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @OneToMany(() => WorkoutSessionExercise, (ex) => ex.session, {
    cascade: true,
    eager: true,
  })
  exercises: WorkoutSessionExercise[];

  @Column({ default: 0 })
  totalWeight: number;

  @Column({ type: 'jsonb', nullable: true })
  exerciseStats: { exerciseId: number; totalWeight: number }[];

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'int', nullable: true })
  caloriesBurned: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
