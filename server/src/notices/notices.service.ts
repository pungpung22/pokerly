import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, IsNull, Or } from 'typeorm';
import { Notice, NoticeType } from '../entities/notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findAll(): Promise<Notice[]> {
    const now = new Date();
    return this.noticeRepository.find({
      where: {
        isActive: true,
        publishedAt: LessThanOrEqual(now),
      },
      order: { isImportant: 'DESC', publishedAt: 'DESC' },
    });
  }

  async findActive(): Promise<Notice[]> {
    const now = new Date();
    return this.noticeRepository
      .createQueryBuilder('notice')
      .where('notice.isActive = :isActive', { isActive: true })
      .andWhere('notice.publishedAt <= :now', { now })
      .andWhere('(notice.expiresAt IS NULL OR notice.expiresAt > :now)', { now })
      .orderBy('notice.isImportant', 'DESC')
      .addOrderBy('notice.publishedAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return notice;
  }

  async findByType(type: NoticeType): Promise<Notice[]> {
    const now = new Date();
    return this.noticeRepository
      .createQueryBuilder('notice')
      .where('notice.isActive = :isActive', { isActive: true })
      .andWhere('notice.type = :type', { type })
      .andWhere('notice.publishedAt <= :now', { now })
      .andWhere('(notice.expiresAt IS NULL OR notice.expiresAt > :now)', { now })
      .orderBy('notice.publishedAt', 'DESC')
      .getMany();
  }

  // Admin methods
  async create(data: Partial<Notice>): Promise<Notice> {
    const notice = this.noticeRepository.create(data);
    return this.noticeRepository.save(notice);
  }

  async update(id: string, data: Partial<Notice>): Promise<Notice> {
    const notice = await this.findOne(id);
    Object.assign(notice, data);
    return this.noticeRepository.save(notice);
  }

  async remove(id: string): Promise<void> {
    const notice = await this.findOne(id);
    await this.noticeRepository.remove(notice);
  }
}
