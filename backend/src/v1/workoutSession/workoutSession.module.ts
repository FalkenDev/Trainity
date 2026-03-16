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
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';
import { WorkoutSessionController } from './workoutSession.controller';
import { WorkoutSessionService } from './workoutSession.service';
import { WorkoutModule } from '../workout/workout.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { UserModule } from '../user/user.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkoutSession,
      WorkoutSessionExercise,
      WorkoutSessionSet,
    ]),
    forwardRef(() => WorkoutModule),
    forwardRef(() => UserModule),
    ExerciseModule,
    StatisticsModule,
  ],
  providers: [WorkoutSessionService],
  controllers: [WorkoutSessionController],
  exports: [TypeOrmModule],
})
export class WorkoutSessionModule {}
