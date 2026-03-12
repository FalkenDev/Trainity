/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
