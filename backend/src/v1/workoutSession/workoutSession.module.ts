import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';
import { WorkoutSessionController } from './workoutSession.controller';
import { WorkoutSessionService } from './workoutSession.service';
import { WorkoutModule } from '../workout/workout.module';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkoutSession,
      WorkoutSessionExercise,
      WorkoutSessionSet,
    ]),
    forwardRef(() => WorkoutModule),
    ExerciseModule,
  ],
  providers: [WorkoutSessionService],
  controllers: [WorkoutSessionController],
  exports: [TypeOrmModule],
})
export class WorkoutSessionModule {}
