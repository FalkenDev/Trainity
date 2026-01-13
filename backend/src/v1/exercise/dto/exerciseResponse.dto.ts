import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class ExerciseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Optional i18n key for the exercise name',
  })
  i18nKey?: string;

  @ApiProperty({
    required: false,
    description: 'If true, the user has overridden the default translated name',
  })
  isNameCustom?: boolean;

  @ApiProperty({
    required: false,
    description:
      'If created from a global exercise, this is the source globalExercise id',
  })
  globalExerciseId?: number;

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
