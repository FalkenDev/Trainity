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

import { IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';

export class ExerciseProgressQueryDto {
  @IsEnum(['estimated_1rm', 'max_weight', 'total_volume', 'max_reps'])
  metric: 'estimated_1rm' | 'max_weight' | 'total_volume' | 'max_reps';

  @IsOptional()
  @IsEnum(['1m', '3m', '6m', '1y', 'all'])
  period?: '1m' | '3m' | '6m' | '1y' | 'all' = 'all';
}

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  page?: string = '1';

  @IsOptional()
  @IsString()
  limit?: string = '20';
}

export class WeeklyTrendsQueryDto {
  @IsOptional()
  @IsNumberString()
  weeks?: string = '12';
}

export class HeatmapQueryDto {
  @IsOptional()
  @IsNumberString()
  weeks?: string = '12';
}
