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

import { MigrationInterface, QueryRunner } from 'typeorm';

const nameMapping: [string, string][] = [
  ['Bröst', 'muscleGroups.chest'],
  ['Rygg', 'muscleGroups.back'],
  ['Axlar', 'muscleGroups.shoulders'],
  ['Biceps', 'muscleGroups.biceps'],
  ['Triceps', 'muscleGroups.triceps'],
  ['Ben', 'muscleGroups.legs'],
  ['Mage', 'muscleGroups.abs'],
  ['Underarmar', 'muscleGroups.forearms'],
  ['Säte', 'muscleGroups.glutes'],
  ['Baksida lår', 'muscleGroups.hamstrings'],
  ['Framsida lår', 'muscleGroups.quads'],
  ['Vader', 'muscleGroups.calves'],
  ['Bakre axlar', 'muscleGroups.rearDelts'],
  ['Bål', 'muscleGroups.core'],
  ['Trapezius', 'muscleGroups.traps'],
  ['Ländrygg', 'muscleGroups.lowerBack'],
  ['Övre bröst', 'muscleGroups.upperChest'],
  ['Höftböjare', 'muscleGroups.hipFlexors'],
];

export class TranslateMuscleGroupNames1773600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [oldName, newName] of nameMapping) {
      await queryRunner.query(
        `UPDATE "muscle_group" SET "name" = $1 WHERE "name" = $2`,
        [newName, oldName],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [oldName, newName] of nameMapping) {
      await queryRunner.query(
        `UPDATE "muscle_group" SET "name" = $1 WHERE "name" = $2`,
        [oldName, newName],
      );
    }
  }
}
