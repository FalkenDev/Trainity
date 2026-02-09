import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

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
   * If true, user has edited the name and we should use `name` instead of the i18n translation.
   */
  @Column({ default: false })
  isNameCustom: boolean;

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

  @ManyToMany(() => MuscleGroup, (mg) => mg.exercises, { cascade: true })
  @JoinTable()
  muscleGroups: MuscleGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
