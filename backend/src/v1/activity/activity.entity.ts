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
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum ActivityIcon {
  RUNNING = 'running',
  WALKING = 'walking',
  CYCLING = 'cycling',
  FOOTBALL = 'football',
  SWIMMING = 'swimming',
  KAYAKING = 'kayaking',
  HIKING = 'hiking',
  YOGA = 'yoga',
  BOXING = 'boxing',
  TENNIS = 'tennis',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  SKIING = 'skiing',
  SKATING = 'skating',
  ROWING = 'rowing',
  OTHER = 'other',
}

@Entity()
@Unique(['name', 'createdBy'])
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ActivityIcon,
    default: ActivityIcon.OTHER,
  })
  icon: ActivityIcon;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @Column({ type: 'simple-array', nullable: true })
  equipment?: string[];

  // Configuration flags for which fields to track
  @Column({ default: false })
  trackDistance: boolean;

  @Column({ default: false })
  trackPace: boolean;

  @Column({ default: false })
  trackElevation: boolean;

  @Column({ default: false })
  trackCalories: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
