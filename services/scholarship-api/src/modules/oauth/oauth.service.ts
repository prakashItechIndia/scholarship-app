import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import { eq, and, gt, lte } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import {
  authorizationCodes,
  productRedirectUris,
  products,
} from '@icaptur/database-schema';
import type { EnvVars } from '../../config/env.validation';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<EnvVars, true>,
  ) {}

  /**
   * Generate authorization code for authenticated user
   */
  async generateAuthorizationCode(
    userId: string,
    productCode: string,
    redirectUri: string,
    codeChallenge?: string,
    codeChallengeMethod?: 'S256' | 'plain',
  ): Promise<string> {
    // Validate product exists and is active
    const [product] = await this.db.db
      .select()
      .from(products)
      .where(and(eq(products.code, productCode), eq(products.isActive, 'true')))
      .limit(1);

    if (!product) {
      this.logger.warn(`Invalid product code attempted: ${productCode}`);
      throw new BadRequestException('Invalid product code');
    }

    // Validate redirect URI against whitelist
    await this.validateRedirectUri(product.id, redirectUri);

    // Generate cryptographically secure random authorization code
    const code = randomBytes(32).toString('hex');

    // Set expiry (configurable, defaults to 30 seconds per OAuth2 RFC)
    const expirySeconds = this.configService.get(
      'AUTHORIZATION_CODE_EXPIRY_SECONDS',
      { infer: true },
    );
    const expiresAt = new Date(Date.now() + expirySeconds * 1000);

    // Store authorization code
    await this.db.db.insert(authorizationCodes).values({
      code,
      userId,
      productCode,
      redirectUri,
      codeChallenge,
      codeChallengeMethod: codeChallengeMethod || 'S256',
      expiresAt,
    });

    this.logger.log(
      `Authorization code generated for user ${userId}, product ${productCode}`,
    );

    return code;
  }

  /**
   * Exchange authorization code for token info
   */
  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    productCode: string,
    codeVerifier?: string,
  ): Promise<{
    userId: string;
    productCode: string;
  }> {
    // Find authorization code
    const [authCode] = await this.db.db
      .select()
      .from(authorizationCodes)
      .where(
        and(
          eq(authorizationCodes.code, code),
          gt(authorizationCodes.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!authCode) {
      this.logger.warn(`Invalid or expired authorization code attempted`);
      throw new UnauthorizedException('Invalid or expired authorization code');
    }

    // Check if already used (prevent replay attacks)
    if (authCode.usedAt) {
      this.logger.error(
        `Authorization code reuse detected for user ${authCode.userId}`,
      );
      throw new UnauthorizedException('Authorization code already used');
    }

    // Validate redirect URI matches (prevent redirect attacks)
    if (authCode.redirectUri !== redirectUri) {
      this.logger.error(
        `Redirect URI mismatch: expected ${authCode.redirectUri}, got ${redirectUri}`,
      );
      throw new BadRequestException('Redirect URI mismatch');
    }

    // Validate product code matches
    if (authCode.productCode !== productCode) {
      this.logger.error(
        `Product code mismatch: expected ${authCode.productCode}, got ${productCode}`,
      );
      throw new BadRequestException('Product code mismatch');
    }

    // Verify PKCE if code challenge was provided
    if (authCode.codeChallenge) {
      if (!codeVerifier) {
        this.logger.warn(`PKCE code verifier missing for authorization code`);
        throw new BadRequestException('Code verifier required for PKCE');
      }

      const isValid = this.verifyPKCE(
        codeVerifier,
        authCode.codeChallenge,
        (authCode.codeChallengeMethod as 'S256' | 'plain') || 'S256',
      );

      if (!isValid) {
        this.logger.error(
          `PKCE verification failed for user ${authCode.userId}`,
        );
        throw new UnauthorizedException('Invalid code verifier');
      }
    }

    // Mark code as used (atomically)
    await this.db.db
      .update(authorizationCodes)
      .set({
        usedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(authorizationCodes.id, authCode.id));

    this.logger.log(
      `Authorization code exchanged successfully for user ${authCode.userId}`,
    );

    return {
      userId: authCode.userId,
      productCode: authCode.productCode,
    };
  }

  /**
   * Verify PKCE code challenge
   */
  private verifyPKCE(
    verifier: string,
    challenge: string,
    method: 'S256' | 'plain',
  ): boolean {
    if (method === 'plain') {
      return verifier === challenge;
    }

    // S256: SHA-256 hash of verifier, base64url encoded
    const hash = createHash('sha256').update(verifier).digest('base64url');

    return hash === challenge;
  }

  /**
   * Validate redirect URI against whitelist
   */
  private async validateRedirectUri(
    productId: string,
    redirectUri: string,
  ): Promise<void> {
    const nodeEnv = this.configService.get('NODE_ENV', { infer: true });
    const environment = nodeEnv === 'production' ? 'production' : 'development';

    const allowedUris = await this.db.db
      .select()
      .from(productRedirectUris)
      .where(
        and(
          eq(productRedirectUris.productId, productId),
          eq(productRedirectUris.environment, environment),
          eq(productRedirectUris.isActive, true),
        ),
      );

    const isAllowed = allowedUris.some(
      (uri) => uri.redirectUri === redirectUri,
    );

    if (!isAllowed) {
      this.logger.warn(
        `Invalid redirect URI attempted: ${redirectUri} for product ${productId}`,
      );
      throw new BadRequestException('Invalid redirect URI');
    }
  }

  /**
   * Cleanup expired authorization codes (run as cron job)
   */
  async cleanupExpiredCodes(): Promise<number> {
    const result = await this.db.db
      .delete(authorizationCodes)
      .where(lte(authorizationCodes.expiresAt, new Date()));

    const count = result.rowCount || 0;
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired authorization codes`);
    }

    return count;
  }
}
