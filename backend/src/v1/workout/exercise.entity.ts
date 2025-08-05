import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MuscleGroup } from '../muscleGroup/muscleGroup.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => MuscleGroup, { eager: false })
  @JoinTable()
  muscleGroups: MuscleGroup[];
}
