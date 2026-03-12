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

import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsString()
  unitScale?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  primaryGoal?: string;

  @IsOptional()
  @IsNumber()
  weeklyWorkoutGoal?: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  targetWeight?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  goalTimeframe?: number | null;

  @IsOptional()
  @IsBoolean()
  showRpe?: boolean;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  showWeightTracking?: boolean;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  weightGoalType?: string | null;

  @IsOptional()
  @IsNumber()
  startWeight?: number;
}
