import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private readonly adminEmail = 'pung0805@gmail.com';

  constructor() {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.logger.log('Email service initialized with Resend');
    } else {
      this.logger.warn('RESEND_API_KEY not configured. Emails will be logged only.');
    }
  }

  async sendFeedbackNotification(feedback: {
    id: string;
    category: string;
    content: string;
    userEmail?: string;
    userName?: string;
  }): Promise<boolean> {
    const subject = `[Pokerly 피드백] ${feedback.category}`;
    const html = `
      <div style="font-family: 'Pretendard', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F72585 0%, #7B2FF7 100%); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Pokerly 피드백</h1>
        </div>
        <div style="background: #1C1C1E; padding: 24px; border-radius: 0 0 12px 12px; color: #D4D4D8;">
          <p style="margin: 0 0 16px; color: #A1A1AA; font-size: 14px;">
            <strong>카테고리:</strong> ${feedback.category}
          </p>
          <p style="margin: 0 0 16px; color: #A1A1AA; font-size: 14px;">
            <strong>회신 이메일:</strong> ${feedback.userEmail || '없음'}
          </p>
          <p style="margin: 0 0 16px; color: #A1A1AA; font-size: 14px;">
            <strong>작성자:</strong> ${feedback.userName || '익명'}
          </p>
          <div style="background: #0A0A0B; padding: 16px; border-radius: 8px; border: 1px solid #27272A;">
            <p style="margin: 0; color: white; white-space: pre-wrap; line-height: 1.6;">${feedback.content}</p>
          </div>
          <p style="margin: 16px 0 0; color: #71717A; font-size: 12px;">
            피드백 ID: ${feedback.id}
          </p>
        </div>
      </div>
    `;

    if (!this.resend) {
      this.logger.log(`[EMAIL LOG] To: ${this.adminEmail}`);
      this.logger.log(`[EMAIL LOG] Subject: ${subject}`);
      this.logger.log(`[EMAIL LOG] 회신 이메일: ${feedback.userEmail || '없음'}`);
      this.logger.log(`[EMAIL LOG] Content: ${feedback.content}`);
      return true;
    }

    try {
      await this.resend.emails.send({
        from: 'Pokerly <onboarding@resend.dev>',
        to: this.adminEmail,
        subject,
        html,
      });
      this.logger.log(`Feedback email sent to ${this.adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send feedback email:', error);
      return false;
    }
  }
}
