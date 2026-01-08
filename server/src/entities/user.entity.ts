import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session.entity';
import { Challenge } from './challenge.entity';
import { Trophy } from './trophy.entity';
import { Feedback } from './feedback.entity';

export enum AuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL = 'email',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firebase_uid', unique: true })
  firebaseUid: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.GOOGLE })
  provider: AuthProvider;

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'total_points', default: 0 })
  totalPoints: number;

  @Column({ name: 'pending_points', default: 0 })
  pendingPoints: number;

  @Column({ name: 'monthly_points', default: 0 })
  monthlyPoints: number;

  @Column({ name: 'locale', default: 'ko' })
  locale: string;

  @Column({ name: 'theme', default: 'dark' })
  theme: string;

  @Column({ name: 'notifications_enabled', default: true })
  notificationsEnabled: boolean;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Challenge, (challenge) => challenge.user)
  challenges: Challenge[];

  @OneToMany(() => Trophy, (trophy) => trophy.user)
  trophies: Trophy[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
