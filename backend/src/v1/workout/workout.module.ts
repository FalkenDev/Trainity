import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Exercise, WorkoutSession])],
  providers: [WorkoutService],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
