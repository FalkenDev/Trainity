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
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Activity } from '../activity/activity.entity';
import { ScheduledSession } from '../scheduledSession/scheduledSession.entity';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Activity, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  activity: Activity | null;

  @ManyToOne(() => ScheduledSession, { onDelete: 'SET NULL', nullable: true })
  scheduledSession: ScheduledSession | null;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  duration: number; // in minutes

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance?: number; // in kilometers

  @Column({ nullable: true })
  pace?: string; // formatted as "5:30/km"

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  elevationGain?: number; // in meters

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  maxElevation?: number; // in meters

  @Column({ nullable: true })
  calories?: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
