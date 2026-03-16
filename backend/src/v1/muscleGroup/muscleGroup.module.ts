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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroup } from './muscleGroup.entity';
import { MuscleGroupService } from './muscleGroup.service';
import { MuscleGroupController } from './muscleGroup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MuscleGroup])],
  providers: [MuscleGroupService],
  controllers: [MuscleGroupController],
  exports: [MuscleGroupService],
})
export class MuscleGroupModule {}
