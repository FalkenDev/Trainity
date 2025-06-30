import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './user/user.entity';
import { Exercise } from './exercise/exercise.entity';
import { Workout } from './workout/workout.entity';
import { WorkoutExercise } from './workout/workoutExercise.entity';
import { WorkoutSession } from './workoutSession/workoutSession.entity';
import { MuscleGroup } from './muscleGroup/muscleGroup.entity';
import { WorkoutSessionExercise } from './workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSession/workoutSessionSet.entity';

// Load .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'trainitydb',
  synchronize: true,
  logging: false,
  entities: [
    User,
    MuscleGroup,
    Exercise,
    Workout,
    WorkoutExercise,
    WorkoutSession,
    WorkoutSessionExercise,
    WorkoutSessionSet,
  ],
});
