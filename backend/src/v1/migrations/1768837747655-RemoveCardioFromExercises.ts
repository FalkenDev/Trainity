import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCardioFromExercises1768837747655
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove trackingMode and defaultDistance from global_exercise table
    await queryRunner.dropColumn('global_exercise', 'defaultDistance');
    await queryRunner.dropColumn('global_exercise', 'trackingMode');

    // Remove trackingMode and defaultDistance from exercise table
    await queryRunner.dropColumn('exercise', 'defaultDistance');
    await queryRunner.dropColumn('exercise', 'trackingMode');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back trackingMode and defaultDistance to exercise table
    await queryRunner.query(`
      ALTER TABLE "exercise" 
      ADD "trackingMode" character varying NOT NULL DEFAULT 'strength'
    `);
    
    await queryRunner.query(`
      ALTER TABLE "exercise" 
      ADD "defaultDistance" numeric(6,2)
    `);

    // Add back trackingMode and defaultDistance to global_exercise table
    await queryRunner.query(`
      ALTER TABLE "global_exercise" 
      ADD "trackingMode" character varying NOT NULL DEFAULT 'strength'
    `);
    
    await queryRunner.query(`
      ALTER TABLE "global_exercise" 
      ADD "defaultDistance" numeric(6,2)
    `);
  }
}
