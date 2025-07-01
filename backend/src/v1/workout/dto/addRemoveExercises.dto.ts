import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AddRemoveExercisesDto {
  @ApiProperty({
    description: 'An array of exercise IDs to add or remove from the workout',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  exerciseIds: number[];
}
