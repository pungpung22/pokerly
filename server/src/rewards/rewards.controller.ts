import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('rewards')
@UseGuards(FirebaseAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.rewardsService.findAllByUser(user.id);
  }

  @Get('pending')
  findPending(@CurrentUser() user: User) {
    return this.rewardsService.findPending(user.id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.rewardsService.getStats(user.id);
  }

  @Post(':id/claim')
  claimReward(@CurrentUser() user: User, @Param('id') id: string) {
    return this.rewardsService.claimReward(user.id, id);
  }

  @Post('claim-all')
  claimAll(@CurrentUser() user: User) {
    return this.rewardsService.claimAllPending(user.id);
  }

  @Post('daily-login')
  dailyLogin(@CurrentUser() user: User) {
    return this.rewardsService.awardDailyLogin(user.id);
  }
}
