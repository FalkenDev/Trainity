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
    firstName: 'Test',
    lastName: 'Användare',
    avatar: 'https://i.pravatar.cc/150?u=seeduser',
  },
];

const muscleGroupsToSeed = [
  { name: 'Bröst' },
  { name: 'Rygg' },
  { name: 'Axlar' },
  { name: 'Biceps' },
  { name: 'Triceps' },
  { name: 'Ben' },
  { name: 'Mage' },
  { name: 'Underarmar' },
  { name: 'Säte' },
  { name: 'Baksida lår' },
  { name: 'Framsida lår' },
  { name: 'Vader' },
  { name: 'Bakre axlar' },
  { name: 'Bål' },
  { name: 'Trapezius' },
  { name: 'Ländrygg' },
  { name: 'Övre bröst' },
  { name: 'Höftböjare' },
];

const exercisesToSeed = [
  {
    i18nKey: 'exercise.bench_press',
    defaultName: 'Bänkpress',
    defaultDescription:
      'Skivstångspress på plan bänk. Dra ihop skulderbladen, lätt brygga, fötter i golvet. Sänk till mitten av bröstet och pressa upp med armbågar ~45°.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.incline_dumbbell_press',
    defaultName: 'Hantelpress lutande',
    defaultDescription:
      'Pressa hantlar på en bänk med 30–45° lutning. Sänk kontrollerat till bröstlinjen, pressa upp och lätt inåt.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.seated_dumbbell_shoulder_press',
    defaultName: 'Sittande hantelpress (axlar)',
    defaultDescription:
      'Sittande vertikal press. Håll revbenen nere och underarmarna vertikala. Sänk till ungefär öronhöjd och pressa utan att rycka axlarna.',
    muscleGroups: ['Axlar', 'Triceps', 'Bål'],
    defaultSets: 4,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.dumbbell_lateral_raise',
    defaultName: 'Hantellyft åt sidan',
    defaultDescription:
      'Lyft hantlar lätt framåt och ut till axelhöjd. Mjuka armbågar, strikt kontroll och långsam excentrisk fas.',
    muscleGroups: ['Axlar', 'Bakre axlar'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.cable_triceps_pushdown',
    defaultName: 'Triceps pushdown (kabel)',
    defaultDescription:
      'Med rep eller stång, håll armbågarna stilla. Sträck ut helt och kontrollera tillbaka till ~90°.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.cable_chest_fly',
    defaultName: 'Kabel-flyes (bröst)',
    defaultDescription:
      'Från höga/mitten-trissor. Lätt framåtlutning, kramrörelse med mjuka armbågar. Spänn bröstet och återgå långsamt.',
    muscleGroups: ['Bröst'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.back_squat',
    defaultName: 'Knäböj (skivstång)',
    defaultDescription:
      'Stång på övre ryggen, spänn bålen, knän följer tårna. Gå ned så djupt du kontrollerar och driv upp igen.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår', 'Bål'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.barbell_hip_thrust',
    defaultName: 'Hip thrust (skivstång)',
    defaultDescription:
      'Övre rygg på bänk, stång över höften. Tippa bäckenet bakåt, driv genom hälarna och lås ut med sätet.',
    muscleGroups: ['Säte', 'Baksida lår'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.leg_press',
    defaultName: 'Benpress',
    defaultDescription:
      'Fötter axelbrett på släden. Sänk djupt med kontroll utan att bäckenet tippar; pressa genom mellanfoten.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.seated_leg_curl',
    defaultName: 'Sittande lårcurl',
    defaultDescription:
      'Justera dynan ovanför hälarna. Curl till full knäflexion med höfterna stilla; kontrollera den excentriska fasen.',
    muscleGroups: ['Baksida lår'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 75,
  },
  {
    i18nKey: 'exercise.leg_extension',
    defaultName: 'Benextension',
    defaultDescription:
      'Dyna ovanför anklarna. Sträck ut nästan till låsning med kontroll; 2–3 s excentriskt för knävänlig belastning.',
    muscleGroups: ['Framsida lår'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.calf_raise_machine_or_leg_press',
    defaultName: 'Vadpress (maskin/benpress)',
    defaultDescription:
      'Full rörelse i fotleden. Pausa i bottenläget; kraftig tåhävning i toppen. Ingen studs.',
    muscleGroups: ['Vader'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.standing_barbell_overhead_press',
    defaultName: 'Militärpress (stående)',
    defaultDescription:
      'Stå stabilt, spänn säte och bål. Pressa stången rakt upp; för huvudet fram genom armarna i toppläget.',
    muscleGroups: ['Axlar', 'Triceps', 'Övre bröst', 'Bål'],
    defaultSets: 4,
    defaultReps: 7,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.seated_cable_row',
    defaultName: 'Sittande rodd (kabel)',
    defaultDescription:
      'Neutral rygg, bröstet upp. Dra mot nedre revben med armbågar nära kroppen; spänn lats/mellanrygg, återgå långsamt.',
    muscleGroups: ['Rygg', 'Bakre axlar', 'Biceps'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.incline_bench_press',
    defaultName: 'Bänkpress lutande (skivstång)',
    defaultDescription:
      'Skivstångspress på 30–45° lutning. Sänk till övre bröstet; pressa med armbågar ~45–60°.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.walking_lunge',
    defaultName: 'Gående utfall',
    defaultDescription:
      'Ta ett steg fram och gå ned kontrollerat. Främre knät följer tårna; pressa upp genom främre hälen och växla.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår', 'Bål'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.overhead_triceps_extension_rope_or_db',
    defaultName: 'Triceps extension över huvudet (rep/hantel)',
    defaultDescription:
      'Armar över huvudet, armbågar nära. Sänk bakom huvudet för stretch; sträck ut helt utan att flara armbågarna.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 75,
  },
  {
    i18nKey: 'exercise.hammer_curl',
    defaultName: 'Hammercurl',
    defaultDescription:
      'Hantelcurl med neutralt grepp. Armbågarna vid sidan; kontrollera den excentriska fasen i ~2 sek.',
    muscleGroups: ['Biceps', 'Underarmar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.deadlift',
    defaultName: 'Marklyft',
    defaultDescription:
      'Höftfällning med neutral rygg, stången nära smalbenen. Tryck golvet, res dig starkt. Återställ eller kontrollera varje repetition.',
    muscleGroups: [
      'Säte',
      'Baksida lår',
      'Rygg',
      'Trapezius',
      'Bål',
      'Ländrygg',
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 180,
  },
  {
    i18nKey: 'exercise.lat_pulldown',
    defaultName: 'Latsdrag',
    defaultDescription:
      'Greppa något bredare än axlarna. Dra stången mot övre bröstet; armbågar ned och bak; långsam excentrisk fas.',
    muscleGroups: ['Rygg', 'Biceps', 'Bakre axlar'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.seated_row_cable',
    defaultName: 'Sittande rodd (kabel) – mage',
    defaultDescription:
      'Neutral rygg; dra till navel/nedre revben. Nyp ihop skulderbladen; kontrollera återgången.',
    muscleGroups: ['Rygg', 'Bakre axlar', 'Biceps'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.face_pull',
    defaultName: 'Face pull',
    defaultDescription:
      'Rep i ansiktshöjd. Dra mot näsa/panna med utåtrotation (tummar bak); spänn bakre axlar.',
    muscleGroups: ['Bakre axlar', 'Rygg', 'Trapezius'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.biceps_curl_barbell_or_dumbbell',
    defaultName: 'Bicepscurl (stång/hantel)',
    defaultDescription:
      'Curl med supinerat grepp, armbågar vid sidan, axlarna nere. Fullt rörelseomfång; kontrollerad negativ fas.',
    muscleGroups: ['Biceps', 'Underarmar'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.sit_up',
    defaultName: 'Situps',
    defaultDescription:
      'Tippa bäckenet bakåt; rulla upp kotsegment för segment. Undvik att dra i nacken; kontrollera nedvägen.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
  },
  {
    i18nKey: 'exercise.lying_leg_raise',
    defaultName: 'Benlyft liggande',
    defaultDescription:
      'Tippa bäckenet bakåt; lyft raka ben utan att svanka; stoppa innan ländryggen börjar extendera.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    defaultSets: 1,
    defaultReps: 10,
    defaultPauseSeconds: 45,
  },
  {
    i18nKey: 'exercise.side_lying_leg_raise_obliques',
    defaultName: 'Sidoliggande benlyft (sneda magmuskler)',
    defaultDescription:
      'Sidoliggande; lyft med sneda magmuskler, håll höfterna staplade och kontrollera tempot.',
    muscleGroups: ['Mage', 'Bål'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
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
    const globalExRepo = AppDataSource.getRepository(GlobalExercise);

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
    for (const ex of exercisesToSeed) {
      const globalExercise = globalExRepo.create({
        i18nKey: ex.i18nKey,
        defaultName: ex.defaultName,
        defaultDescription: ex.defaultDescription,
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
