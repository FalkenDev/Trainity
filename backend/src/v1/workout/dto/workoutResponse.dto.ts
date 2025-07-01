import { ApiProperty } from '@nestjs/swagger';
import { WorkoutExerciseSnapshotDto } from './workoutExerciseSnapshot.dto';

export class WorkoutResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  time?: number;

  @ApiProperty()
  defaultWeightAndReps: 'default' | 'latest' | 'exercise';

  @ApiProperty({ type: [WorkoutExerciseSnapshotDto], required: false })
  exercises?: WorkoutExerciseSnapshotDto[];

  @ApiProperty()
  createdAt: Date;
}
