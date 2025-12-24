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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleManagementService } from './role-management.service';

@ApiTags('Role Management')
@Controller('role-management')
export class RoleManagementController {
  constructor(private readonly roleService: RoleManagementService) {}

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
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.deleteRole(roleId);
  }
}

