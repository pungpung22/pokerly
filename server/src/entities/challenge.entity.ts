import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ChallengeType {
  SESSIONS = 'sessions',
  PROFIT = 'profit',
  HOURS = 'hours',
  STREAK = 'streak',
  VENUE = 'venue',
}

export enum ChallengeStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.challenges)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ChallengeType })
  type: ChallengeType;

  @Column({ name: 'target_value' })
  targetValue: number;

  @Column({ name: 'current_value', default: 0 })
  currentValue: number;

  @Column({ name: 'reward_points' })
  rewardPoints: number;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ChallengeStatus,
    default: ChallengeStatus.ACTIVE,
  })
  status: ChallengeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get progress(): number {
    return Math.min((this.currentValue / this.targetValue) * 100, 100);
  }

  get isCompleted(): boolean {
    return this.status === ChallengeStatus.COMPLETED;
  }
}
