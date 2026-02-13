import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';
import { ExerciseType } from '../exercise.entity';

export class ExerciseMediaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['image', 'video'] })
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  order: number;
}

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

  @ApiProperty({ required: false, enum: ExerciseType })
  exerciseType?: ExerciseType;

  @ApiProperty({ required: false })
  defaultSets?: number;

  @ApiProperty({ required: false })
  defaultReps?: number;

  @ApiProperty({ required: false })
  defaultPauseSeconds?: number;

  @ApiProperty({ required: false, type: [String] })
  equipment?: string[];

  @ApiProperty({ required: false, type: [String] })
  instructions?: string[];

  @ApiProperty({ required: false, type: [String] })
  proTips?: string[];

  @ApiProperty({ required: false, type: [String] })
  mistakes?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ type: MuscleGroupResponseDto, required: false })
  primaryMuscleGroup?: MuscleGroupResponseDto;

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups: MuscleGroupResponseDto[];

  @ApiProperty({ type: [ExerciseMediaResponseDto] })
  media: ExerciseMediaResponseDto[];
}
