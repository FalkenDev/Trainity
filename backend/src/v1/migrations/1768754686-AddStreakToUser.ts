import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStreakToUser1768754686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add weeklyWorkoutGoal column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'weeklyWorkoutGoal',
        type: 'int',
        default: 3,
      }),
    );

    // Add currentStreak column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'currentStreak',
        type: 'int',
        default: 0,
      }),
    );

    // Add lastStreakCheckDate column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'lastStreakCheckDate',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add currentWeekWorkouts column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'currentWeekWorkouts',
        type: 'int',
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'currentWeekWorkouts');
    await queryRunner.dropColumn('user', 'lastStreakCheckDate');
    await queryRunner.dropColumn('user', 'currentStreak');
    await queryRunner.dropColumn('user', 'weeklyWorkoutGoal');
  }
}
