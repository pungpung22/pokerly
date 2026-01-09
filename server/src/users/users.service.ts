import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider } from '../entities/user.entity';
import { CreateUserFromFirebaseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// XP 획득 규칙
const XP_RULES = {
  dailyLogin: 20,
  uploadScreenshot: 100,
  manualRecord: 10,
  viewAnalytics: 20,
  manualRecordDailyLimit: 100,
};

// 레벨 이름
const LEVEL_NAMES: Record<number, string> = {
  1: '관찰자',
  2: '입문자',
  3: '플레이어',
  4: '레귤러',
  5: '샤크',
  6: '마스터',
  7: '그랜드마스터',
  8: '레전드',
};

// 레벨별 필요 XP
const LEVEL_REQUIRED_XP: Record<number, number> = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
  5: 2000,
  6: 4000,
  7: 8000,
  8: 16000,
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { firebaseUid } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createFromFirebase(dto: CreateUserFromFirebaseDto): Promise<User> {
    const providerMap: Record<string, AuthProvider> = {
      google: AuthProvider.GOOGLE,
      apple: AuthProvider.APPLE,
      email: AuthProvider.EMAIL,
    };

    const user = this.userRepository.create({
      firebaseUid: dto.firebaseUid,
      email: dto.email,
      displayName: dto.displayName || 'Player',
      photoUrl: dto.photoUrl || undefined,
      provider: providerMap[dto.provider || 'email'] || AuthProvider.EMAIL,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async addPoints(userId: string, points: number): Promise<User> {
    const user = await this.findById(userId);
    user.totalPoints += points;
    user.pendingPoints += points;
    user.monthlyPoints += points;

    // Level up logic (every 1000 points)
    const newLevel = Math.floor(user.totalPoints / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    return this.userRepository.save(user);
  }

  async claimPendingPoints(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.pendingPoints = 0;
    return this.userRepository.save(user);
  }

  async getProfile(userId: string): Promise<{
    user: User;
    stats: {
      totalSessions: number;
      totalProfit: number;
      totalHours: number;
      winRate: number;
    };
  }> {
    const user = await this.findById(userId);

    // Get user's sessions stats
    const sessionsQuery = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sessions', 'session')
      .where('user.id = :userId', { userId })
      .getOne();

    const sessions = sessionsQuery?.sessions || [];
    const totalSessions = sessions.length;
    const totalProfit = sessions.reduce(
      (sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)),
      0,
    );
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const winningSessions = sessions.filter(
      (s) => Number(s.cashOut) > Number(s.buyIn),
    ).length;
    const winRate = totalSessions > 0 ? (winningSessions / totalSessions) * 100 : 0;

    return {
      user,
      stats: {
        totalSessions,
        totalProfit,
        totalHours: Math.floor(totalMinutes / 60),
        winRate: Math.round(winRate * 10) / 10,
      },
    };
  }

  // XP 관련 헬퍼 메서드
  private isToday(date: Date | string | null): boolean {
    if (!date) return false;
    // DB에서 문자열로 반환될 수 있으므로 Date 객체로 변환
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  }

  private resetDailyXpIfNeeded(user: User): void {
    if (!this.isToday(user.lastXpDate)) {
      user.todayXp = 0;
      user.todayManualXp = 0;
      user.lastXpDate = new Date();
    }
  }

  private checkAndLevelUp(user: User): boolean {
    const requiredXp = LEVEL_REQUIRED_XP[user.level] || LEVEL_REQUIRED_XP[8];
    if (user.currentXp >= requiredXp && user.level < 8) {
      user.currentXp -= requiredXp;
      user.level += 1;
      return true;
    }
    return false;
  }

  // XP 획득 API
  async addXp(
    userId: string,
    type: 'dailyLogin' | 'uploadScreenshot' | 'manualRecord' | 'viewAnalytics',
  ): Promise<{ user: User; xpAwarded: number; leveledUp: boolean; message?: string }> {
    const user = await this.findById(userId);
    this.resetDailyXpIfNeeded(user);

    let xpAwarded = 0;
    let message: string | undefined;

    switch (type) {
      case 'dailyLogin':
        if (!this.isToday(user.lastLoginDate)) {
          xpAwarded = XP_RULES.dailyLogin;
          user.lastLoginDate = new Date();
        } else {
          message = '오늘 이미 로그인 보너스를 받았습니다';
        }
        break;

      case 'uploadScreenshot':
        xpAwarded = XP_RULES.uploadScreenshot;
        break;

      case 'manualRecord':
        if (user.todayManualXp < XP_RULES.manualRecordDailyLimit) {
          xpAwarded = Math.min(
            XP_RULES.manualRecord,
            XP_RULES.manualRecordDailyLimit - user.todayManualXp,
          );
          user.todayManualXp += xpAwarded;
        } else {
          message = '오늘 수동 기록 XP 한도에 도달했습니다';
        }
        break;

      case 'viewAnalytics':
        if (!this.isToday(user.lastAnalyticsDate)) {
          xpAwarded = XP_RULES.viewAnalytics;
          user.lastAnalyticsDate = new Date();
        } else {
          message = '오늘 이미 분석 보너스를 받았습니다';
        }
        break;
    }

    if (xpAwarded > 0) {
      user.currentXp += xpAwarded;
      user.todayXp += xpAwarded;
      user.totalPoints += xpAwarded;
    }

    const leveledUp = this.checkAndLevelUp(user);
    await this.userRepository.save(user);

    return { user, xpAwarded, leveledUp, message };
  }

  // 레벨 정보 조회
  async getLevelInfo(userId: string): Promise<{
    level: number;
    levelName: string;
    currentXp: number;
    requiredXp: number;
    progress: number;
    todayXp: number;
    totalXp: number;
    xpRules: typeof XP_RULES;
    todayManualXp: number;
    canEarnLoginXp: boolean;
    canEarnAnalyticsXp: boolean;
  }> {
    const user = await this.findById(userId);
    this.resetDailyXpIfNeeded(user);
    await this.userRepository.save(user);

    const requiredXp = LEVEL_REQUIRED_XP[user.level] || LEVEL_REQUIRED_XP[8];
    const progress = Math.min((user.currentXp / requiredXp) * 100, 100);

    return {
      level: user.level,
      levelName: LEVEL_NAMES[user.level] || LEVEL_NAMES[8],
      currentXp: user.currentXp,
      requiredXp,
      progress: Math.round(progress * 10) / 10,
      todayXp: user.todayXp,
      totalXp: user.totalPoints,
      xpRules: XP_RULES,
      todayManualXp: user.todayManualXp,
      canEarnLoginXp: !this.isToday(user.lastLoginDate),
      canEarnAnalyticsXp: !this.isToday(user.lastAnalyticsDate),
    };
  }
}
