import { ApiProperty } from '@nestjs/swagger';

export class WorkoutExerciseSnapshotDto {
  @ApiProperty()
  order: number;

  @ApiProperty()
  sets: number;

  @ApiProperty()
  reps: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  pauseSeconds: number;

  @ApiProperty()
  exercise: {
    id: number;
    name: string;
    description?: string;
  };
}
