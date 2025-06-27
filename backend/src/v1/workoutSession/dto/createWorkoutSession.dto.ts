import { IsNumber } from 'class-validator';

export class CreateWorkoutSessionDto {
  @IsNumber()
  workoutId: number;
}
