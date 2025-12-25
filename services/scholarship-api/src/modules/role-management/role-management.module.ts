import { Module } from '@nestjs/common';
import { RoleManagementController } from './role-management.controller';
import { RoleManagementService } from './role-management.service';
import { RolePermissionsService } from './role-permissions.service';

@Module({
  controllers: [RoleManagementController],
  providers: [RoleManagementService, RolePermissionsService],
  exports: [RoleManagementService, RolePermissionsService],
})
export class RoleManagementModule {}

