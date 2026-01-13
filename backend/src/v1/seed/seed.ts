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
import { GlobalExercise } from '../globalExercise/globalExercise.entity';

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
    GlobalExercise,
    Workout,
    WorkoutExercise,
    WorkoutSession,
    WorkoutSessionExercise,
    WorkoutSessionSet,
    MuscleGroup,
  ],
  // Keep in sync with app.module.ts (synchronize: true). This makes the seed script
  // resilient when we add new entities (like GlobalExercise).
  synchronize: true,
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
  { name: 'Glutes' },
  { name: 'Hamstrings' },
  { name: 'Quads' },
  { name: 'Calves' },
  { name: 'Rear Delts' },
  { name: 'Core' },
  { name: 'Traps' },
  { name: 'Lower Back' },
];

const exercisesToSeed = [
  {
    name: 'Bench Press',
    description:
      'Barbell press on a flat bench. Retract scapula, slight arch, feet planted. Lower to mid-chest and press up with elbows ~45°.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 150,
  },
  {
    name: 'Incline Dumbbell Press',
    description:
      'Press dumbbells on a 30–45° bench. Lower with control to chest line, press up and slightly inward.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 90,
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    description:
      'Seated vertical press. Keep ribs down, forearms vertical. Lower to about ear level, press without shrugging.',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    defaultSets: 4,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    name: 'Dumbbell Lateral Raise',
    description:
      'Raise dumbbells slightly forward and out to shoulder height. Soft elbows, strict control, slow eccentric.',
    muscleGroups: ['Shoulders', 'Rear Delts'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Cable Triceps Pushdown',
    description:
      'With rope or bar, elbows pinned. Extend elbows fully and control back to ~90°.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Cable Chest Fly',
    description:
      'From high/mid pulleys. Slight forward lean, hugging motion with soft elbows. Squeeze chest, slow return.',
    muscleGroups: ['Chest'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },

  {
    name: 'Back Squat',
    description:
      'Bar on upper back, brace core, knees track over toes. Squat to the deepest range you control, then drive up.',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 150,
  },
  {
    name: 'Barbell Hip Thrust',
    description:
      'Upper back on bench, bar over hips. Posterior pelvic tilt, drive through heels, lock out with glutes.',
    muscleGroups: ['Glutes', 'Hamstrings'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    name: 'Leg Press',
    description:
      'Feet shoulder-width on sled. Lower deep with control without pelvis tilt; press through midfoot.',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 120,
  },
  {
    name: 'Seated Leg Curl',
    description:
      'Adjust pad above heels. Curl to full knee flexion with hips pinned; control the eccentric.',
    muscleGroups: ['Hamstrings'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 75,
  },
  {
    name: 'Leg Extension',
    description:
      'Pad above ankles. Extend to near lockout under control; 2–3 s eccentric for knee-friendly tension.',
    muscleGroups: ['Quads'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Calf Raise (Machine or Leg Press)',
    description:
      'Full ankle ROM. Pause at deep stretch; strong plantarflexion at top. No bouncing.',
    muscleGroups: ['Calves'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },

  {
    name: 'Standing Barbell Overhead Press',
    description:
      'Stand tall, brace glutes and core. Press bar overhead in a straight path; head moves through at the top.',
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Chest', 'Core'],
    defaultSets: 4,
    defaultReps: 7,
    defaultPauseSeconds: 150,
  },
  {
    name: 'Seated Cable Row',
    description:
      'Neutral spine, chest up. Pull to lower ribs with elbows close; squeeze lats/mid-back, slow return.',
    muscleGroups: ['Back', 'Rear Delts', 'Biceps'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 120,
  },
  {
    name: 'Incline Bench Press',
    description:
      'Barbell press on a 30–45° incline. Lower to upper chest; press with elbows ~45–60°.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    name: 'Walking Lunge',
    description:
      'Step forward and descend under control. Front knee tracks over toes; push through front heel and switch.',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    name: 'Overhead Triceps Extension (Rope or DB)',
    description:
      'Arms overhead, elbows tucked. Lower behind head for stretch; extend fully without flaring.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 75,
  },
  {
    name: 'Hammer Curl',
    description:
      'Neutral-grip dumbbell curl. Elbows by sides; control the 2 s eccentric.',
    muscleGroups: ['Biceps', 'Forearms'],
    defaultSets: 3,
    defaultReps: 12,
    defaultPauseSeconds: 60,
  },

  {
    name: 'Deadlift',
    description:
      'Hinge at hips with neutral spine, bar close to shins. Push the floor, stand tall. Reset or control each rep.',
    muscleGroups: [
      'Glutes',
      'Hamstrings',
      'Back',
      'Traps',
      'Core',
      'Lower Back',
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 180,
  },
  {
    name: 'Lat Pulldown',
    description:
      'Grip slightly wider than shoulders. Pull bar to upper chest; elbows down and back; slow eccentric.',
    muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    name: 'Seated Row (Cable)',
    description:
      'Neutral spine; pull to belly button/lower ribs. Squeeze scapulae; control return.',
    muscleGroups: ['Back', 'Rear Delts', 'Biceps'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    name: 'Face Pull',
    description:
      'Rope at face height. Pull toward nose/forehead with external rotation (thumbs back); squeeze rear delts.',
    muscleGroups: ['Rear Delts', 'Back', 'Traps'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Biceps Curl (Barbell or Dumbbell)',
    description:
      'Supinated curl with elbows by sides, shoulders down. Full ROM; controlled negative.',
    muscleGroups: ['Biceps', 'Forearms'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    name: 'Sit-up',
    description:
      'Posterior pelvic tilt; curl spine segment by segment. Avoid pulling the neck; control down.',
    muscleGroups: ['Abs', 'Hip Flexors', 'Core'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
  },
  {
    name: 'Lying Leg Raise',
    description:
      'Posteriorly tilt pelvis; raise straight legs without arching lower back; stop before lumbar extension.',
    muscleGroups: ['Abs', 'Hip Flexors', 'Core'],
    defaultSets: 1,
    defaultReps: 10,
    defaultPauseSeconds: 45,
  },
  {
    name: 'Side-Lying Leg Raise (Obliques)',
    description:
      'Side-lying; lift with obliques, keep hips stacked and tempo controlled.',
    muscleGroups: ['Abs', 'Core'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
  },
];

const workoutsToSeed = [
  {
    title: 'Push – Chest/Shoulders/Triceps',
    description:
      'Hypertrophy-focused push session with compound pressing and targeted accessories.',
    time: 70,
    exercises: [
      {
        exerciseName: 'Bench Press',
        order: 1,
        sets: 4,
        reps: 6,
        weight: 0,
        pauseSeconds: 150,
      },
      {
        exerciseName: 'Incline Dumbbell Press',
        order: 2,
        sets: 3,
        reps: 9,
        weight: 0,
        pauseSeconds: 90,
      },
      {
        exerciseName: 'Seated Dumbbell Shoulder Press',
        order: 3,
        sets: 4,
        reps: 9,
        weight: 0,
        pauseSeconds: 120,
      },
      {
        exerciseName: 'Dumbbell Lateral Raise',
        order: 4,
        sets: 3,
        reps: 14,
        weight: 0,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Cable Triceps Pushdown',
        order: 5,
        sets: 3,
        reps: 11,
        weight: 0,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Cable Chest Fly',
        order: 6,
        sets: 3,
        reps: 13,
        weight: 0,
        pauseSeconds: 60,
      },
    ],
  },
  {
    title: 'Legs – Quads/Glutes/Hamstrings',
    description:
      'Lower-body session prioritizing big lifts, then machine volume and calves.',
    time: 70,
    exercises: [
      {
        exerciseName: 'Back Squat',
        order: 1,
        sets: 4,
        reps: 8,
        weight: 0,
        pauseSeconds: 150,
      },
      {
        exerciseName: 'Barbell Hip Thrust',
        order: 2,
        sets: 3,
        reps: 9,
        weight: 0,
        pauseSeconds: 120,
      },
      {
        exerciseName: 'Leg Press',
        order: 3,
        sets: 3,
        reps: 11,
        weight: 0,
        pauseSeconds: 120,
      },
      {
        exerciseName: 'Seated Leg Curl',
        order: 4,
        sets: 3,
        reps: 11,
        weight: 0,
        pauseSeconds: 75,
      },
      {
        exerciseName: 'Leg Extension',
        order: 5,
        sets: 3,
        reps: 13,
        weight: 0,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Calf Raise (Machine or Leg Press)',
        order: 6,
        sets: 3,
        reps: 14,
        weight: 0,
        pauseSeconds: 60,
      },
    ],
  },
  {
    title: 'Full Body – Weak Point Emphasis',
    description:
      'Mixed compound focus with arm accessories; adjust to current weak points.',
    time: 65,
    exercises: [
      {
        exerciseName: 'Standing Barbell Overhead Press',
        order: 1,
        sets: 4,
        reps: 7,
        weight: 0,
        pauseSeconds: 150,
      },
      {
        exerciseName: 'Seated Cable Row',
        order: 2,
        sets: 4,
        reps: 8,
        weight: 0,
        pauseSeconds: 120,
      },
      {
        exerciseName: 'Incline Bench Press',
        order: 3,
        sets: 3,
        reps: 9,
        weight: 0,
        pauseSeconds: 120,
      },
      {
        exerciseName: 'Walking Lunge',
        order: 4,
        sets: 3,
        reps: 10,
        weight: 0,
        pauseSeconds: 90,
      },
      {
        exerciseName: 'Overhead Triceps Extension (Rope or DB)',
        order: 5,
        sets: 3,
        reps: 10,
        weight: 0,
        pauseSeconds: 75,
      },
      {
        exerciseName: 'Hammer Curl',
        order: 6,
        sets: 3,
        reps: 12,
        weight: 0,
        pauseSeconds: 60,
      },
    ],
  },
  {
    title: 'Pull – Back/Biceps/Core',
    description:
      'Posterior-chain and lat emphasis with arm work; add core finishers.',
    time: 70,
    exercises: [
      {
        exerciseName: 'Deadlift',
        order: 1,
        sets: 4,
        reps: 6,
        weight: 0,
        pauseSeconds: 180,
      },
      {
        exerciseName: 'Lat Pulldown',
        order: 2,
        sets: 4,
        reps: 10,
        weight: 0,
        pauseSeconds: 90,
      },
      {
        exerciseName: 'Seated Row (Cable)',
        order: 3,
        sets: 4,
        reps: 10,
        weight: 0,
        pauseSeconds: 90,
      },
      {
        exerciseName: 'Face Pull',
        order: 4,
        sets: 3,
        reps: 14,
        weight: 0,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Biceps Curl (Barbell or Dumbbell)',
        order: 5,
        sets: 3,
        reps: 11,
        weight: 0,
        pauseSeconds: 60,
      },
      {
        exerciseName: 'Sit-up',
        order: 6,
        sets: 1,
        reps: 20,
        weight: 0,
        pauseSeconds: 45,
      },
      {
        exerciseName: 'Lying Leg Raise',
        order: 7,
        sets: 1,
        reps: 10,
        weight: 0,
        pauseSeconds: 45,
      },
      {
        exerciseName: 'Side-Lying Leg Raise (Obliques)',
        order: 8,
        sets: 1,
        reps: 20,
        weight: 0,
        pauseSeconds: 45,
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
        "global_exercise_muscle_groups_muscle_group",
        "exercise_muscle_groups_muscle_group" RESTART IDENTITY CASCADE;
    `,
    ).catch(() => {});

    await AppDataSource.query(`
      TRUNCATE TABLE
        "exercise",
        "global_exercise",
        "muscle_group",
        "user" RESTART IDENTITY CASCADE;
    `);

    console.log('🧹 Cleared existing data');

    const userRepo = AppDataSource.getRepository(User);
    const mgRepo = AppDataSource.getRepository(MuscleGroup);
    const exRepo = AppDataSource.getRepository(Exercise);
    const globalExRepo = AppDataSource.getRepository(GlobalExercise);
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

    // Global exercises (predefined catalog)
    const slugify = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');

    for (const ex of exercisesToSeed) {
      const globalExercise = globalExRepo.create({
        i18nKey: `exercise.${slugify(ex.name)}`,
        defaultName: ex.name,
        defaultDescription: ex.description,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps,
        defaultPauseSeconds: ex.defaultPauseSeconds,
        muscleGroups: ex.muscleGroups
          .map((name) => mgMap.get(name))
          .filter((mg): mg is MuscleGroup => !!mg),
      });
      await globalExRepo.save(globalExercise);
    }
    console.log('🌍 Seeded global exercises');

    // NOTE: We intentionally do NOT seed user-owned exercises anymore.
    // Users should import from the global exercise catalog via the API.

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
