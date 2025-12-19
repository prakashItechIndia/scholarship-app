import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SessionService } from './session.service';
import { AuthenticatedRequest } from '../../common/types/request.types';
import { LogoutAllSessionsResponseDto } from '../../dto/auth/session.dto';

@ApiTags('Authentication')
@Controller('auth')
export class LogoutController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user from all products (Single Logout)',
    description:
      'Terminates the SSO session and logs the user out from all connected products',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: LogoutAllSessionsResponseDto,
  })
  async logoutAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<LogoutAllSessionsResponseDto> {
    const userId = req.user.userId;
    const revokedTokens = await this.sessionService.logoutAllProducts(
      userId,
      'user_initiated',
    );

    return {
      success: true,
      sessionsInvalidated: revokedTokens.length,
    };
  }

  @Post('logout/product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout from specific product',
    description: 'Terminates the session for a specific product only',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out from product',
  })
  async logoutProduct(
    @Request() req: AuthenticatedRequest,
    @Body('productCode') productCode: string,
  ) {
    const userId = req.user.userId;
    const revokedToken = await this.sessionService.logoutProduct(
      userId,
      productCode,
    );

    return {
      success: true,
      message: `Logged out from ${productCode}`,
      tokenRevoked: revokedToken !== null,
    };
  }

  @Post('admin/revoke-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin: Revoke all sessions for a user',
    description: 'Admin endpoint to forcefully logout a user from all products',
  })
  @ApiResponse({ status: 200, description: 'Sessions revoked successfully' })
  async adminRevokeUserSessions(
    @Body('userId') targetUserId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // TODO: Add admin role check
    const adminUserId = req.user.userId;
    const revokedTokens = await this.sessionService.logoutAllProducts(
      targetUserId,
      'admin_revoked',
    );

    return {
      success: true,
      message: `All sessions revoked for user ${targetUserId}`,
      revokedBy: adminUserId,
      revokedTokenCount: revokedTokens.length,
    };
  }
}
