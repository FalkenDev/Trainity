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
import { ActivityResponseDto } from '../../activity/dto/activityResponse.dto';

export class ActivityLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: ActivityResponseDto })
  activity: ActivityResponseDto;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  duration: number;

  @ApiProperty({ required: false })
  distance?: number;

  @ApiProperty({ required: false })
  pace?: string;

  @ApiProperty({ required: false })
  elevationGain?: number;

  @ApiProperty({ required: false })
  maxElevation?: number;

  @ApiProperty({ required: false })
  calories?: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;
}
