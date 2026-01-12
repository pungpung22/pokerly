import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface SessionData {
  totalProfit: number;
  totalSessions: number;
  totalHours: number;
  totalHands: number;
  winRate: number;
  avgBbPer100: number;
  byStakes: Array<{
    stakes: string;
    profit: number;
    sessions: number;
    hands: number;
    bbPer100: number;
  }>;
  byVenue: Array<{
    venue: string;
    profit: number;
    sessions: number;
  }>;
  recentTrend: {
    last7Days: number;
    last30Days: number;
  };
  playStyle: string;
  volatilityLevel: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generatePersonalizedReport(data: SessionData, locale: string = 'ko'): Promise<string> {
    const languagePrompt = locale === 'en'
      ? 'Respond in English.'
      : locale === 'ja'
        ? 'Respond in Japanese.'
        : 'Respond in Korean.';

    const systemPrompt = `You are an expert poker coach and data analyst. Analyze the player's poker data and provide personalized insights and recommendations.

${languagePrompt}

Be specific, actionable, and encouraging. Focus on:
1. Strengths to maintain
2. Weaknesses to improve
3. Specific recommendations based on their data patterns
4. Bankroll management advice if applicable

Keep the response concise but insightful (max 500 words). Use bullet points for clarity.
Do not use markdown headers (no # or ##). Just use plain text with bullet points (•) and line breaks.`;

    const userPrompt = this.buildUserPrompt(data, locale);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Unable to generate report.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI report');
    }
  }

  private buildUserPrompt(data: SessionData, locale: string): string {
    const currencySymbol = locale === 'en' ? '$' : locale === 'ja' ? '¥' : '₩';

    let prompt = `Please analyze my poker performance data:\n\n`;

    prompt += `**Overall Statistics:**\n`;
    prompt += `• Total Sessions: ${data.totalSessions}\n`;
    prompt += `• Total Profit: ${currencySymbol}${data.totalProfit.toLocaleString()}\n`;
    prompt += `• Total Hours: ${data.totalHours}h\n`;
    prompt += `• Total Hands: ${data.totalHands.toLocaleString()}\n`;
    prompt += `• Win Rate: ${data.winRate}%\n`;
    prompt += `• BB/100: ${data.avgBbPer100}\n`;
    prompt += `• Play Style: ${data.playStyle}\n`;
    prompt += `• Volatility: ${data.volatilityLevel}\n\n`;

    if (data.byStakes.length > 0) {
      prompt += `**Performance by Stakes:**\n`;
      data.byStakes.forEach(s => {
        prompt += `• ${s.stakes}: ${s.sessions} sessions, ${currencySymbol}${s.profit.toLocaleString()} profit, BB/100: ${s.bbPer100}, ${s.hands} hands\n`;
      });
      prompt += '\n';
    }

    if (data.byVenue.length > 0) {
      prompt += `**Performance by Venue/Platform:**\n`;
      data.byVenue.slice(0, 5).forEach(v => {
        prompt += `• ${v.venue}: ${v.sessions} sessions, ${currencySymbol}${v.profit.toLocaleString()} profit\n`;
      });
      prompt += '\n';
    }

    prompt += `**Recent Trend:**\n`;
    prompt += `• Last 7 days: ${currencySymbol}${data.recentTrend.last7Days.toLocaleString()}\n`;
    prompt += `• Last 30 days: ${currencySymbol}${data.recentTrend.last30Days.toLocaleString()}\n\n`;

    prompt += `Based on this data, provide personalized insights and specific recommendations for improvement.`;

    return prompt;
  }
}
