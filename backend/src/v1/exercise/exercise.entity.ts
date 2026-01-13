import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';
import { GlobalExercise } from '../globalExercise/globalExercise.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /**
   * Optional i18n key (copied from the global exercise when imported).
   * Frontend can use this to translate the display name in the future.
   */
  @Column({ nullable: true })
  i18nKey?: string;

  /**
   * If true, user has edited the name and we should treat it as a custom override.
   */
  @Column({ default: false })
  isNameCustom: boolean;

  /**
   * True when the user has customized this exercise (any field) after importing
   * from the global catalog. Used to decide whether re-importing the same global
   * template should be allowed.
   */
  @Column({ default: false })
  isCustomized: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  defaultSets: number;

  @Column()
  defaultReps: number;

  @Column()
  defaultPauseSeconds: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  /**
   * When this exercise was created from a global template.
   * We keep the relation so we can support admin-managed global exercises later.
   */
  @ManyToOne(() => GlobalExercise, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  globalExercise?: GlobalExercise;

  @ManyToMany(() => MuscleGroup, (mg) => mg.exercises, { cascade: true })
  @JoinTable()
  muscleGroups: MuscleGroup[];

  @CreateDateColumn()
  createdAt: Date;
}
