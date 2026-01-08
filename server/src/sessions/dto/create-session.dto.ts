import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { GameType } from '../../entities/session.entity';

export class CreateSessionDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsEnum(GameType)
  @IsOptional()
  gameType?: GameType;

  @IsString()
  @IsNotEmpty()
  stakes: string;

  @IsNumber()
  durationMinutes: number;

  @IsNumber()
  buyIn: number;

  @IsNumber()
  cashOut: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  screenshotUrl?: string;
}
