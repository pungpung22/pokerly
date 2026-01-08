import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TrophyType {
  FIRST_SESSION = 'first_session',
  WINNING_STREAK = 'winning_streak',
  PROFIT_MILESTONE = 'profit_milestone',
  SESSIONS_MILESTONE = 'sessions_milestone',
  HOURS_MILESTONE = 'hours_milestone',
  CHALLENGE_COMPLETE = 'challenge_complete',
  MONTHLY_CHAMPION = 'monthly_champion',
}

export enum TrophyRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

@Entity('trophies')
export class Trophy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.trophies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: TrophyType })
  type: TrophyType;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column({ type: 'enum', enum: TrophyRarity, default: TrophyRarity.COMMON })
  rarity: TrophyRarity;

  @Column({ name: 'reward_points', default: 0 })
  rewardPoints: number;

  @Column({ name: 'earned_at', type: 'timestamp' })
  earnedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
