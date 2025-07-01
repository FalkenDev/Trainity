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

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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
}
