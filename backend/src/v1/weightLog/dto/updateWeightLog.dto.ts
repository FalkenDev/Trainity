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

import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWeightLogDto {
  @ApiProperty({ example: 81.0, required: false, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiProperty({ example: 'Corrected entry', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
