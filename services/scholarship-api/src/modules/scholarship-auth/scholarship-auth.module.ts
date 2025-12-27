import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScholarshipAuthController } from './scholarship-auth.controller';
import { ScholarshipAuthService } from './scholarship-auth.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule, HttpModule, ConfigModule],
  controllers: [ScholarshipAuthController],
  providers: [ScholarshipAuthService],
  exports: [ScholarshipAuthService],
})
export class ScholarshipAuthModule {}

