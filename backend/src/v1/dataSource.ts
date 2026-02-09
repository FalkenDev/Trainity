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

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'trainitydb',
  synchronize: true,
  logging: ['error', 'warn'],
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
