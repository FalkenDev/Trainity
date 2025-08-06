import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { User } from '../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutExercise } from '../workout/workoutExercise.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from '../workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from '../workoutSession/workoutSessionSet.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

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
  ],
  synchronize: false,
  logging: ['error', 'warn', 'query'],
});

const usersToSeed = [
  {
    email: 'test@test.se',
    password: 'test1234',
    firstName: 'Seed',
    lastName: 'User',
    avatar: 'https://i.pravatar.cc/150?u=seeduser',
  },
];

const muscleGroupsToSeed = [
  { name: 'Chest' },
  { name: 'Back' },
  { name: 'Shoulders' },
  { name: 'Biceps' },
  { name: 'Triceps' },
  { name: 'Legs' },
  { name: 'Abs' },
  { name: 'Forearms' },
];

const exercisesToSeed = [
  {
    name: 'Bench Press',
    description: 'A compound exercise for the upper body.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Pull Up',
    description: 'A compound exercise for the back and biceps.',
    muscleGroups: ['Back', 'Biceps'],
    defaultSets: 3,
    defaultReps: 8,
    defaultPauseSeconds: 75,
  },
  {
    name: 'Squat',
    description: 'The king of all leg exercises.',
    muscleGroups: ['Legs'],
    defaultSets: 4,
    defaultReps: 12,
    defaultPauseSeconds: 90,
  },
  {
    name: 'Overhead Press',
    description: 'A compound exercise for the shoulders.',
    muscleGroups: ['Shoulders', 'Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Plank',
    description: 'A core stability exercise.',
    muscleGroups: ['Abs'],
    defaultSets: 3,
    defaultReps: 1,
    defaultPauseSeconds: 45,
  },
];

const workoutsToSeed = [
  {
    title: 'Full Body Strength A',
    description: 'A balanced workout hitting all major muscle groups.',
    time: 60,
    exercises: [
      {
        exerciseName: 'Squat',
        order: 1,
        sets: 4,
        reps: 10,
        weight: 60,
        pauseSeconds: 90,
      },
      {
        exerciseName: 'Bench Press',
        order: 2,
        sets: 3,
        reps: 10,
        weight: 50,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Pull Up',
        order: 3,
        sets: 3,
        reps: 8,
        weight: 0,
        pauseSeconds: 75,
      },
    ],
  },
  {
    title: 'Upper Body Focus',
    description: 'Focus on building upper body strength and size.',
    time: 45,
    exercises: [
      {
        exerciseName: 'Overhead Press',
        order: 1,
        sets: 3,
        reps: 8,
        weight: 30,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Pull Up',
        order: 2,
        sets: 4,
        reps: 6,
        weight: 0,
        pauseSeconds: 75,
      },
      {
        exerciseName: 'Bench Press',
        order: 3,
        sets: 3,
        reps: 12,
        weight: 45,
        pauseSeconds: 60,
      },
    ],
  },
];

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
        "exercise_muscle_groups_muscle_group" RESTART IDENTITY CASCADE;
    `,
    ).catch(() => {});

    await AppDataSource.query(`
      TRUNCATE TABLE
        "exercise",
        "muscle_group",
        "user" RESTART IDENTITY CASCADE;
    `);

    console.log('🧹 Cleared existing data');

    const userRepo = AppDataSource.getRepository(User);
    const mgRepo = AppDataSource.getRepository(MuscleGroup);
    const exRepo = AppDataSource.getRepository(Exercise);
    const workoutRepo = AppDataSource.getRepository(Workout);
    const workoutExerciseRepo = AppDataSource.getRepository(WorkoutExercise);

    // Users
    const createdUsers: User[] = [];
    for (const u of usersToSeed) {
      const password = await bcrypt.hash(u.password, 10);
      const user = userRepo.create({ ...u, password });
      await userRepo.save(user);
      createdUsers.push(user);
    }
    const mainUser = createdUsers[0];
    console.log(`👤 Seeded user: ${mainUser.email}`);

    // Muscle groups
    const savedMGs = await mgRepo.save(muscleGroupsToSeed);
    const mgMap = new Map<string, MuscleGroup>();
    savedMGs.forEach((mg) => mgMap.set(mg.name, mg));
    console.log('💪 Seeded muscle groups');

    // Exercises
    const createdExercises: Exercise[] = [];
    for (const ex of exercisesToSeed) {
      const exercise = exRepo.create({
        name: ex.name,
        description: ex.description,
        muscleGroups: ex.muscleGroups
          .map((name) => mgMap.get(name))
          .filter((mg): mg is MuscleGroup => !!mg),
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps,
        defaultPauseSeconds: ex.defaultPauseSeconds,
        createdBy: mainUser,
      });
      await exRepo.save(exercise);
      createdExercises.push(exercise);
    }
    const exerciseMap = new Map<string, Exercise>();
    createdExercises.forEach((e) => exerciseMap.set(e.name, e));
    console.log('🏋️ Seeded exercises');

    // Workouts and WorkoutExercises
    for (const w of workoutsToSeed) {
      const workout = workoutRepo.create({
        title: w.title,
        description: w.description,
        time: w.time,
        createdBy: mainUser,
      });
      await workoutRepo.save(workout);

      for (const e of w.exercises) {
        const exercise = exerciseMap.get(e.exerciseName);
        if (!exercise)
          throw new Error(`Exercise "${e.exerciseName}" not found`);
        const we = workoutExerciseRepo.create({
          workout,
          exercise,
          order: e.order,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          pauseSeconds: e.pauseSeconds,
        });
        await workoutExerciseRepo.save(we);
      }
    }
    console.log('📅 Seeded workouts');

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
