import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Activity } from '../activity/activity.entity';
import { ScheduledSession } from '../scheduledSession/scheduledSession.entity';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Activity, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  activity: Activity | null;

  @ManyToOne(() => ScheduledSession, { onDelete: 'SET NULL', nullable: true })
  scheduledSession: ScheduledSession | null;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  duration: number; // in minutes

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance?: number; // in kilometers

  @Column({ nullable: true })
  pace?: string; // formatted as "5:30/km"

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  elevationGain?: number; // in meters

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  maxElevation?: number; // in meters

  @Column({ nullable: true })
  calories?: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
