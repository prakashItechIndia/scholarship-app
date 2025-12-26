import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleManagementService } from './role-management.service';
import { RolePermissionsService } from './role-permissions.service';
import { ScholarshipSessionGuard } from '../scholarship-auth/guards/scholarship-session.guard';
import { 
  ScholarshipUserTypeGuard, 
  RequireUserTypes 
} from '../scholarship-auth/guards/scholarship-user-type.guard';

@ApiTags('Role Management')
@Controller('role-management')
@UseGuards(ScholarshipSessionGuard)
@ApiBearerAuth('ScholarshipSession')
export class RoleManagementController {
  constructor(
    private readonly roleService: RoleManagementService,
    private readonly permissionsService: RolePermissionsService,
  ) {}

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
  })
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
  })
  async getRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.getRoleById(roleId);
  }

  @Get('check-role-name/:roleName')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if role name exists' })
  @ApiResponse({
    status: 200,
    description: 'Role name check result',
  })
  async checkRoleName(@Param('roleName') roleName: string) {
    const exists = await this.roleService.checkRoleName(roleName);
    return { exists };
  }

  @Get('check-role-users/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if role has assigned users' })
  @ApiResponse({
    status: 200,
    description: 'Role users check result',
  })
  async checkRoleHasUsers(@Param('roleId', ParseIntPipe) roleId: number) {
    const hasUsers = await this.roleService.checkRoleHasUsers(roleId);
    return { hasUsers };
  }

  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  async createRole(@Body() roleData: unknown) {
    return this.roleService.createRole(
      roleData as Parameters<typeof this.roleService.createRole>[0],
    );
  }

  @Put('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
  })
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() roleData: unknown,
  ) {
    return this.roleService.updateRole(
      roleId,
      roleData as Parameters<typeof this.roleService.updateRole>[1],
    );
  }

  @Delete('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.deleteRole(roleId);
  }

  // Permission endpoints
  @Get('screens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all available screens' })
  @ApiResponse({
    status: 200,
    description: 'Screens retrieved successfully',
  })
  async getAllScreens() {
    return this.permissionsService.getAllScreens();
  }

  @Get('role/:roleId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permissions for a role' })
  @ApiResponse({
    status: 200,
    description: 'Role permissions retrieved successfully',
  })
  async getRolePermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.permissionsService.getRolePermissions(roleId);
  }

  @Get('role/:roleId/permissions-full')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role with all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Role with permissions retrieved successfully',
  })
  async getRoleWithPermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.permissionsService.getRoleWithPermissions(roleId);
  }

  @Get('user/:userId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permissions for a user' })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
  })
  async getUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    return this.permissionsService.getUserPermissions(userId);
  }

  @Get('user/:userId/has-permission')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user has permission to access a screen' })
  @ApiResponse({
    status: 200,
    description: 'Permission check result',
  })
  async hasScreenPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('screenUrl') screenUrl: string,
  ) {
    const hasPermission = await this.permissionsService.hasScreenPermission(
      userId,
      screenUrl,
    );
    return { hasPermission };
  }

  @Put('role/:roleId/permissions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Update permissions for a role with action-level permissions' })
  @ApiResponse({
    status: 200,
    description: 'Role permissions updated successfully',
  })
  async updateRolePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: {
      permissions: Array<{
        screenId: number;
        canCreate: boolean;
        canView: boolean;
        canUpdate: boolean;
        canDelete: boolean;
      }>;
    },
  ) {
    await this.permissionsService.updateRolePermissions(
      roleId,
      body.permissions,
    );
    return { message: 'Role permissions updated successfully' };
  }

  @Get('user/:userId/has-action-permission')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user has permission for a specific action on a screen' })
  @ApiResponse({
    status: 200,
    description: 'Action permission check result',
  })
  async hasActionPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('screenUrl') screenUrl: string,
    @Query('action') action: 'create' | 'view' | 'update' | 'delete',
  ) {
    const hasPermission = await this.permissionsService.hasActionPermission(
      userId,
      screenUrl,
      action,
    );
    return { hasPermission };
  }
}

