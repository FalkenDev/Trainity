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

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityIcon } from '../activity.entity';

export class CreateActivityDto {
  @ApiProperty({ example: 'Running' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Outdoor running sessions', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ActivityIcon, example: ActivityIcon.RUNNING })
  @IsEnum(ActivityIcon)
  icon: ActivityIcon;

  @ApiProperty({ example: ['Bicycle', 'Helmet'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @ApiProperty({ example: true, description: 'Track distance in kilometers' })
  @IsBoolean()
  trackDistance: boolean;

  @ApiProperty({ example: true, description: 'Track pace (min/km)' })
  @IsBoolean()
  trackPace: boolean;

  @ApiProperty({
    example: true,
    description: 'Track elevation gain and max elevation',
  })
  @IsBoolean()
  trackElevation: boolean;

  @ApiProperty({ example: true, description: 'Track calories burned' })
  @IsBoolean()
  trackCalories: boolean;
}
