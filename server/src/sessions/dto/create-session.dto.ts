import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { GameType, PlayerLevel } from '../../entities/session.entity';

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

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  tableId?: string;

  @IsNumber()
  @IsOptional()
  hands?: number;

  @IsEnum(PlayerLevel)
  @IsOptional()
  level?: PlayerLevel;

  @IsString()
  @IsOptional()
  blinds?: string;

  @IsString()
  @IsOptional()
  imageHash?: string;

  @IsString()
  @IsOptional()
  rawText?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
