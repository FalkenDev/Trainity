import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCaloriesBurnedToWorkoutSession1771600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "workout_session"
      ADD COLUMN IF NOT EXISTS "caloriesBurned" integer
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('workout_session', 'caloriesBurned');
  }
}
