import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward, RewardType } from '../entities/reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  async findAllByUser(userId: string): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(userId: string): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: { userId, isClaimed: false },
      order: { createdAt: 'DESC' },
    });
  }

  async createReward(
    userId: string,
    type: RewardType,
    points: number,
    description?: string,
    referenceId?: string,
  ): Promise<Reward> {
    const reward = this.rewardRepository.create({
      userId,
      type,
      points,
      description,
      referenceId,
    });
    return this.rewardRepository.save(reward);
  }

  async claimReward(userId: string, id: string): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({
      where: { id, userId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }

    if (reward.isClaimed) {
      return reward;
    }

    reward.isClaimed = true;
    reward.claimedAt = new Date();
    return this.rewardRepository.save(reward);
  }

  async claimAllPending(userId: string): Promise<{ claimed: number; totalPoints: number }> {
    const pending = await this.findPending(userId);

    let totalPoints = 0;
    for (const reward of pending) {
      reward.isClaimed = true;
      reward.claimedAt = new Date();
      totalPoints += reward.points;
    }

    await this.rewardRepository.save(pending);

    return {
      claimed: pending.length,
      totalPoints,
    };
  }

  async getStats(userId: string) {
    const rewards = await this.rewardRepository.find({ where: { userId } });

    const totalEarned = rewards.reduce((sum, r) => sum + r.points, 0);
    const claimed = rewards.filter(r => r.isClaimed);
    const pending = rewards.filter(r => !r.isClaimed);

    const byType = new Map<string, number>();
    rewards.forEach(r => {
      byType.set(r.type, (byType.get(r.type) || 0) + r.points);
    });

    return {
      totalEarned,
      totalClaimed: claimed.reduce((sum, r) => sum + r.points, 0),
      pendingPoints: pending.reduce((sum, r) => sum + r.points, 0),
      pendingCount: pending.length,
      byType: Object.fromEntries(byType),
    };
  }

  // Helper methods for awarding specific reward types
  async awardSessionComplete(userId: string, sessionId: string, profit: number): Promise<Reward> {
    const points = profit > 0 ? 20 : 10;
    return this.createReward(
      userId,
      RewardType.SESSION_COMPLETE,
      points,
      profit > 0 ? 'Winning session recorded' : 'Session recorded',
      sessionId,
    );
  }

  async awardChallengeComplete(userId: string, challengeId: string, challengePoints: number): Promise<Reward> {
    return this.createReward(
      userId,
      RewardType.CHALLENGE_COMPLETE,
      challengePoints,
      'Challenge completed',
      challengeId,
    );
  }

  async awardTrophyEarned(userId: string, trophyId: string, trophyPoints: number): Promise<Reward> {
    return this.createReward(
      userId,
      RewardType.TROPHY_EARNED,
      trophyPoints,
      'Trophy earned',
      trophyId,
    );
  }

  async awardDailyLogin(userId: string): Promise<Reward | null> {
    // Check if already awarded today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.rewardRepository
      .createQueryBuilder('reward')
      .where('reward.userId = :userId', { userId })
      .andWhere('reward.type = :type', { type: RewardType.DAILY_LOGIN })
      .andWhere('reward.createdAt >= :today', { today })
      .getOne();

    if (existing) {
      return null;
    }

    return this.createReward(
      userId,
      RewardType.DAILY_LOGIN,
      10,
      'Daily login bonus',
    );
  }
}
