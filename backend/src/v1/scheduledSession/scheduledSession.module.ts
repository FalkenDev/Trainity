import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledSession } from './scheduledSession.entity';
import { ScheduledSessionService } from './scheduledSession.service';
import { ScheduledSessionController } from './scheduledSession.controller';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';
import { Workout } from '../workout/workout.entity';
import { Activity } from '../activity/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduledSession,
      WorkoutSession,
      ActivityLog,
      Workout,
      Activity,
    ]),
  ],
  controllers: [ScheduledSessionController],
  providers: [ScheduledSessionService],
  exports: [ScheduledSessionService, TypeOrmModule],
})
export class ScheduledSessionModule {}
