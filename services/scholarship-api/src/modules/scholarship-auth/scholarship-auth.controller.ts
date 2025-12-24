import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ScholarshipAuthService } from './scholarship-auth.service';

interface LoginDto {
  username: string;
  password: string;
}

interface ChangePasswordDto {
  username: string;
  currentPassword: string;
  newPassword: string;
}

@ApiTags('Scholarship Authentication')
@Controller('scholarship-auth')
export class ScholarshipAuthController {
  constructor(private readonly authService: ScholarshipAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login for scholarship portal' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['username', 'currentPassword', 'newPassword'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid current password' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(
      changePasswordDto.username,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      changePasswordDto.username, // modifiedBy
    );
  }
}

