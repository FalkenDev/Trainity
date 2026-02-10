import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutSessionDto {
  @IsNumber()
  workoutId: number;

  @IsOptional()
  @IsNumber()
  scheduledSessionId?: number;
}
