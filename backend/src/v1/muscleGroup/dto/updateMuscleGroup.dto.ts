import { PartialType } from '@nestjs/swagger';
import { CreateMuscleGroupDto } from './createMuscleGroup.dto';

export class UpdateMuscleGroupDto extends PartialType(CreateMuscleGroupDto) {}
