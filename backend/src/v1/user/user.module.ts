import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Exercise } from '../exercise/exercise.entity';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Exercise, Workout, WorkoutSession]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
