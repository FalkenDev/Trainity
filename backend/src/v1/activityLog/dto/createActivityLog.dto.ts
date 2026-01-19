import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty({ example: 1, description: 'Activity ID' })
  @IsInt()
  @IsNotEmpty()
  activityId: number;

  @ApiProperty({
    example: '2026-01-19',
    description: 'Date of the activity (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 45, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    example: 8.5,
    description: 'Distance in kilometers',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number;

  @ApiProperty({
    example: 150,
    description: 'Elevation gain in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  elevationGain?: number;

  @ApiProperty({
    example: 320,
    description: 'Max elevation in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxElevation?: number;

  @ApiProperty({
    example: 450,
    description: 'Calories burned',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiProperty({ example: 'Great morning run!', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
