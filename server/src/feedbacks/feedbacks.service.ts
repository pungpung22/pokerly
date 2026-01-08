import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackStatus } from '../entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(userId: string, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      userId,
    });
    return this.feedbackRepository.save(feedback);
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
