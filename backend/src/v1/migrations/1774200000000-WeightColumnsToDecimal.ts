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

import { MigrationInterface, QueryRunner } from 'typeorm';

export class WeightColumnsToDecimal1774200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "workout_session_set"
      ALTER COLUMN "weight" TYPE decimal(6,2) USING "weight"::decimal
    `);

    await queryRunner.query(`
      ALTER TABLE "workout_exercise"
      ALTER COLUMN "weight" TYPE decimal(6,2) USING "weight"::decimal
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "workout_session_set"
      ALTER COLUMN "weight" TYPE integer USING "weight"::integer
    `);

    await queryRunner.query(`
      ALTER TABLE "workout_exercise"
      ALTER COLUMN "weight" TYPE integer USING "weight"::integer
    `);
  }
}
