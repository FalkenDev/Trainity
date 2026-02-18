import { ApiProperty } from '@nestjs/swagger';
import { WorkoutExerciseSnapshotDto } from './workoutExerciseSnapshot.dto';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class WorkoutResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  time?: number;

  @ApiProperty({
    required: false,
    enum: ['strength', 'cardio', 'hiit', 'flexibility', 'endurance'],
  })
  type?: string;

  @ApiProperty()
  defaultWeightAndReps: 'default' | 'latest';

  @ApiProperty({ type: [WorkoutExerciseSnapshotDto], required: false })
  exercises?: WorkoutExerciseSnapshotDto[];

  @ApiProperty({ type: [MuscleGroupResponseDto], required: false })
  targetMuscleGroups?: MuscleGroupResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
