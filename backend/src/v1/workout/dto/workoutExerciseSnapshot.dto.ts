import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class PrimaryMuscleGroupSnapshotDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class ExerciseSnapshotDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: PrimaryMuscleGroupSnapshotDto, required: false })
  primaryMuscleGroup?: PrimaryMuscleGroupSnapshotDto | null;

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups: MuscleGroupResponseDto[];
}

export class WorkoutExerciseSnapshotDto {
  @ApiProperty()
  id: number;

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

  @ApiProperty({ type: ExerciseSnapshotDto })
  exercise: ExerciseSnapshotDto;
}
