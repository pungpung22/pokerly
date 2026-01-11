import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackStatus } from '../entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class FeedbacksService {
  private readonly logger = new Logger(FeedbacksService.name);

  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly emailService: EmailService,
  ) {}

  async create(
    userId: string,
    createFeedbackDto: CreateFeedbackDto,
    userInfo?: { email?: string; displayName?: string },
  ): Promise<Feedback> {
    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      userId,
    });
    const savedFeedback = await this.feedbackRepository.save(feedback);

    // 피드백 이메일 알림 전송
    try {
      await this.emailService.sendFeedbackNotification({
        id: savedFeedback.id,
        category: `[${savedFeedback.type}] ${savedFeedback.title}`,
        content: savedFeedback.content,
        userEmail: savedFeedback.replyEmail || userInfo?.email,
        userName: userInfo?.displayName,
      });
    } catch (error) {
      this.logger.error('Failed to send feedback notification email:', error);
    }

    return savedFeedback;
  }

  async findAllByUser(userId: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    if (feedback.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return feedback;
  }

  async remove(userId: string, id: string): Promise<void> {
    const feedback = await this.findOne(userId, id);
    if (feedback.status !== FeedbackStatus.PENDING) {
      throw new ForbiddenException('Cannot delete feedback that is being reviewed');
    }
    await this.feedbackRepository.remove(feedback);
  }

  // Admin methods
  async updateStatus(id: string, status: FeedbackStatus, adminResponse?: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    feedback.status = status;
    if (adminResponse) {
      feedback.adminResponse = adminResponse;
    }
    return this.feedbackRepository.save(feedback);
  }
}
