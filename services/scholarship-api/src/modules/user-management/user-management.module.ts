import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { DatabaseModule } from '../../database';
import { ScholarshipAuthModule } from '../scholarship-auth/scholarship-auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DatabaseModule, ScholarshipAuthModule, EmailModule],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService],
})
export class UserManagementModule {}
