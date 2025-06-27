import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Exercise } from './exercise/exercise.entity';
import { Workout } from './workout/workout.entity';
import { WorkoutExercise } from './workout/workoutExercise.entity';
import { WorkoutSession } from './workoutSession/workoutSession.entity';
import { MuscleGroup } from './muscleGroup/muscleGroup.entity';
import { WorkoutSessionExercise } from './workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSession/workoutSessionSet.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // or 'mysql', 'sqlite', etc
  host: 'localhost',
  port: 5432,
  username: 'postgres', // or your DB user
  password: 'password', // your password
  database: 'fitness_db', // your DB name
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
