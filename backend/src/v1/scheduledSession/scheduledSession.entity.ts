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
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Workout } from '../workout/workout.entity';
import { Activity } from '../activity/activity.entity';

export enum ScheduledSessionType {
  WORKOUT = 'workout',
  ACTIVITY = 'activity',
}

@Entity()
export class ScheduledSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workout, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  workout: Workout | null;

  @ManyToOne(() => Activity, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  activity: Activity | null;

  @Column({
    type: 'enum',
    enum: ScheduledSessionType,
  })
  type: ScheduledSessionType;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date | null;

  @Column({ type: 'int', nullable: true })
  dayOfWeek: number | null; // 0=Mon, 1=Tue, ..., 6=Sun

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  exceptionDates: string[]; // YYYY-MM-DD strings for skipped recurring occurrences

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'date', nullable: true })
  recurringEndDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
