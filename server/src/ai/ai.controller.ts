import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { SessionsService } from '../sessions/sessions.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('report')
  async getPersonalizedReport(
    @CurrentUser() user: User,
    @Query('locale') locale: string = 'ko',
  ) {
    const userId = user.id;

    // Get all necessary data
    const stats = await this.sessionsService.getStats(userId);
    const analytics = await this.sessionsService.getAnalytics(userId, 'last30');
    const weekData = await this.sessionsService.getWeeklyData(userId);

    // Calculate last 7 days profit
    const last7DaysProfit = weekData.dailyProfits.reduce((sum, p) => sum + p, 0);

    // Prepare data for AI
    const sessionData = {
      totalProfit: stats.totalProfit,
      totalSessions: stats.totalSessions,
      totalHours: stats.totalHours,
      totalHands: stats.totalHands,
      winRate: stats.winRate,
      avgBbPer100: analytics.bbStats?.avgBbPer100 || 0,
      byStakes: analytics.byStakes || [],
      byVenue: analytics.byVenue || [],
      recentTrend: {
        last7Days: last7DaysProfit,
        last30Days: stats.monthProfit,
      },
      playStyle: analytics.bbStats?.playStyle || 'unknown',
      volatilityLevel: analytics.bbStats?.volatilityLevel || 'unknown',
    };

    // Generate AI report
    const report = await this.aiService.generatePersonalizedReport(sessionData, locale);

    return {
      report,
      generatedAt: new Date().toISOString(),
      dataSnapshot: {
        totalSessions: stats.totalSessions,
        totalProfit: stats.totalProfit,
        avgBbPer100: analytics.bbStats?.avgBbPer100 || 0,
      },
    };
  }
}
