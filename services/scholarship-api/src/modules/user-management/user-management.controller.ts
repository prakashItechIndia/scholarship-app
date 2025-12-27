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
  UseGuards,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserManagementService } from './user-management.service';
import { ScholarshipSessionGuard } from '../scholarship-auth/guards/scholarship-session.guard';
import { 
  ScholarshipUserTypeGuard, 
  RequireUserTypes 
} from '../scholarship-auth/guards/scholarship-user-type.guard';

@ApiTags('User Management')
@Controller('user-management')
@UseGuards(ScholarshipSessionGuard)
@ApiBearerAuth('ScholarshipSession')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getAllUsers(
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
  ) {
    return this.userService.getAllUsers({
      sortBy,
      sortOrder,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      search,
    });
  }

  @Get('user-types')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user types/roles' })
  @ApiResponse({
    status: 200,
    description: 'User types retrieved successfully',
  })
  async getUserTypes() {
    return this.userService.getUserTypes();
  }

  @Get('check-user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user ID exists' })
  @ApiResponse({
    status: 200,
    description: 'User check result',
  })
  async checkUserId(@Param('userId') userId: string) {
    const exists = await this.userService.checkUserId(userId);
    return { exists };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  async createUser(@Body() userData: unknown) {
    return this.userService.createUser(
      userData as Parameters<typeof this.userService.createUser>[0],
    );
  }

  @Put('user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  async updateUser(@Body() userData: unknown) {
    return this.userService.updateUser(
      userData as Parameters<typeof this.userService.updateUser>[0],
    );
  }

  @Delete('user/:userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get('export/:format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export users to Excel or Word' })
  @ApiResponse({
    status: 200,
    description: 'Users exported successfully',
  })
  async exportUsers(
    @Res() res: Response,
    @Param('format') format: 'excel' | 'word',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    try {
      const buffer = await this.userService.exportUsers(format, {
        sortBy,
        sortOrder,
        search,
      });

      const contentType =
        format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const extension = format === 'excel' ? 'xlsx' : 'docx';
      const filename = `Users_Export_${new Date().toISOString().split('T')[0]}.${extension}`;

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to export users: ${error.message}`);
    }
  }
}
