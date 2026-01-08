import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trophy } from '../entities/trophy.entity';
import { TrophiesService } from './trophies.service';
import { TrophiesController } from './trophies.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trophy]),
    AuthModule,
    UsersModule,
  ],
  controllers: [TrophiesController],
  providers: [TrophiesService],
  exports: [TrophiesService],
})
export class TrophiesModule {}
