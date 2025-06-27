import { IsOptional, IsEnum, IsString, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkoutStatus } from 'src/v1/types/WorkoutStatus.type';

export class UpdateWorkoutSessionDto {
  @ApiPropertyOptional({ enum: ['in_progress', 'finished', 'abandoned'] })
  @IsOptional()
  @IsEnum(WorkoutStatus)
  status?: WorkoutStatus;

  @ApiPropertyOptional({ example: 'Felt good today' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;
}
