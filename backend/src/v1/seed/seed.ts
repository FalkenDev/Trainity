import 'reflect-metadata';
import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutExercise } from '../workout/workoutExercise.entity'; // If using join table

import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';
import { AppDataSource } from '../dataSource';

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
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Clear tables
    await AppDataSource.query(`
  TRUNCATE TABLE
    "workout_session_set",
    "workout_session_exercise",
    "workout_session",
    "workout_exercise",
    "workout",
    "exercise",
    "muscle_group",
    "user"
  RESTART IDENTITY CASCADE
`);

    console.log('🧹 Cleared existing data');

    // Seed users
    const userRepo = AppDataSource.getRepository(User);
    const createdUsers = [];

    for (const u of usersToSeed) {
      const password = await bcrypt.hash(u.password, 10);
      const user = userRepo.create({ ...u, password });
      await userRepo.save(user);
      createdUsers.push(user);
    }

    const mainUser = createdUsers[0];
    console.log(`👤 Seeded user: ${mainUser.email}`);

    // Seed muscle groups
    const mgRepo = AppDataSource.getRepository(MuscleGroup);
    const savedMGs = await mgRepo.save(muscleGroupsToSeed);

    const mgMap = new Map<string, MuscleGroup>();
    savedMGs.forEach((mg: MuscleGroup) => mgMap.set(mg.name, mg));

    console.log('💪 Seeded muscle groups');

    // Seed exercises
    const exRepo = AppDataSource.getRepository(Exercise);
    const createdExercises = [];

    for (const ex of exercisesToSeed) {
      const exercise = exRepo.create({
        name: ex.name,
        description: ex.description,
        muscleGroups: ex.muscleGroups
          .map((name) => mgMap.get(name))
          .filter((mg): mg is MuscleGroup => Boolean(mg)),
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

    // Seed workouts
    const workoutRepo = AppDataSource.getRepository(Workout);
    for (const w of workoutsToSeed) {
      const workout = workoutRepo.create({
        title: w.title,
        description: w.description,
        time: w.time,
        createdBy: mainUser,
      });

      await workoutRepo.save(workout);

      for (const e of w.exercises) {
        const workoutExercise = new WorkoutExercise();
        workoutExercise.workout = workout;
        const exercise = exerciseMap.get(e.exerciseName);
        if (!exercise) {
          throw new Error(
            `Exercise "${e.exerciseName}" not found in exerciseMap`,
          );
        }
        workoutExercise.exercise = exercise;
        workoutExercise.order = e.order;
        workoutExercise.sets = e.sets;
        workoutExercise.reps = e.reps;
        workoutExercise.weight = e.weight;
        workoutExercise.pauseSeconds = e.pauseSeconds;
        await AppDataSource.getRepository(WorkoutExercise).save(
          workoutExercise,
        );
      }
    }

    console.log('📅 Seeded workouts');

    console.log('\n✅ Database successfully seeded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
