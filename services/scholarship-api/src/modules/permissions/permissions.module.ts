import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { RedisService } from '../../common/redis/redis.service';

@Module({
  imports: [DatabaseModule, AuthModule, AuditModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, RedisService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
