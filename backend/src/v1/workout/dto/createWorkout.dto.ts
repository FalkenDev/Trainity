import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Push Day A' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Chest, shoulders, triceps', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 45,
    required: false,
    description: 'Planned workout time in minutes',
  })
  @IsOptional()
  @IsNumber()
  time?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  defaultWeightAndReps: 'default' | 'latest' | 'exercise';
}
