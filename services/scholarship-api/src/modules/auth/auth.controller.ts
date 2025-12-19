import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/request.types';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  LogoutRequestDto,
  GetMeResponseDto,
  RequestPasswordResetDto,
  PasswordResetResponseDto,
  ResetPasswordDto,
  ActivationTokenValidationResponseDto,
  CreatePasswordDto,
  CheckEmailDto,
  EmailCheckResponseDto,
  ResendActivationDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  SignupRequestDto,
} from '../../dto/auth/auth.dto';
import { AuditService } from '../audit/audit.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly auditService: AuditService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiBody({ type: LoginRequestDto })
  // Rate limit: 5 attempts per 15 minutes
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    // Only log audit event if login was successful (not MFA required)
    if (result.user) {
      await this.auditService.logEvent({
        actorUserId: result.user.id,
        tenantId: result.user.tenantId ?? null,
        eventType: 'auth/login',
        eventPayload: { productCode: loginDto.productCode ?? 'accounts' },
      });
    }
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Body() body: RefreshTokenRequestDto & { productCode?: string },
  ): Promise<RefreshTokenResponseDto> {
    const productCode = body.productCode || 'accounts';
    const tokens = await this.authService.refreshAccessToken(
      body.refreshToken,
      productCode,
    );

    return {
      ...tokens,
      expiresIn: 3600, // 1 hour
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Logout and invalidate refresh token',
    description:
      'Centralized logout: Revokes refresh token and logs out user from all products (Single Logout)',
  })
  @ApiBody({ type: LogoutRequestDto })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  async logout(@Body() body: LogoutRequestDto): Promise<void> {
    // Revoke the refresh token
    const revokedToken = await this.authService.revokeRefreshToken(
      body.refreshToken,
    );

    // If we have the user ID from the revoked token, logout from all products
    if (revokedToken?.userId) {
      await this.sessionService.logoutAllProducts(
        revokedToken.userId,
        'user_initiated',
      );
    }

    await this.auditService.logEvent({
      eventType: 'auth/logout',
      eventPayload: {},
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: GetMeResponseDto,
  })
  async getMe(@Request() req: AuthenticatedRequest): Promise<GetMeResponseDto> {
    return this.authService.getMe(req.user.userId);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: RequestPasswordResetDto })
  // Rate limit: 3 requests per hour
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (if email exists)',
    type: PasswordResetResponseDto,
  })
  async requestPasswordReset(
    @Body() body: RequestPasswordResetDto,
  ): Promise<PasswordResetResponseDto> {
    return this.authService.requestPasswordReset(
      body.email,
      body.returnUrl,
      body.productCode,
    );
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: PasswordResetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<PasswordResetResponseDto> {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('validate-activation-token')
  @ApiOperation({ summary: 'Validate activation token' })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    type: ActivationTokenValidationResponseDto,
  })
  async validateActivationToken(@Query('token') token: string) {
    return this.authService.validateActivationToken(token);
  }

  @Post('create-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create password after activation' })
  @ApiBody({ type: CreatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token or weak password' })
  async createPassword(@Body() body: CreatePasswordDto) {
    return this.authService.createPassword(body.token, body.password);
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check email and send activation if needed' })
  @ApiBody({ type: CheckEmailDto })
  // Rate limit: 5 requests per hour
  @ApiResponse({
    status: 200,
    description: 'Email check result',
    type: EmailCheckResponseDto,
  })
  async checkEmail(
    @Body() body: CheckEmailDto,
  ): Promise<EmailCheckResponseDto> {
    return this.authService.checkEmail(body.email);
  }

  @Post('resend-activation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend activation email' })
  @ApiBody({ type: ResendActivationDto })
  // Rate limit: 5 requests per hour
  @ApiResponse({
    status: 200,
    description:
      'Activation email sent (if email exists and account not active)',
    type: PasswordResetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Account already active' })
  async resendActivation(
    @Body() body: ResendActivationDto,
  ): Promise<PasswordResetResponseDto> {
    return this.authService.resendActivation(body.email);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description:
      'Change password for authenticated user. Requires current password verification. All refresh tokens will be invalidated for security.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    // The Swagger decorators use internally dynamic metadata, which can trip
    // strict "unsafe" lint rules even though our DTO types are safe.

    type: ChangePasswordResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid current password or not authenticated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid new password or validation error',
  })
  changePassword(
    @Body() body: ChangePasswordDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ChangePasswordResponseDto> {
    // The DTO and request user are strongly typed and validated; however,
    // strict "unsafe" lint rules can be confused by NestJS' runtime typing.
    const resultPromise = this.authService.changePassword(
      req.user.userId,

      body.currentPassword,

      body.newPassword,
      req.user.productCode,
    );

    return resultPromise.then((res) => {
      void this.auditService.logEvent({
        actorUserId: req.user.userId,
        tenantId: req.user.tenantId ?? null,
        eventType: 'auth/change-password',
        eventPayload: {},
      });
      return res;
    });
  }

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 signups per hour per IP
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account with organization',
    description:
      'Production signup endpoint. Creates a new organization (tenant) with country auto-detected from IP, and assigns the user as org_admin. The user will receive an activation email to set their password.',
  })
  @ApiBody({ type: SignupRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User account and organization created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            tenantId: { type: 'string' },
            role: { type: 'string' },
          },
        },
        organization: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            orgName: { type: 'string' },
            country: { type: 'string' },
            zohoAccountRegion: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists or invalid input',
  })
  async signup(
    @Body() body: SignupRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // Extract client IP from request
    const getHeaderValue = (key: string): string | null => {
      const value = req.headers[key];
      if (!value) return null;
      return Array.isArray(value) ? value[0] : value;
    };

    const clientIp =
      getHeaderValue('x-forwarded-for')?.split(',')[0]?.trim() ||
      getHeaderValue('x-real-ip') ||
      req.socket?.remoteAddress ||
      req.ip;

    const result = await this.authService.signup(
      body.email,
      body.firstName,
      body.lastName,
      body.organizationName,
      clientIp,
      body.phone,
      body.productCode,
    );

    await this.auditService.logEvent({
      actorUserId: result.user.id,
      tenantId: result.user.tenantId ?? null,
      eventType: 'auth/signup',
      eventPayload: {
        organizationId: result.organization.id,
        productCode: body.productCode ?? null,
      },
      ip: clientIp,
      userAgent: getHeaderValue('user-agent'),
    });

    return result;
  }
}
