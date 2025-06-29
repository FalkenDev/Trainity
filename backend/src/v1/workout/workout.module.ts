import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { WorkoutExercise } from './workoutExercise.entity';
import { WorkoutSessionModule } from '../workoutSession/workoutSession.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutExercise]),
    forwardRef(() => WorkoutSessionModule),
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [TypeOrmModule],
})
export class WorkoutModule {}
