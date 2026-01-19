import { DataSource } from 'typeorm';
import { GlobalExercise } from '../../globalExercise/globalExercise.entity';
import { MuscleGroup } from '../../muscleGroup/muscleGroup.entity';
import { exercisesToSeed } from '../data/exercises.data';

export async function seedGlobalExercises(
  dataSource: DataSource,
  mgMap: Map<string, MuscleGroup>,
): Promise<void> {
  const globalExRepo = dataSource.getRepository(GlobalExercise);

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

  console.log(`🌍 Seeded ${exercisesToSeed.length} global exercise(s)`);
}
