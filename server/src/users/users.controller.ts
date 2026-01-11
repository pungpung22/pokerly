import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Post('me/claim-points')
  async claimPoints(@CurrentUser() user: User) {
    return this.usersService.claimPendingPoints(user.id);
  }

  @Get('me/level')
  async getLevelInfo(@CurrentUser() user: User) {
    return this.usersService.getLevelInfo(user.id);
  }

  @Post('me/xp')
  async addXp(
    @CurrentUser() user: User,
    @Body('type') type: 'dailyLogin' | 'uploadScreenshot' | 'manualRecord' | 'viewAnalytics',
  ) {
    return this.usersService.addXp(user.id, type);
  }

  // 랭킹 참여 설정
  @Post('me/ranking')
  async updateRankingOptIn(
    @CurrentUser() user: User,
    @Body() body: { optIn: boolean; nickname?: string },
  ) {
    return this.usersService.updateRankingOptIn(user.id, body.optIn, body.nickname);
  }

  // 내 랭킹 조회
  @Get('me/ranking')
  async getMyRanking(@CurrentUser() user: User) {
    return this.usersService.getMyRanking(user.id);
  }

  // 전체 랭킹 조회
  @Get('ranking')
  async getRankings(
    @Query('category') category: 'winRate' | 'profit' | 'sessions' | 'level' | 'missions' = 'profit',
  ) {
    return this.usersService.getRankings(category);
  }
}
