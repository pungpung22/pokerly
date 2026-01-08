import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trophy, TrophyType, TrophyRarity } from '../entities/trophy.entity';

@Injectable()
export class TrophiesService {
  constructor(
    @InjectRepository(Trophy)
    private readonly trophyRepository: Repository<Trophy>,
  ) {}

  async findAllByUser(userId: string): Promise<Trophy[]> {
    return this.trophyRepository.find({
      where: { userId },
      order: { earnedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Trophy> {
    const trophy = await this.trophyRepository.findOne({ where: { id } });
    if (!trophy) {
      throw new NotFoundException(`Trophy with ID ${id} not found`);
    }
    return trophy;
  }

  async awardTrophy(
    userId: string,
    type: TrophyType,
    title: string,
    description: string,
    icon: string,
    rarity: TrophyRarity = TrophyRarity.COMMON,
    rewardPoints: number = 0,
  ): Promise<Trophy> {
    // Check if user already has this trophy type
    const existing = await this.trophyRepository.findOne({
      where: { userId, type },
    });

    if (existing) {
      return existing; // Don't award duplicate trophies
    }

    const trophy = this.trophyRepository.create({
      userId,
      type,
      title,
      description,
      icon,
      rarity,
      rewardPoints,
      earnedAt: new Date(),
    });

    return this.trophyRepository.save(trophy);
  }

  async checkAndAwardTrophies(
    userId: string,
    stats: {
      totalSessions: number;
      totalProfit: number;
      totalHours: number;
      winningStreak: number;
      completedChallenges: number;
    },
  ): Promise<Trophy[]> {
    const awardedTrophies: Trophy[] = [];

    // First session trophy
    if (stats.totalSessions >= 1) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.FIRST_SESSION,
        'First Game',
        'Recorded your first session',
        'sports_esports',
        TrophyRarity.COMMON,
        50,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    // Sessions milestones
    if (stats.totalSessions >= 10) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.SESSIONS_MILESTONE,
        'Regular Player',
        'Played 10 sessions',
        'event_repeat',
        TrophyRarity.RARE,
        100,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    // Profit milestones
    if (stats.totalProfit >= 1000000) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.PROFIT_MILESTONE,
        'Millionaire',
        'Earned 1,000,000 in profit',
        'payments',
        TrophyRarity.EPIC,
        300,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    // Hours milestone
    if (stats.totalHours >= 100) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.HOURS_MILESTONE,
        'Dedicated Grinder',
        'Played for 100 hours',
        'schedule',
        TrophyRarity.RARE,
        150,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    // Winning streak
    if (stats.winningStreak >= 5) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.WINNING_STREAK,
        'Hot Streak',
        '5 winning sessions in a row',
        'local_fire_department',
        TrophyRarity.EPIC,
        200,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    // Challenges completed
    if (stats.completedChallenges >= 10) {
      const trophy = await this.awardTrophy(
        userId,
        TrophyType.CHALLENGE_COMPLETE,
        'Challenge Master',
        'Completed 10 challenges',
        'emoji_events',
        TrophyRarity.LEGENDARY,
        500,
      );
      if (trophy) awardedTrophies.push(trophy);
    }

    return awardedTrophies;
  }

  async getStats(userId: string) {
    const trophies = await this.trophyRepository.find({ where: { userId } });

    const byRarity = {
      common: trophies.filter(t => t.rarity === TrophyRarity.COMMON).length,
      rare: trophies.filter(t => t.rarity === TrophyRarity.RARE).length,
      epic: trophies.filter(t => t.rarity === TrophyRarity.EPIC).length,
      legendary: trophies.filter(t => t.rarity === TrophyRarity.LEGENDARY).length,
    };

    const totalPointsEarned = trophies.reduce((sum, t) => sum + t.rewardPoints, 0);

    return {
      total: trophies.length,
      byRarity,
      totalPointsEarned,
    };
  }
}
