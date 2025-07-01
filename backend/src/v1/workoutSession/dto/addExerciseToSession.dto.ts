import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SetDto {
  @IsNumber()
  setNumber: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  rpe?: number;

  notes?: string;
}

export class AddExerciseToSessionDto {
  @IsNumber()
  exerciseId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetDto)
  sets: SetDto[];
}
