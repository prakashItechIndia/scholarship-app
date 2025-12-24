import { Module } from '@nestjs/common';
import { ScholarshipAuthController } from './scholarship-auth.controller';
import { ScholarshipAuthService } from './scholarship-auth.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [ScholarshipAuthController],
  providers: [ScholarshipAuthService],
  exports: [ScholarshipAuthService],
})
export class ScholarshipAuthModule {}

