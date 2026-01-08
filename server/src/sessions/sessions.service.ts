import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session } from '../entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create({
      ...createSessionDto,
      date: new Date(createSessionDto.date),
    });
    return this.sessionRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    if (updateSessionDto.date) {
      session.date = new Date(updateSessionDto.date);
    }
    return this.sessionRepository.save(session);
  }

  async remove(id: string): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }

  async getStats() {
    const sessions = await this.sessionRepository.find();

    const totalProfit = sessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    // Today's profit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await this.sessionRepository.find({
      where: { date: Between(today, tomorrow) },
    });
    const todayProfit = todaySessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

    // This week's profit
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekSessions = await this.sessionRepository.find({
      where: { date: Between(weekStart, tomorrow) },
    });
    const weekProfit = weekSessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

    // Recent sessions
    const recentSessions = await this.sessionRepository.find({
      order: { date: 'DESC' },
      take: 6,
    });

    return {
      totalProfit,
      totalSessions,
      totalHours: Math.floor(totalMinutes / 60),
      todayProfit,
      weekProfit,
      recentSessions,
    };
  }

  async getWeeklyData() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const sessions = await this.sessionRepository.find({
      where: { date: Between(weekStart, today) },
      order: { date: 'ASC' },
    });

    // Group by day
    const dailyProfits: number[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayProfit = sessions
        .filter(s => s.date >= day && s.date < nextDay)
        .reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

      dailyProfits.push(dayProfit);
    }

    return { dailyProfits };
  }
}
