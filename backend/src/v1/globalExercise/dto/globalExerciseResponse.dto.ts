import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroupResponseDto } from 'src/v1/muscleGroup/dto/muscleGroupResponse.dto';

export class GlobalExerciseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'Stable key for i18n, e.g. "exercise.bench_press"',
  })
  i18nKey: string;

  @ApiProperty({
    description: 'Fallback name when no translation is available',
  })
  defaultName: string;

  @ApiProperty({ required: false })
  defaultDescription?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  defaultSets?: number;

  @ApiProperty({ required: false })
  defaultReps?: number;

  @ApiProperty({ required: false })
  defaultPauseSeconds?: number;

  @ApiProperty({ type: [MuscleGroupResponseDto] })
  muscleGroups: MuscleGroupResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
