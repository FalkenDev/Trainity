import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class ExerciseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  defaultSets?: number;

  @ApiProperty({ required: false })
  defaultReps?: number;

  @ApiProperty({ required: false })
  defaultPauseSeconds?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups: MuscleGroupResponseDto[];
}
