import { Controller, Get, UseGuards } from '@nestjs/common';
import { TrophiesService } from './trophies.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('trophies')
@UseGuards(FirebaseAuthGuard)
export class TrophiesController {
  constructor(private readonly trophiesService: TrophiesService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.trophiesService.findAllByUser(user.id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.trophiesService.getStats(user.id);
  }
}
