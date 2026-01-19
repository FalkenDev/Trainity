import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './createActivity.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
