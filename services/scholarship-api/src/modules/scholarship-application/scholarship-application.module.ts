import { Module } from '@nestjs/common';
import { ScholarshipApplicationController } from './scholarship-application.controller';
import { ScholarshipApplicationService } from './scholarship-application.service';
import { DatabaseModule } from '../../database';
import { EmailModule } from '../email/email.module';
import { ScholarshipAuthModule } from '../scholarship-auth/scholarship-auth.module';

@Module({
  imports: [DatabaseModule, EmailModule, ScholarshipAuthModule],
  controllers: [ScholarshipApplicationController],
  providers: [ScholarshipApplicationService],
  exports: [ScholarshipApplicationService],
})
export class ScholarshipApplicationModule {}

