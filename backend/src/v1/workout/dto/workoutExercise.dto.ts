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

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WorkoutExerciseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  sets: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  reps: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  pauseSeconds: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  exerciseId: number;
}
