import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { eq } from 'drizzle-orm';
import { userAccount } from '@icaptur/database-schema';
import { DatabaseService } from '../../database/database.service';
import { OAuthService } from './oauth.service';
import { AuthService } from '../auth/auth.service';
import {
  TokenRequestDto,
  TokenResponseDto,
  TokenErrorResponseDto,
  GenerateCodeRequestDto,
  GenerateCodeResponseDto,
} from '../../dto/oauth/oauth.dto';

@ApiTags('OAuth2')
@Controller('oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oauthService: OAuthService,
    private readonly authService: AuthService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * OAuth2 Authorization Endpoint
   * Spec: RFC 6749 Section 3.1
   */
  @Get('authorize')
  @ApiOperation({
    summary: 'OAuth2 authorization endpoint',
    description: 'Initiates OAuth2 authorization code flow with PKCE support',
  })
  @ApiResponse({ status: 302, description: 'Redirect to login or callback' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiQuery({
    name: 'response_type',
    required: true,
    description: 'Must be "code"',
  })
  @ApiQuery({
    name: 'client_id',
    required: true,
    description: 'Product code (e.g., customer-portal)',
  })
  @ApiQuery({
    name: 'redirect_uri',
    required: true,
    description: 'Callback URL',
  })
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'Random state for CSRF protection',
  })
  @ApiQuery({
    name: 'code_challenge',
    required: false,
    description: 'PKCE code challenge (SHA-256)',
  })
  @ApiQuery({
    name: 'code_challenge_method',
    required: false,
    description: 'S256 or plain',
  })
  @ApiQuery({ name: 'scope', required: false, description: 'Requested scopes' })
  async authorize(
    @Query('response_type') responseType: string,
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query('code_challenge') codeChallenge?: string,
    @Query('code_challenge_method') codeChallengeMethod?: 'S256' | 'plain',
    @Query('scope') scope?: string,
  ) {
    this.logger.log(
      `OAuth2 authorize request: client_id=${clientId}, redirect_uri=${redirectUri}`,
    );

    // Validate required parameters
    if (responseType !== 'code') {
      return res.status(400).json({
        error: 'unsupported_response_type',
        error_description: 'Only response_type=code is supported',
      });
    }

    if (!clientId || !redirectUri || !state) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description:
          'Missing required parameters: client_id, redirect_uri, or state',
      });
    }

    // Check if user is already authenticated (check session cookie)
    const sessionToken = req.cookies?.['sso_session'] as string | undefined;
    let userId: string | null = null;

    if (sessionToken) {
      // Validate session token
      const sessionService = (req.app as { get: (key: string) => unknown }).get(
        'SessionService',
      ) as {
        validateSessionToken: (token: string) => Promise<string | null>;
      };
      userId = await sessionService.validateSessionToken(sessionToken);

      if (userId) {
        this.logger.log(`User ${userId} already authenticated via session`);
      }
    }

    if (!userId) {
      // User not authenticated → redirect to SSO login
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const loginUrl = new URL('/signin', baseUrl);

      // Preserve OAuth2 parameters
      loginUrl.searchParams.set('product', clientId);
      loginUrl.searchParams.set('redirect_uri', redirectUri);
      loginUrl.searchParams.set('state', state);

      if (codeChallenge) {
        loginUrl.searchParams.set('code_challenge', codeChallenge);
        loginUrl.searchParams.set(
          'code_challenge_method',
          codeChallengeMethod || 'S256',
        );
      }

      if (scope) {
        loginUrl.searchParams.set('scope', scope);
      }

      this.logger.log(`Redirecting to login: ${loginUrl.pathname}`);
      return res.redirect(loginUrl.toString());
    }

    // User authenticated → generate authorization code and redirect
    try {
      const code = await this.oauthService.generateAuthorizationCode(
        userId,
        clientId,
        redirectUri,
        codeChallenge,
        codeChallengeMethod || 'S256',
      );

      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('code', code);
      callbackUrl.searchParams.set('state', state);

      this.logger.log(`Redirecting to callback with authorization code`);
      return res.redirect(callbackUrl.toString());
    } catch (error) {
      this.logger.error(`Authorization error: ${(error as Error).message}`);
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('error', 'server_error');
      callbackUrl.searchParams.set('error_description', 'Authorization failed');
      callbackUrl.searchParams.set('state', state);
      return res.redirect(callbackUrl.toString());
    }
  }

  /**
   * OAuth2 Token Endpoint
   * Spec: RFC 6749 Section 3.2
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'OAuth2 token endpoint',
    description: 'Exchange authorization code for access token',
  })
  @ApiBody({ type: TokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token issued successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
    type: TokenErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid authorization code',
    type: TokenErrorResponseDto,
  })
  async token(@Body() body: TokenRequestDto): Promise<TokenResponseDto> {
    const { grant_type, code, redirect_uri, client_id, code_verifier } = body;
    this.logger.log(`Token exchange request: client_id=${client_id}`);

    // Validate grant type
    if (grant_type !== 'authorization_code') {
      throw new BadRequestException({
        error: 'unsupported_grant_type',
        error_description: 'Only grant_type=authorization_code is supported',
      });
    }

    // Validate required parameters
    if (!code || !redirect_uri || !client_id) {
      throw new BadRequestException({
        error: 'invalid_request',
        error_description: 'Missing required parameters',
      });
    }

    try {
      // Exchange code for user info
      const { userId, productCode } =
        await this.oauthService.exchangeCodeForToken(
          code,
          redirect_uri,
          client_id,
          code_verifier,
        );

      // Get full user from database (getMe returns partial, we need full for token generation)
      const [userInfo] = await this.db.db
        .select()
        .from(userAccount)
        .where(eq(userAccount.id, userId))
        .limit(1);

      if (!userInfo) {
        throw new UnauthorizedException('User not found');
      }

      // Generate tokens
      const accessToken = await this.authService.generateAccessToken(
        userInfo,
        productCode,
      );
      const refreshToken = await this.authService.generateRefreshToken(userId);
      const idToken = this.authService.generateIdToken(userInfo, productCode);

      this.logger.log(`Tokens issued successfully for user ${userId}`);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        id_token: idToken,
        token_type: 'Bearer',
        expires_in: 3600, // 1 hour
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(`Token exchange error: ${(error as Error).message}`);
      throw new BadRequestException({
        error: 'invalid_grant',
        error_description: 'Authorization code exchange failed',
      });
    }
  }

  /**
   * Generate authorization code (internal endpoint for SSO app)
   */
  @Post('generate-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate authorization code (internal)' })
  @ApiBody({ type: GenerateCodeRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Authorization code generated',
    type: GenerateCodeResponseDto,
  })
  async generateCode(
    @Body() body: GenerateCodeRequestDto,
  ): Promise<GenerateCodeResponseDto> {
    const code = await this.oauthService.generateAuthorizationCode(
      body.userId,
      body.productCode,
      body.redirectUri,
      body.codeChallenge,
      body.codeChallengeMethod,
    );

    return { code };
  }
}
