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

export class WeightLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  weight: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;
}

export class WeightLogStatsDto {
  @ApiProperty({ required: false })
  currentWeight?: number;

  @ApiProperty({ required: false })
  startWeight?: number;

  @ApiProperty({ required: false })
  changeFromStart?: number;

  @ApiProperty({ required: false })
  lastLogWeight?: number;

  @ApiProperty({ required: false })
  changeFromLastLog?: number;

  @ApiProperty({ required: false })
  targetWeight?: number;

  @ApiProperty({ required: false })
  weightGoalType?: string;
}
