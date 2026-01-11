import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
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

  /**
   * 중복 세션 체크 (날짜 + 장소 + 게임타입 + 스테이크)
   */
  async checkDuplicate(userId: string, dto: CreateSessionDto): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId,
        date: new Date(dto.date),
        venue: dto.venue,
        gameType: dto.gameType,
        stakes: dto.stakes,
      },
    });
  }

  async create(userId: string, createSessionDto: CreateSessionDto): Promise<Session> {
    // 중복 체크
    const duplicate = await this.checkDuplicate(userId, createSessionDto);
    if (duplicate) {
      throw new ConflictException({
        message: '동일한 세션이 이미 등록되어 있습니다.',
        duplicateSessionId: duplicate.id,
      });
    }

    const session = this.sessionRepository.create({
      ...createSessionDto,
      userId,
      date: new Date(createSessionDto.date),
      startTime: createSessionDto.startTime ? new Date(createSessionDto.startTime) : undefined,
      hands: createSessionDto.hands || 0,
      imageHash: createSessionDto.imageHash,
      rawText: createSessionDto.rawText,
    });
    return this.sessionRepository.save(session);
  }

  async findAllByUser(userId: string, limit?: number): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async findOne(userId: string, id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return session;
  }

  async update(userId: string, id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(userId, id);
    Object.assign(session, updateSessionDto);
    if (updateSessionDto.date) {
      session.date = new Date(updateSessionDto.date);
    }
    if (updateSessionDto.startTime) {
      session.startTime = new Date(updateSessionDto.startTime);
    }
    return this.sessionRepository.save(session);
  }

  async remove(userId: string, id: string): Promise<void> {
    const session = await this.findOne(userId, id);
    await this.sessionRepository.remove(session);
  }

  async getStats(userId: string) {
    const sessions = await this.sessionRepository.find({ where: { userId } });

    const totalProfit = sessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalHands = sessions.reduce((sum, s) => sum + (s.hands || 0), 0);
    const winningSessions = sessions.filter(s => Number(s.cashOut) > Number(s.buyIn)).length;
    const winRate = totalSessions > 0 ? (winningSessions / totalSessions) * 100 : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await this.sessionRepository.find({
      where: { userId, date: Between(today, tomorrow) },
    });
    const todayProfit = todaySessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekSessions = await this.sessionRepository.find({
      where: { userId, date: Between(weekStart, tomorrow) },
    });
    const weekProfit = weekSessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSessions = await this.sessionRepository.find({
      where: { userId, date: Between(monthStart, tomorrow) },
    });
    const monthProfit = monthSessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

    const recentSessions = await this.sessionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 6,
    });

    return {
      totalProfit,
      totalSessions,
      totalHours: Math.floor(totalMinutes / 60),
      totalHands,
      todayProfit,
      weekProfit,
      monthProfit,
      winRate: Math.round(winRate * 10) / 10,
      recentSessions,
    };
  }

  async getWeeklyData(userId: string) {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const sessions = await this.sessionRepository.find({
      where: { userId, date: Between(weekStart, today) },
      order: { date: 'ASC' },
    });

    const dailyProfits: number[] = [];
    const labels: string[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayProfit = sessions
        .filter(s => s.date >= day && s.date < nextDay)
        .reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

      dailyProfits.push(dayProfit);
      labels.push(days[day.getDay()]);
    }

    return { dailyProfits, labels };
  }

  async getMonthlyData(userId: string, year: number, month: number) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const sessions = await this.sessionRepository.find({
      where: { userId, date: Between(monthStart, monthEnd) },
      order: { date: 'ASC' },
    });

    const daysInMonth = monthEnd.getDate();
    const dailyProfits: number[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month - 1, i);
      const nextDay = new Date(year, month - 1, i + 1);

      const dayProfit = sessions
        .filter(s => s.date >= day && s.date < nextDay)
        .reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);

      dailyProfits.push(dayProfit);
    }

    const totalProfit = sessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0);
    const totalSessions = sessions.length;

    return {
      year,
      month,
      dailyProfits,
      totalProfit,
      totalSessions,
    };
  }

  async getAnalytics(userId: string, period?: string, startDate?: string, endDate?: string, gameType?: string) {
    let dateFilter = {};
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (period === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      dateFilter = { date: Between(start, today) };
    } else if (period === 'week') {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      dateFilter = { date: Between(start, today) };
    } else if (period === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFilter = { date: Between(start, today) };
    } else if (period === 'last30') {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      dateFilter = { date: Between(start, today) };
    } else if (period === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { date: Between(start, end) };
    }

    // Build where clause with optional gameType filter
    const whereClause: any = { userId, ...dateFilter };
    if (gameType && gameType !== 'all') {
      whereClause.gameType = gameType;
    }

    const sessions = await this.sessionRepository.find({
      where: whereClause,
      order: { date: 'DESC' },
    });

    const venueStats = new Map<string, { sessions: number; profit: number; hours: number }>();
    sessions.forEach(s => {
      const existing = venueStats.get(s.venue) || { sessions: 0, profit: 0, hours: 0 };
      existing.sessions++;
      existing.profit += Number(s.cashOut) - Number(s.buyIn);
      existing.hours += s.durationMinutes / 60;
      venueStats.set(s.venue, existing);
    });

    const stakesStats = new Map<string, { sessions: number; profit: number }>();
    sessions.forEach(s => {
      const existing = stakesStats.get(s.stakes) || { sessions: 0, profit: 0 };
      existing.sessions++;
      existing.profit += Number(s.cashOut) - Number(s.buyIn);
      stakesStats.set(s.stakes, existing);
    });

    const gameTypeStats = new Map<string, { sessions: number; profit: number }>();
    sessions.forEach(s => {
      const existing = gameTypeStats.get(s.gameType) || { sessions: 0, profit: 0 };
      existing.sessions++;
      existing.profit += Number(s.cashOut) - Number(s.buyIn);
      gameTypeStats.set(s.gameType, existing);
    });

    // 일별 데이터 (최근 30일 또는 선택 기간)
    const dailyStats = new Map<string, { profit: number; sessions: number }>();
    sessions.forEach(s => {
      const dateStr = s.date.toISOString().split('T')[0];
      const existing = dailyStats.get(dateStr) || { profit: 0, sessions: 0 };
      existing.sessions++;
      existing.profit += Number(s.cashOut) - Number(s.buyIn);
      dailyStats.set(dateStr, existing);
    });

    // 월별 트렌드 (최근 6개월)
    const monthlyStats = new Map<string, { profit: number; sessions: number }>();
    sessions.forEach(s => {
      const monthStr = `${s.date.getFullYear()}-${String(s.date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyStats.get(monthStr) || { profit: 0, sessions: 0 };
      existing.sessions++;
      existing.profit += Number(s.cashOut) - Number(s.buyIn);
      monthlyStats.set(monthStr, existing);
    });

    // 배열로 변환
    const byGameType = Array.from(gameTypeStats.entries()).map(([type, data]) => {
      const winningSessions = sessions.filter(s => s.gameType === type && Number(s.cashOut) > Number(s.buyIn)).length;
      const typeSessions = sessions.filter(s => s.gameType === type).length;
      return {
        type: type === 'cash' ? '캐시게임' : '토너먼트',
        profit: data.profit,
        sessions: data.sessions,
        winRate: typeSessions > 0 ? Math.round((winningSessions / typeSessions) * 100) : 0,
      };
    });

    const byStakes = Array.from(stakesStats.entries()).map(([stakes, data]) => ({
      stakes,
      profit: data.profit,
      sessions: data.sessions,
      bbPer100: 0, // TODO: BB/100 계산 (블라인드 정보 필요)
    }));

    const byVenue = Array.from(venueStats.entries()).map(([venue, data]) => ({
      venue,
      profit: data.profit,
      sessions: data.sessions,
    }));

    const dailyTrend = Array.from(dailyStats.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const monthlyTrend = Array.from(monthlyStats.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // 최근 6개월

    return {
      byGameType,
      byStakes,
      byVenue,
      dailyTrend,
      monthlyTrend,
      totals: {
        sessions: sessions.length,
        profit: sessions.reduce((sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)), 0),
        hours: Math.round(sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60),
      },
    };
  }
}
