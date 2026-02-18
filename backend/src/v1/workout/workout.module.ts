import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { WorkoutExercise } from './workoutExercise.entity';
import { WorkoutSessionModule } from '../workoutSession/workoutSession.module';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutExercise, MuscleGroup]),
    forwardRef(() => WorkoutSessionModule),
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [TypeOrmModule],
})
export class WorkoutModule {}
