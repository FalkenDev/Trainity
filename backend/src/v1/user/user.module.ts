import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Exercise } from '../exercise/exercise.entity';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Exercise,
      Workout,
      WorkoutSession,
      ActivityLog,
    ]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
