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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get profit(): number {
    return Number(this.cashOut) - Number(this.buyIn);
  }
}
