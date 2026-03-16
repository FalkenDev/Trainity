/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { DataSource } from 'typeorm';
import { MuscleGroup } from '../../muscleGroup/muscleGroup.entity';
import { muscleGroupsToSeed } from '../data/muscleGroups.data';

/** Maps old stored names (Swedish or previous i18nKey format) to the new simple English name */
const NAME_MIGRATION_MAP: Record<string, string> = {
  // Old Swedish names
  Bröst: 'chest',
  Rygg: 'back',
  Axlar: 'shoulders',
  Biceps: 'biceps',
  Triceps: 'triceps',
  Ben: 'legs',
  Mage: 'abs',
  Underarmar: 'forearms',
  Säte: 'glutes',
  'Baksida lår': 'hamstrings',
  'Framsida lår': 'quads',
  Vader: 'calves',
  'Bakre axlar': 'rearDelts',
  Bål: 'core',
  Trapezius: 'traps',
  Ländrygg: 'lowerBack',
  'Övre bröst': 'upperChest',
  Höftböjare: 'hipFlexors',
  // Old i18nKey-as-name format
  'muscleGroups.chest': 'chest',
  'muscleGroups.back': 'back',
  'muscleGroups.shoulders': 'shoulders',
  'muscleGroups.biceps': 'biceps',
  'muscleGroups.triceps': 'triceps',
  'muscleGroups.legs': 'legs',
  'muscleGroups.abs': 'abs',
  'muscleGroups.forearms': 'forearms',
  'muscleGroups.glutes': 'glutes',
  'muscleGroups.hamstrings': 'hamstrings',
  'muscleGroups.quads': 'quads',
  'muscleGroups.calves': 'calves',
  'muscleGroups.rearDelts': 'rearDelts',
  'muscleGroups.core': 'core',
  'muscleGroups.traps': 'traps',
  'muscleGroups.lowerBack': 'lowerBack',
  'muscleGroups.upperChest': 'upperChest',
  'muscleGroups.hipFlexors': 'hipFlexors',
};

export async function seedMuscleGroups(
  dataSource: DataSource,
): Promise<Map<string, MuscleGroup>> {
  const mgRepo = dataSource.getRepository(MuscleGroup);

  // Migrate existing records with old names to the new simple English names
  for (const [oldName, newName] of Object.entries(NAME_MIGRATION_MAP)) {
    const existing = await mgRepo.findOne({ where: { name: oldName } });
    if (existing) {
      existing.name = newName;
      await mgRepo.save(existing);
    }
  }

  // Insert any muscle groups that don't exist yet
  for (const mg of muscleGroupsToSeed) {
    const existing = await mgRepo.findOne({ where: { name: mg.name } });
    if (!existing) {
      await mgRepo.save(mg);
    }
  }

  const allMGs = await mgRepo.find();
  const mgMap = new Map<string, MuscleGroup>();
  allMGs.forEach((mg) => mgMap.set(mg.name, mg));

  console.log(`💪 Seeded/updated ${allMGs.length} muscle group(s)`);
  return mgMap;
}
