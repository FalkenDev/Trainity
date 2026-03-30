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
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum ActivityIcon {
  RUNNING = 'run',
  WALKING = 'walk',
  CYCLING = 'bike',
  FOOTBALL = 'soccer',
  SWIMMING = 'swim',
  KAYAKING = 'kayaking',
  HIKING = 'hiking',
  YOGA = 'yoga',
  BOXING = 'boxing-glove',
  TENNIS = 'tennis',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  SKIING = 'ski',
  SKATING = 'skate',
  ROWING = 'rowing',
  WEIGHTLIFTING = 'weight-lifter',
  GOLF = 'golf',
  RUGBY = 'rugby',
  HOCKEY = 'hockey-sticks',
  DANCE = 'dance-ballroom',
  OTHER = 'dots-horizontal',
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
