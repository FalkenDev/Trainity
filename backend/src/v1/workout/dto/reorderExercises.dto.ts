import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ExerciseOrder {
  @ApiProperty({ description: 'The workout exercise ID', example: 1 })
  @IsNumber()
  workoutExerciseId: number;

  @ApiProperty({ description: 'The new order position', example: 1 })
  @IsNumber()
  order: number;
}

export class ReorderExercisesDto {
  @ApiProperty({
    description: 'Array of exercises with their new order positions',
    type: [ExerciseOrder],
    example: [
      { workoutExerciseId: 3, order: 1 },
      { workoutExerciseId: 1, order: 2 },
      { workoutExerciseId: 2, order: 3 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseOrder)
  exercises: ExerciseOrder[];
}
