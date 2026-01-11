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

export enum GameType {
  CASH = 'cash',
  TOURNAMENT = 'tournament',
}

export enum PlayerLevel {
  FISH = 'fish',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PRO = 'pro',
  MASTER = 'master',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  venue: string;

  @Column({ name: 'game_type', type: 'enum', enum: GameType, default: GameType.CASH })
  gameType: GameType;

  @Column()
  stakes: string;

  @Column({ name: 'duration_minutes' })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'buy_in' })
  buyIn: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'cash_out' })
  cashOut: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'screenshot_url', nullable: true })
  screenshotUrl: string;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ name: 'table_id', nullable: true })
  tableId: string;

  @Column({ default: 0 })
  hands: number;

  @Column({ type: 'enum', enum: PlayerLevel, nullable: true })
  level: PlayerLevel;

  @Column({ nullable: true })
  blinds: string;

  @Column({ name: 'image_hash', nullable: true })
  imageHash: string;

  @Column({ name: 'raw_text', type: 'text', nullable: true })
  rawText: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get profit(): number {
    return Number(this.cashOut) - Number(this.buyIn);
  }
}
