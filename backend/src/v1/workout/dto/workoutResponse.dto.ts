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
import { WorkoutExerciseSnapshotDto } from './workoutExerciseSnapshot.dto';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class WorkoutResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  time?: number;

  @ApiProperty({
    required: false,
    enum: ['strength', 'cardio', 'hiit', 'flexibility', 'endurance'],
  })
  type?: string;

  @ApiProperty()
  defaultWeightAndReps: 'default' | 'latest';

  @ApiProperty({ type: [WorkoutExerciseSnapshotDto], required: false })
  exercises?: WorkoutExerciseSnapshotDto[];

  @ApiProperty({ type: [MuscleGroupResponseDto], required: false })
  targetMuscleGroups?: MuscleGroupResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
