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

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups: MuscleGroupResponseDto[];
}
