import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RewardType {
  DAILY_LOGIN = 'daily_login',
  SESSION_COMPLETE = 'session_complete',
  CHALLENGE_COMPLETE = 'challenge_complete',
  TROPHY_EARNED = 'trophy_earned',
  LEVEL_UP = 'level_up',
  STREAK_BONUS = 'streak_bonus',
  REFERRAL = 'referral',
}

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: RewardType })
  type: RewardType;

  @Column()
  points: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'is_claimed', default: false })
  isClaimed: boolean;

  @Column({ name: 'claimed_at', type: 'timestamp', nullable: true })
  claimedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
