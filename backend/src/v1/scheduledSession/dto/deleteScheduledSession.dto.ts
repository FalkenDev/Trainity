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
