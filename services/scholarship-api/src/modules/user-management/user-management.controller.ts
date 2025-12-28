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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UserManagementService } from './user-management.service';
import { ScholarshipSessionGuard } from '../scholarship-auth/guards/scholarship-session.guard';
import {
  ScholarshipUserTypeGuard,
  RequireUserTypes,
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
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Length', buffer.length.toString());
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to export users: ${error.message}`);
    }
  }

  @Post('user/:userId/profile-image')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Manage user profile image (Add, Update, or Remove)',
    description:
      'Upload a file to add/update profile image, or send action=remove to delete existing image',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Image file (required for add/update, optional for remove)',
        },
        action: {
          type: 'string',
          enum: ['add', 'update', 'remove'],
          description:
            'Action to perform: add (first time), update (replace existing), remove (delete)',
          default: 'update',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image managed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file, user not found, or missing required parameters',
  })
  async manageProfileImage(
    @Param('userId') userId: string,
    @Body('action') action?: 'add' | 'update' | 'remove',
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // File is optional for remove action
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    // Determine action: if action is 'remove', use remove; otherwise use file presence to determine
    const determinedAction: 'add' | 'update' | 'remove' =
      action === 'remove'
        ? 'remove'
        : file
          ? action === 'add'
            ? 'add'
            : 'update'
          : 'update'; // Default to update if file provided but no action specified

    return this.userService.manageProfileImage(
      userId,
      file || null,
      determinedAction,
    );
  }

  @Delete('user/:userId/profile-image')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ScholarshipUserTypeGuard)
  @RequireUserTypes('Administrator')
  @ApiOperation({ summary: 'Remove user profile image' })
  @ApiResponse({
    status: 200,
    description: 'Profile image removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found or no profile image to remove',
  })
  async removeProfileImage(@Param('userId') userId: string) {
    return this.userService.manageProfileImage(userId, null, 'remove');
  }

  @Get('user/:userId/profile-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile image' })
  @ApiResponse({
    status: 200,
    description: 'Profile image retrieved successfully',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/gif': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found or profile image not found',
  })
  async getProfileImage(@Res() res: Response, @Param('userId') userId: string) {
    try {
      const { buffer, contentType, filename } =
        await this.userService.getProfileImageFile(userId);

      // Set headers for image display
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour

      // Send file buffer
      res.send(buffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve profile image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
