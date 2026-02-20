import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
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

  @ApiPropertyOptional({
    example: 450,
    description: 'Calories burned during the session',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  caloriesBurned?: number;
}
