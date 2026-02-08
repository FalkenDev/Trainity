import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class WeightLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  /** Weight stored in kg. Frontend converts to lbs if unitScale === 'imperial'. */
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
