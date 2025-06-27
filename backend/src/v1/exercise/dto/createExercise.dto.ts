import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: [1, 2],
    description: 'Array of muscle group IDs',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  muscleGroupIds?: number[];

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
