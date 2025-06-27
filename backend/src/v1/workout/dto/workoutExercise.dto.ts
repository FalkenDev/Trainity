import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WorkoutExerciseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  sets: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  reps: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  pauseSeconds: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  exerciseId: number;
}
