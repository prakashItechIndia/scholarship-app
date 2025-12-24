import { Module } from '@nestjs/common';
import { RoleManagementController } from './role-management.controller';
import { RoleManagementService } from './role-management.service';

@Module({
  controllers: [RoleManagementController],
  providers: [RoleManagementService],
  exports: [RoleManagementService],
})
export class RoleManagementModule {}

