import { Controller, Get, Param, Query } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticeType } from '../entities/notice.entity';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  findAll() {
    return this.noticesService.findActive();
  }

  @Get('type/:type')
  findByType(@Param('type') type: NoticeType) {
    return this.noticesService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }
}
