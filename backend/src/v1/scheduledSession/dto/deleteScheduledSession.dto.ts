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

import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DeleteType {
  THIS = 'this',
  ALL = 'all',
}

export class DeleteScheduledSessionDto {
  @ApiProperty({
    enum: DeleteType,
    description:
      '"this" to delete single occurrence, "all" to delete entire schedule',
  })
  @IsEnum(DeleteType)
  deleteType: DeleteType;

  @ApiProperty({
    example: '2026-02-10',
    description:
      'The specific date to exclude (required when deleteType is "this")',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  occurrenceDate?: string;
}
