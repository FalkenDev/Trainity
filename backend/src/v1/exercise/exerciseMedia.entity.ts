import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exercise } from './exercise.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class ExerciseMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column()
  url: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.media, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise;

  @CreateDateColumn()
  createdAt: Date;
}
