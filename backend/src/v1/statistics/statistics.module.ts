import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { ExerciseRecord } from './exerciseRecord.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from '../workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from '../workoutSession/workoutSessionSet.entity';
import { Exercise } from '../exercise/exercise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseRecord,
      WorkoutSession,
      WorkoutSessionExercise,
      WorkoutSessionSet,
      Exercise,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
