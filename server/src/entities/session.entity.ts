import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  venue: string;

  @Column({ name: 'game_type' })
  gameType: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get profit(): number {
    return Number(this.cashOut) - Number(this.buyIn);
  }
}
