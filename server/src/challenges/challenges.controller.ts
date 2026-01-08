import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('challenges')
@UseGuards(FirebaseAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(user.id, createChallengeDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.challengesService.findAllByUser(user.id);
  }

  @Get('active')
  findActive(@CurrentUser() user: User) {
    return this.challengesService.findActiveByUser(user.id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.challengesService.getStats(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.challengesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengesService.update(user.id, id, updateChallengeDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('increment') increment: number,
  ) {
    return this.challengesService.updateProgress(user.id, id, increment);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.challengesService.remove(user.id, id);
  }

  @Post('check-expired')
  checkExpired(@CurrentUser() user: User) {
    return this.challengesService.checkAndUpdateExpired(user.id);
  }
}
