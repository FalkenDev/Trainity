import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum ActivityIcon {
  RUNNING = 'running',
  WALKING = 'walking',
  CYCLING = 'cycling',
  FOOTBALL = 'football',
  SWIMMING = 'swimming',
  KAYAKING = 'kayaking',
  HIKING = 'hiking',
  YOGA = 'yoga',
  BOXING = 'boxing',
  TENNIS = 'tennis',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  SKIING = 'skiing',
  SKATING = 'skating',
  ROWING = 'rowing',
  OTHER = 'other',
}

@Entity()
@Unique(['name', 'createdBy'])
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ActivityIcon,
    default: ActivityIcon.OTHER,
  })
  icon: ActivityIcon;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  // Configuration flags for which fields to track
  @Column({ default: false })
  trackDistance: boolean;

  @Column({ default: false })
  trackPace: boolean;

  @Column({ default: false })
  trackElevation: boolean;

  @Column({ default: false })
  trackCalories: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
