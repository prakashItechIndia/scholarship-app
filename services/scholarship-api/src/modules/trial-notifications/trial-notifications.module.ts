import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TrialNotificationsService } from './trial-notifications.service';
import { EmailModule } from '../email/email.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [ScheduleModule.forRoot(), EmailModule, DatabaseModule],
  providers: [TrialNotificationsService],
  exports: [TrialNotificationsService],
})
export class TrialNotificationsModule {}
