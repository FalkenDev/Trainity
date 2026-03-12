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
import { WeightLog } from './weightLog.entity';
import { User } from '../user/user.entity';
import { WeightLogService } from './weightLog.service';
import { WeightLogController } from './weightLog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeightLog, User])],
  controllers: [WeightLogController],
  providers: [WeightLogService],
  exports: [WeightLogService],
})
export class WeightLogModule {}
