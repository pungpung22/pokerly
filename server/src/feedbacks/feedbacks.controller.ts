import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('feedbacks')
@UseGuards(FirebaseAuthGuard)
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(user.id, createFeedbackDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.feedbacksService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.feedbacksService.findOne(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.feedbacksService.remove(user.id, id);
  }
}
