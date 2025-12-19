import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { eq } from 'drizzle-orm';
import { userAccount } from '@icaptur/database-schema';
import { MfaService } from './mfa.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/request.types';
import { DatabaseService } from '../../database/database.service';
import {
  MfaSetupResponseDto,
  MfaVerifyRequestDto,
  MfaVerifyResponseDto,
  MfaLoginVerifyRequestDto,
  MfaLoginVerifyResponseDto,
  MfaStatusResponseDto,
  MfaDisableResponseDto,
  MfaSmsSetupRequestDto,
  MfaSmsSetupResponseDto,
} from '../../dto/mfa/mfa.dto';

@ApiTags('MFA')
@Controller('mfa')
export class MfaController {
  constructor(
    private readonly mfaService: MfaService,
    private readonly authService: AuthService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * Initialize MFA setup (generate QR code and backup codes)
   */
  @Post('setup/init')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Initialize MFA setup' })
  @ApiResponse({
    status: 200,
    description: 'MFA setup initialized',
    type: MfaSetupResponseDto,
  })
  async initMfaSetup(
    @Request() req: AuthenticatedRequest,
  ): Promise<MfaSetupResponseDto> {
    const userId = req.user.userId;
    const userEmail = req.user.email;
    return this.mfaService.initMfaSetup(userId, userEmail);
  }

  /**
   * Verify TOTP code and enable MFA
   */
  @Post('setup/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code and enable MFA' })
  @ApiBody({ type: MfaVerifyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'MFA enabled successfully',
    type: MfaVerifyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid MFA code' })
  async verifyAndEnableMfa(
    @Request() req: AuthenticatedRequest,
    @Body() body: MfaVerifyRequestDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<MfaVerifyResponseDto> {
    const userId = req.user.userId;
    return this.mfaService.verifyAndEnableMfa(
      userId,
      body.code,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Verify MFA code during login
   */
  @Post('verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code during login' })
  @ApiBody({ type: MfaLoginVerifyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'MFA verification result with tokens',
    type: MfaLoginVerifyResponseDto,
  })
  async verifyMfaLogin(
    @Body() body: MfaLoginVerifyRequestDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<MfaLoginVerifyResponseDto> {
    // Validate tempToken if provided (security: ensure user went through login flow)
    if (body.tempToken) {
      try {
        const payload = this.authService.validateToken(body.tempToken);

        // Verify tempToken is for MFA and matches userId
        if (!payload.mfaRequired || payload.sub !== body.userId) {
          throw new UnauthorizedException('Invalid temporary token');
        }
      } catch {
        throw new UnauthorizedException(
          'Invalid or expired temporary token. Please login again.',
        );
      }
    }

    const isValid = await this.mfaService.verifyMfaLogin(
      body.userId,
      body.code,
      ipAddress,
      userAgent,
    );

    if (!isValid) {
      return { success: false };
    }

    // Get full user from database (getMe returns partial, we need full for token generation)
    const [userInfo] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.id, body.userId))
      .limit(1);

    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }

    // Generate tokens
    const productCode = body.productCode || 'accounts';
    const accessToken = await this.authService.generateAccessToken(
      userInfo,
      productCode,
    );
    const refreshToken = await this.authService.generateRefreshToken(
      body.userId,
    );

    return {
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour
      tokenType: 'Bearer',
      user: {
        id: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        role: userInfo.role,
        tenantId: userInfo.tenantId ?? null,
      },
    };
  }

  /**
   * Get MFA status for current user
   */
  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get MFA status' })
  @ApiResponse({
    status: 200,
    description: 'MFA status',
    type: MfaStatusResponseDto,
  })
  async getMfaStatus(
    @Request() req: AuthenticatedRequest,
  ): Promise<MfaStatusResponseDto> {
    const userId = req.user.userId;
    return this.mfaService.getMfaStatus(userId);
  }

  /**
   * Disable MFA
   */
  @Delete('disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable MFA' })
  @ApiResponse({
    status: 200,
    description: 'MFA disabled successfully',
    type: MfaDisableResponseDto,
  })
  async disableMfa(
    @Request() req: AuthenticatedRequest,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<MfaDisableResponseDto> {
    const userId = req.user.userId;
    await this.mfaService.disableMfa(userId, ipAddress, userAgent);
    return { success: true };
  }

  /**
   * Initialize SMS MFA setup
   */
  @Post('setup/init-sms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Initialize SMS MFA setup' })
  @ApiBody({ type: MfaSmsSetupRequestDto })
  @ApiResponse({
    status: 200,
    description: 'SMS MFA setup initialized',
    type: MfaSmsSetupResponseDto,
  })
  async initSmsMfaSetup(
    @Request() req: AuthenticatedRequest,
    @Body() body: MfaSmsSetupRequestDto,
  ): Promise<MfaSmsSetupResponseDto> {
    const userId = req.user.userId;
    return this.mfaService.initSmsMfaSetup(userId, body.phoneNumber);
  }

  /**
   * Verify SMS OTP code and enable SMS MFA
   */
  @Post('setup/verify-sms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify SMS OTP code and enable SMS MFA' })
  @ApiBody({ type: MfaVerifyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'SMS MFA enabled successfully',
    type: MfaVerifyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid OTP code' })
  async verifyAndEnableSmsMfa(
    @Request() req: AuthenticatedRequest,
    @Body() body: MfaVerifyRequestDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<MfaVerifyResponseDto> {
    const userId = req.user.userId;
    return this.mfaService.verifyAndEnableSmsMfa(
      userId,
      body.code,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Send SMS OTP code (for login or resend)
   */
  @Post('send-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send SMS OTP code' })
  @ApiResponse({
    status: 200,
    description: 'OTP code sent successfully',
  })
  @ApiResponse({ status: 404, description: 'SMS MFA not configured' })
  async sendSmsOtp(
    @Body() body: { userId: string },
  ): Promise<{ success: boolean }> {
    const success = await this.mfaService.sendSmsOtp(body.userId);
    return { success };
  }
}
