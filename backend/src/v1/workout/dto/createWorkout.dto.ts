import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';

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

  @ApiProperty({
    example: 'strength',
    required: false,
    enum: ['strength', 'cardio', 'hiit', 'flexibility', 'endurance'],
  })
  @IsOptional()
  @IsEnum(['strength', 'cardio', 'hiit', 'flexibility', 'endurance'])
  type?: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'endurance';

  @ApiProperty({ example: 'default', required: false })
  @IsOptional()
  defaultWeightAndReps?: 'default' | 'latest';

  @ApiProperty({
    example: [1, 2],
    required: false,
    description: 'Array of muscle group IDs to set as workout target muscles',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  targetMuscleGroupIds?: number[];
}
