import {
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
  IsString,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduledSessionType } from '../scheduledSession.entity';

export class CreateScheduledSessionDto {
  @ApiProperty({
    enum: ScheduledSessionType,
    description: 'Type of session to schedule',
  })
  @IsEnum(ScheduledSessionType)
  type: ScheduledSessionType;

  @ApiProperty({ example: 1, description: 'Workout ID', required: false })
  @ValidateIf((o) => o.type === ScheduledSessionType.WORKOUT)
  @IsInt()
  workoutId?: number;

  @ApiProperty({ example: 1, description: 'Activity ID', required: false })
  @ValidateIf((o) => o.type === ScheduledSessionType.ACTIVITY)
  @IsInt()
  activityId?: number;

  @ApiProperty({
    example: '2026-02-15',
    description: 'Scheduled date (YYYY-MM-DD) for one-time',
    required: false,
  })
  @ValidateIf((o) => !o.isRecurring)
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({
    example: 0,
    description: 'Day of week for recurring (0=Mon, 6=Sun)',
    required: false,
  })
  @ValidateIf((o) => o.isRecurring)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiProperty({ example: false, description: 'Whether this is recurring' })
  @IsBoolean()
  isRecurring: boolean;

  @ApiProperty({ example: 'Leg day', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
