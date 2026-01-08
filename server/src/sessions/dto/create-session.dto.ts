import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsString()
  @IsNotEmpty()
  gameType: string;

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
}
