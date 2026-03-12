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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Exercise } from '../exercise/exercise.entity';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Exercise,
      Workout,
      WorkoutSession,
      ActivityLog,
    ]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
