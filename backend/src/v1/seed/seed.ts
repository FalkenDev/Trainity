import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from '../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutExercise } from '../workout/workoutExercise.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from '../workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from '../workoutSession/workoutSessionSet.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';
import { Activity } from '../activity/activity.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';

// Seeders
import { seedUsers } from './seeders/users.seeder';
import { seedMuscleGroups } from './seeders/muscleGroups.seeder';
import { seedUserExercises } from './seeders/exercises.seeder';
import { seedActivities } from './seeders/activities.seeder';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'trainitydb',
  entities: [
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    WorkoutSession,
    WorkoutSessionExercise,
    WorkoutSessionSet,
    MuscleGroup,
    Activity,
    ActivityLog,
  ],
  // Keep in sync with app.module.ts (synchronize: true). This makes the seed script
  // resilient when we add new entities.
  synchronize: true,
  logging: ['error', 'warn', 'query'],
});

async function seed() {
  await AppDataSource.initialize();
  console.log(
    '✅ Database connected:',
    AppDataSource.options.type,
    AppDataSource.options.database,
  );

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // Clear tables respecting FKs
    await AppDataSource.query(
      `
      TRUNCATE TABLE
        "workout_session_set",
        "workout_session_exercise",
        "workout_session",
        "workout_exercise",
        "workout",
        "exercise_muscle_groups_muscle_group",
        "activity_log" RESTART IDENTITY CASCADE;
    `,
    ).catch(() => {});

    await AppDataSource.query(`
      TRUNCATE TABLE
        "exercise",
        "muscle_group",
        "activity",
        "user" RESTART IDENTITY CASCADE;
    `);

    console.log('🧹 Cleared existing data');

    // Seed users
    const createdUsers = await seedUsers(AppDataSource);
    const mainUser = createdUsers[0];

    // Seed muscle groups
    const mgMap = await seedMuscleGroups(AppDataSource);

    // Seed default exercises for the test user
    await seedUserExercises(AppDataSource, mgMap, mainUser);

    // Seed default activities for test user
    await seedActivities(AppDataSource, mainUser);

    await queryRunner.commitTransaction();
    console.log('✅ Database successfully seeded!');
    process.exit(0);
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed().catch((e) => {
  console.error('❌ Unhandled seeding error:', e);
  process.exit(1);
});
