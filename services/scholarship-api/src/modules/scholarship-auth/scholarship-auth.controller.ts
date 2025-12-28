import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
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
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    try {
      const result = await this.authService.login(loginDto);

      // Log successful login to SQL Server T_LoginLog table
      await this.authService.logLoginEvent({
        userId: loginDto.username,
        userName: result.userName,
        loginType: 'Manual',
        status: 'Success',
        ipAddress,
        userAgent: userAgent ?? null,
      });

      return result;
    } catch (error) {
      // Log failed login attempt to SQL Server T_LoginLog table
      await this.authService.logLoginEvent({
        userId: loginDto.username,
        loginType: 'Manual',
        status: 'Failed',
        ipAddress,
        userAgent: userAgent ?? null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
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

  @Post('user-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login for scholarship portal (allows Student users)' })
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
  async userLogin(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    try {
      const result = await this.authService.userLogin(loginDto);

      // Log successful login to SQL Server T_LoginLog table
      await this.authService.logLoginEvent({
        userId: loginDto.username,
        userName: result.userName,
        loginType: 'Manual',
        status: 'Success',
        ipAddress,
        userAgent: userAgent ?? null,
      });

      return result;
    } catch (error) {
      // Log failed login attempt to SQL Server T_LoginLog table
      await this.authService.logLoginEvent({
        userId: loginDto.username,
        loginType: 'Manual',
        status: 'Failed',
        ipAddress,
        userAgent: userAgent ?? null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Social login (Microsoft, Google, Apple)',
    description:
      'Authenticates user via OAuth provider. Follows same flow as manual login - only authentication source differs.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['microsoft', 'google', 'apple'],
        },
        code: { type: 'string' },
        redirectUri: { type: 'string' },
      },
      required: ['provider', 'code', 'redirectUri'],
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Social login successful - returns same format as manual login',
  })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async socialLogin(
    @Body()
    body: {
      provider: 'microsoft' | 'google' | 'apple';
      code: string;
      redirectUri: string;
    },
    @Req() req: Request,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    try {
      const result = await this.authService.socialLogin(body);

      // Log successful social login to SQL Server T_LoginLog table
      // userName is actually the email (User_ID) - same as manual login
      await this.authService.logLoginEvent({
        userId: result.userName, // This is the email (User_ID)
        userName: result.userName, // This is the email (User_ID)
        loginType: (body.provider.charAt(0).toUpperCase() +
          body.provider.slice(1)) as 'Microsoft' | 'Google' | 'Apple',
        status: 'Success',
        ipAddress,
        userAgent: userAgent ?? null,
      });

      return result;
    } catch (error) {
      // Log failed social login attempt
      await this.authService.logLoginEvent({
        loginType: (body.provider.charAt(0).toUpperCase() +
          body.provider.slice(1)) as 'Microsoft' | 'Google' | 'Apple',
        status: 'Failed',
        ipAddress,
        userAgent: userAgent ?? null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset for admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (if email exists)',
  })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        token: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['email', 'token', 'newPassword'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(body.email, body.token, body.newPassword);
  }
}
