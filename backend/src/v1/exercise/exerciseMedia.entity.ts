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
import { Exercise } from './exercise.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class ExerciseMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column()
  url: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.media, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise;

  @CreateDateColumn()
  createdAt: Date;
}
