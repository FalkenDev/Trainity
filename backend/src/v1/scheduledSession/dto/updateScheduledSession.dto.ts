import { PartialType } from '@nestjs/swagger';
import { CreateScheduledSessionDto } from './createScheduledSession.dto';

export class UpdateScheduledSessionDto extends PartialType(
  CreateScheduledSessionDto,
) {}
