import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('sessions')
@UseGuards(FirebaseAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(user.id, createSessionDto);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.sessionsService.findAllByUser(user.id, limit ? parseInt(limit) : undefined);
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.sessionsService.getStats(user.id);
  }

  @Get('weekly')
  getWeeklyData(@CurrentUser() user: User) {
    return this.sessionsService.getWeeklyData(user.id);
  }

  @Get('monthly')
  getMonthlyData(@CurrentUser() user: User, @Query('year') year?: string, @Query('month') month?: string) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    const m = month ? parseInt(month) : new Date().getMonth() + 1;
    return this.sessionsService.getMonthlyData(user.id, y, m);
  }

  @Get('analytics')
  getAnalytics(
    @CurrentUser() user: User,
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.sessionsService.getAnalytics(user.id, period, startDate, endDate);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.sessionsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(user.id, id, updateSessionDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.sessionsService.remove(user.id, id);
  }
}
