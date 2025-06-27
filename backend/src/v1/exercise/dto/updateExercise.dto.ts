import { PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from './createExercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
