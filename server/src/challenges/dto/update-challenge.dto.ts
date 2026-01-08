import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './create-challenge.dto';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ChallengeStatus } from '../../entities/challenge.entity';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {
  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;
}
