import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './activityLog.entity';
import { Activity } from '../activity/activity.entity';
import { ActivityLogService } from './activityLog.service';
import { ActivityLogController } from './activityLog.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog, Activity]),
    forwardRef(() => UserModule),
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
