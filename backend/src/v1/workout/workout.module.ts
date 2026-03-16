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

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { WorkoutExercise } from './workoutExercise.entity';
import { WorkoutSessionModule } from '../workoutSession/workoutSession.module';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutExercise, MuscleGroup]),
    forwardRef(() => WorkoutSessionModule),
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [TypeOrmModule],
})
export class WorkoutModule {}
