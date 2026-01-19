import { DataSource } from 'typeorm';
import { MuscleGroup } from '../../muscleGroup/muscleGroup.entity';
import { muscleGroupsToSeed } from '../data/muscleGroups.data';

export async function seedMuscleGroups(
  dataSource: DataSource,
): Promise<Map<string, MuscleGroup>> {
  const mgRepo = dataSource.getRepository(MuscleGroup);

  const savedMGs = await mgRepo.save(muscleGroupsToSeed);
  const mgMap = new Map<string, MuscleGroup>();
  savedMGs.forEach((mg) => mgMap.set(mg.name, mg));

  console.log(`💪 Seeded ${savedMGs.length} muscle group(s)`);
  return mgMap;
}
