import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class ImportGlobalExercisesDto {
  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  globalExerciseIds: number[];
}
