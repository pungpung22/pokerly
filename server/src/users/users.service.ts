import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider } from '../entities/user.entity';
import { CreateUserFromFirebaseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
}
