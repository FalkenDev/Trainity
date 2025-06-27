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

  @Column({ type: 'int', nullable: true })
  defaultSets: number;

  @Column({ type: 'int', nullable: true })
  defaultReps: number;

  @Column({ type: 'int', nullable: true })
  defaultPauseSeconds: number;

  @ManyToOne(() => User, (user) => user.exercises, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.exercises, {
    cascade: true,
  })
  @JoinTable()
  muscleGroups: MuscleGroup[];

  @CreateDateColumn()
  createdAt: Date;
}
