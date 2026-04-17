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

import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class PrimaryMuscleGroupSnapshotDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;
}

export class ExerciseSnapshotDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [PrimaryMuscleGroupSnapshotDto] })
  primaryMuscleGroups!: PrimaryMuscleGroupSnapshotDto[];

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups!: MuscleGroupResponseDto[];
}

export class WorkoutExerciseSnapshotDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  sets!: number;

  @ApiProperty()
  reps!: number;

  @ApiProperty()
  weight!: number;

  @ApiProperty()
  pauseSeconds!: number;

  @ApiProperty({ type: ExerciseSnapshotDto })
  exercise!: ExerciseSnapshotDto;
}
