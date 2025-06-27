import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './createWorkout.dto';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {}
