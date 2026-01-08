import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { FeedbackType } from '../../entities/feedback.entity';

export class CreateFeedbackDto {
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
