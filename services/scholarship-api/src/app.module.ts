import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './database';
import { SampleModule } from './modules/sample/sample.module';
import { ScholarshipAuthModule } from './modules/scholarship-auth/scholarship-auth.module';
import { AdminPanelModule } from './modules/admin-panel/admin-panel.module';
import { ScholarshipApplicationModule } from './modules/scholarship-application/scholarship-application.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { RoleManagementModule } from './modules/role-management/role-management.module';
import { ProcessManagementModule } from './modules/process-management/process-management.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DocumentUploadModule } from './modules/document-upload/document-upload.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DropdownOptionsModule } from './modules/dropdown-options/dropdown-options.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      envFilePath: join(__dirname, '..', '..', '..', '.env'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 1000,
      },
    ]),
    DatabaseModule,
    SampleModule,
    ScholarshipAuthModule,
    AdminPanelModule,
    ScholarshipApplicationModule,
    UserManagementModule,
    RoleManagementModule,
    ProcessManagementModule,
    ReportsModule,
    DocumentUploadModule,
    DashboardModule,
    DropdownOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
