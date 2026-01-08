import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Challenge, ChallengeStatus, ChallengeType } from '../entities/challenge.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async create(userId: string, createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const challenge = this.challengeRepository.create({
      ...createChallengeDto,
      userId,
      startDate: new Date(createChallengeDto.startDate),
      endDate: new Date(createChallengeDto.endDate),
    });
    return this.challengeRepository.save(challenge);
  }

  async findAllByUser(userId: string): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { userId },
      order: { endDate: 'ASC' },
    });
  }

  async findActiveByUser(userId: string): Promise<Challenge[]> {
    const now = new Date();
    return this.challengeRepository.find({
      where: {
        userId,
        status: ChallengeStatus.ACTIVE,
        endDate: MoreThanOrEqual(now),
      },
      order: { endDate: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOne({ where: { id } });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    if (challenge.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return challenge;
  }

  async update(userId: string, id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    const challenge = await this.findOne(userId, id);
    Object.assign(challenge, updateChallengeDto);

    if (updateChallengeDto.startDate) {
      challenge.startDate = new Date(updateChallengeDto.startDate);
    }
    if (updateChallengeDto.endDate) {
      challenge.endDate = new Date(updateChallengeDto.endDate);
    }

    // Check if challenge is completed
    if (challenge.currentValue >= challenge.targetValue && challenge.status === ChallengeStatus.ACTIVE) {
      challenge.status = ChallengeStatus.COMPLETED;
    }

    return this.challengeRepository.save(challenge);
  }

  async updateProgress(userId: string, id: string, progressIncrement: number): Promise<Challenge> {
    const challenge = await this.findOne(userId, id);
    challenge.currentValue += progressIncrement;

    if (challenge.currentValue >= challenge.targetValue && challenge.status === ChallengeStatus.ACTIVE) {
      challenge.status = ChallengeStatus.COMPLETED;
    }

    return this.challengeRepository.save(challenge);
  }

  async remove(userId: string, id: string): Promise<void> {
    const challenge = await this.findOne(userId, id);
    await this.challengeRepository.remove(challenge);
  }

  async checkAndUpdateExpired(userId: string): Promise<number> {
    const now = new Date();
    const result = await this.challengeRepository.update(
      {
        userId,
        status: ChallengeStatus.ACTIVE,
        endDate: LessThanOrEqual(now),
      },
      { status: ChallengeStatus.EXPIRED },
    );
    return result.affected || 0;
  }

  async getStats(userId: string) {
    const challenges = await this.challengeRepository.find({ where: { userId } });

    const total = challenges.length;
    const active = challenges.filter(c => c.status === ChallengeStatus.ACTIVE).length;
    const completed = challenges.filter(c => c.status === ChallengeStatus.COMPLETED).length;
    const failed = challenges.filter(c => c.status === ChallengeStatus.FAILED).length;
    const expired = challenges.filter(c => c.status === ChallengeStatus.EXPIRED).length;

    const totalRewardsEarned = challenges
      .filter(c => c.status === ChallengeStatus.COMPLETED)
      .reduce((sum, c) => sum + c.rewardPoints, 0);

    return {
      total,
      active,
      completed,
      failed,
      expired,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalRewardsEarned,
    };
  }

  // Create default challenges for new users
  async createDefaultChallenges(userId: string): Promise<Challenge[]> {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date(now);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const defaultChallenges: Partial<Challenge>[] = [
      {
        userId,
        title: 'First Steps',
        description: 'Record your first 3 sessions',
        type: ChallengeType.SESSIONS,
        targetValue: 3,
        rewardPoints: 100,
        startDate: now,
        endDate: weekEnd,
      },
      {
        userId,
        title: 'Profit Hunter',
        description: 'Earn 500,000 in profit',
        type: ChallengeType.PROFIT,
        targetValue: 500000,
        rewardPoints: 200,
        startDate: now,
        endDate: monthEnd,
      },
      {
        userId,
        title: 'Grinder',
        description: 'Play 10 hours total',
        type: ChallengeType.HOURS,
        targetValue: 10,
        rewardPoints: 150,
        startDate: now,
        endDate: monthEnd,
      },
    ];

    const challenges = defaultChallenges.map(c => this.challengeRepository.create(c));
    return this.challengeRepository.save(challenges);
  }
}
