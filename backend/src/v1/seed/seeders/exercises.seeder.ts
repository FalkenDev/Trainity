import { DataSource } from 'typeorm';
import { Exercise } from '../../exercise/exercise.entity';
import { MuscleGroup } from '../../muscleGroup/muscleGroup.entity';
import { User } from '../../user/user.entity';
import { exercisesToSeed } from '../data/exercises.data';

export async function seedUserExercises(
  dataSource: DataSource,
  mgMap: Map<string, MuscleGroup>,
  user: User,
): Promise<void> {
  const exerciseRepo = dataSource.getRepository(Exercise);

  for (const ex of exercisesToSeed) {
    const exercise = exerciseRepo.create({
      name: ex.defaultName,
      i18nKey: ex.i18nKey,
      isNameCustom: false,
      description: ex.defaultDescription ?? '',
      defaultSets: ex.defaultSets ?? 3,
      defaultReps: ex.defaultReps ?? 10,
      defaultPauseSeconds: ex.defaultPauseSeconds ?? 60,
      createdBy: user,
      muscleGroups: ex.muscleGroups
        .map((name) => mgMap.get(name))
        .filter((mg): mg is MuscleGroup => !!mg),
    });
    await exerciseRepo.save(exercise);
  }

  console.log(
    `💪 Seeded ${exercisesToSeed.length} exercise(s) for user ${user.email}`,
  );
}
