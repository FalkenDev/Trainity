import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExerciseType } from '../exercise.entity';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Bench Press' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Push movement for chest', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: 'compound',
    enum: ExerciseType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExerciseType)
  exerciseType?: ExerciseType;

  @ApiProperty({
    example: [1, 2],
    description: 'Array of muscle group IDs',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  muscleGroupIds?: number[];

  @ApiProperty({
    example: 1,
    description: 'Primary muscle group ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  primaryMuscleGroupId?: number;

  @ApiProperty({
    example: ['Barbell', 'Bench'],
    description: 'Equipment needed',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @ApiProperty({
    example: ['Lie flat on bench', 'Grip the bar'],
    description: 'Step-by-step instructions',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions?: string[];

  @ApiProperty({
    example: ['Keep shoulder blades retracted'],
    description: 'Pro tips',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  proTips?: string[];

  @ApiProperty({
    example: ['Do not bounce the bar off chest'],
    description: 'Common mistakes to avoid',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mistakes?: string[];

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultSets?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultReps?: number;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultPauseSeconds?: number;
}
