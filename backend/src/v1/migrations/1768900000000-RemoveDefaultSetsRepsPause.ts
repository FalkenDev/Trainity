import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDefaultSetsRepsPause1768900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise" DROP COLUMN IF EXISTS "defaultSets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise" DROP COLUMN IF EXISTS "defaultReps"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise" DROP COLUMN IF EXISTS "defaultPauseSeconds"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise" ADD "defaultSets" integer NOT NULL DEFAULT 3`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise" ADD "defaultReps" integer NOT NULL DEFAULT 10`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise" ADD "defaultPauseSeconds" integer NOT NULL DEFAULT 60`,
    );
  }
}
