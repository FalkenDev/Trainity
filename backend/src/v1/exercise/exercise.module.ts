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
import { ExerciseService } from './exercise.service';
import { ExerciseSeedService } from './exerciseSeed.service';
import { ExerciseController } from './exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseMedia } from './exerciseMedia.entity';
import { MuscleGroupModule } from '../muscleGroup/muscleGroup.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, ExerciseMedia]),
    MuscleGroupModule,
    UploadModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseSeedService],
  exports: [TypeOrmModule, ExerciseService, ExerciseSeedService],
})
export class ExerciseModule {}
