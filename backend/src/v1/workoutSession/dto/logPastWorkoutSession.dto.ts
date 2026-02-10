import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LogPastSetDto {
  @IsNumber()
  setNumber: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;
}

export class LogPastExerciseDto {
  @IsNumber()
  exerciseId: number;

  @ValidateNested({ each: true })
  @Type(() => LogPastSetDto)
  @IsArray()
  sets: LogPastSetDto[];
}

export class LogPastWorkoutSessionDto {
  @ApiProperty({ example: 1, description: 'Workout ID', required: false })
  @IsOptional()
  @IsNumber()
  workoutId?: number;

  @ApiProperty({
    example: '2026-01-10T10:00:00.000Z',
    description: 'Start time of the past session',
  })
  @IsDateString()
  startedAt: string;

  @ApiProperty({
    example: '2026-01-10T11:00:00.000Z',
    description: 'End time of the past session',
  })
  @IsDateString()
  endedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, description: 'Linked scheduled session ID' })
  @IsOptional()
  @IsNumber()
  scheduledSessionId?: number;

  @ApiProperty({
    required: false,
    description: 'Completed exercises with sets',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LogPastExerciseDto)
  @IsArray()
  completedExercises?: LogPastExerciseDto[];
}
