import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ChallengeType } from '../../entities/challenge.entity';

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ChallengeType)
  type: ChallengeType;

  @IsNumber()
  targetValue: number;

  @IsNumber()
  rewardPoints: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
