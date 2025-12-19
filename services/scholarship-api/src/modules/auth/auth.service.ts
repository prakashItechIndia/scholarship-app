import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { eq, and, gt, isNull } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';
import { CognitoService } from '../cognito/cognito.service';
import { ZohoCrmService } from '../crm/zoho-crm.service';
import { FirebaseService } from '../shared/firebase.service';
import {
  userAccount,
  refreshToken,
  passwordResetToken,
  tenant,
  tenantProductSubscriptions,
  products,
  userMfaConfig,
  productRole,
  userProductPermissions,
} from '@icaptur/database-schema';
import { EnvVars } from '../../config/env.validation';
import * as geoip from 'geoip-lite';
import { PasswordValidator } from '../../common/utils/password-validator';
import { USER_ROLES } from '@icaptur/shared-utils';

export interface LoginDto {
  email: string;
  password: string;
  productCode?: string;
}

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  tenantId: string | null;
  role: string;
  aud: string; // product code (audience)
  iss?: string; // issuer (added by jwt when configured)
  exp?: number;
  iat?: number;
  jti: string; // JWT ID
  firstName: string;
  lastName: string;
  isOrganizationAdmin: boolean;
  organizationId?: string | null;
  // Invox/product-specific fields
  userType?: string; // 'ORG_ADMIN', 'INDEXER', etc.
  roleId?: string | null; // UUID of the product role
  productRoles?: Record<string, string[]>; // productCode -> role codes
  // MFA fields
  mfaRequired?: boolean; // Indicates if MFA is required for this token
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Detect country and Zoho region from client IP
   */
  private detectCountryFromIp(clientIp?: string): {
    country: string;
    zohoAccountRegion: 'india' | 'international';
  } {
    let country = 'US'; // Default to US if detection fails
    let zohoAccountRegion: 'india' | 'international' = 'international';

    if (clientIp) {
      // Skip localhost IPs
      const isLocalhost = ['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(
        clientIp,
      );

      if (isLocalhost) {
        this.logger.debug(
          `Localhost IP (${clientIp}) → Default: US, Zoho: international`,
        );
      } else {
        try {
          const geo = (
            geoip as { lookup: (ip: string) => { country?: string } | null }
          ).lookup(clientIp);
          if (geo && geo.country) {
            country = geo.country;
            zohoAccountRegion = country === 'IN' ? 'india' : 'international';
            this.logger.log(
              `✓ IP ${clientIp} → Country: ${country}, Zoho: ${zohoAccountRegion}`,
            );
          } else {
            this.logger.warn(
              `⚠ Could not detect country from IP ${clientIp} → Default: US`,
            );
          }
        } catch (error) {
          this.logger.warn(
            `⚠ Error detecting country from IP ${clientIp} → Default: US`,
            error,
          );
        }
      }
    } else {
      this.logger.debug('No client IP → Default: US');
    }

    return { country, zohoAccountRegion };
  }

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly emailService: EmailService,
    private readonly cognitoService: CognitoService,
    private readonly zohoCrmService: ZohoCrmService,
    private readonly firebaseService: FirebaseService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(email: string, password: string) {
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockoutMinutes = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Account is locked. Try again in ${lockoutMinutes} minutes.`,
      );
    }

    // Check if account is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Try Cognito authentication first (if enabled and user has cognito_sub)
    if (
      this.cognitoService.isEnabled() &&
      user.cognitoSub &&
      !this.cognitoService.isLocalBypassSub(user.cognitoSub)
    ) {
      try {
        const cognitoResult = await this.cognitoService.authenticate(
          email,
          password,
        );

        if (cognitoResult) {
          // Cognito authentication successful
          // Reset failed login attempts
          if (user.failedLoginAttempts !== '0') {
            await this.db.db
              .update(userAccount)
              .set({
                failedLoginAttempts: '0',
                lockedUntil: null,
              })
              .where(eq(userAccount.id, user.id));
          }

          // Return user without password hash
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
      } catch {
        // Cognito authentication failed, fall back to local authentication
        // This allows migration period where some users might still use local passwords
      }
    }

    // Local authentication (development bypass mode or fallback)
    // Validate password
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Password not set. Please activate your account.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts =
        Number.parseInt(user.failedLoginAttempts || '0', 10) + 1;
      const updateData: Partial<typeof userAccount.$inferInsert> = {
        failedLoginAttempts: failedAttempts.toString(),
        lastFailedLoginAt: new Date(),
      };

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        const lockoutUntil = new Date();
        lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 30);
        updateData.lockedUntil = lockoutUntil;
      }

      await this.db.db
        .update(userAccount)
        .set(updateData)
        .where(eq(userAccount.id, user.id));

      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts !== '0') {
      await this.db.db
        .update(userAccount)
        .set({
          failedLoginAttempts: '0',
          lockedUntil: null,
        })
        .where(eq(userAccount.id, user.id));
    }

    // Return user without password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Check if Customer Portal is enabled for a tenant's "API AS A Service" subscription
   * This controls Customer Portal UI access only, NOT API access or Experience Platform access
   */
  async checkTenantPortalEnabled(
    tenantId: string | null,
    productCode: string,
  ): Promise<boolean> {
    // Only check for "API AS A Service" product
    if (productCode !== 'api_as_a_service') {
      return true; // Portal enable check doesn't apply to other products
    }

    // If no tenant, can't check subscription
    if (!tenantId) {
      return false;
    }

    try {
      // Get product by code
      const [product] = await this.db.db
        .select()
        .from(products)
        .where(eq(products.code, productCode))
        .limit(1);

      if (!product) {
        this.logger.warn(
          `Product with code "${productCode}" not found for portal enable check`,
        );
        return false;
      }

      // Get tenant's subscription for this product
      const [subscription] = await this.db.db
        .select()
        .from(tenantProductSubscriptions)
        .where(
          and(
            eq(tenantProductSubscriptions.tenantId, tenantId),
            eq(tenantProductSubscriptions.productId, product.id),
            eq(tenantProductSubscriptions.status, 'active'), // Only check active subscriptions
          ),
        )
        .limit(1);

      if (!subscription) {
        this.logger.debug(
          `No active subscription found for tenant ${tenantId} and product ${productCode}`,
        );
        return false;
      }

      // Check portal_enable flag (from subscription, not product)
      const isEnabled =
        (subscription as { portalEnable?: string | null }).portalEnable ===
        'true';
      this.logger.debug(
        `Portal enable check for tenant ${tenantId}, product ${productCode}: ${isEnabled}`,
      );
      return isEnabled;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error checking portal enable for tenant ${tenantId}, product ${productCode}: ${errorMessage}`,
      );
      // Fail closed - if we can't check, don't allow access
      return false;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Check portal enable for "API AS A Service" product
    const productCode = loginDto.productCode || 'accounts';
    if (productCode === 'api_as_a_service') {
      const portalEnabled = await this.checkTenantPortalEnabled(
        user.tenantId,
        productCode,
      );
      if (!portalEnabled) {
        throw new UnauthorizedException(
          'Customer Portal access is not enabled for your organization. Please contact your administrator or use API integration.',
        );
      }
    }

    // Check MFA requirement from user_mfa_config table
    let mfaConfig: typeof userMfaConfig.$inferSelect | undefined;
    try {
      [mfaConfig] = await this.db.db
        .select()
        .from(userMfaConfig)
        .where(
          and(
            eq(userMfaConfig.userId, user.id),
            eq(userMfaConfig.mfaEnabled, true),
          ),
        )
        .limit(1);
    } catch (error) {
      this.logger.error(
        `Failed to fetch MFA configuration for user ${user.id}. Proceeding without MFA requirement.`,
        error,
      );
      mfaConfig = undefined;
    }

    if (mfaConfig) {
      // Return temporary token for MFA verification
      const tempToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          mfaRequired: true,
        },
        { expiresIn: '5m' },
      );

      return {
        mfaRequired: true,
        tempToken,
        userId: user.id,
      };
    }

    // Generate tokens (productCode already set above)
    const accessToken = await this.generateAccessToken(user, productCode);
    const refreshToken = await this.generateRefreshToken(user.id);

    // If user has firebaseUid but no firebaseIdToken, generate and store it
    // This ensures the token is available for Python API calls
    if (user.firebaseUid && !user.firebaseIdToken) {
      try {
        const tokenResult = await this.firebaseService.getIdToken(
          user.firebaseUid,
          null,
          null,
        );
        await this.db.db
          .update(userAccount)
          .set({
            firebaseIdToken: tokenResult.idToken,
            firebaseIdTokenExpiresAt: tokenResult.expiresAt,
            updatedAt: new Date(),
          })
          .where(eq(userAccount.id, user.id));
        this.logger.log(
          `Firebase ID token generated and stored for user ${user.id} during login`,
        );
      } catch (error) {
        // Log error but don't fail login - token can be generated later
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Failed to generate Firebase ID token for user ${user.id} during login: ${errorMessage}. Token will be generated on first API call.`,
        );
      }
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async generateAccessToken(
    user: Omit<typeof userAccount.$inferSelect, 'passwordHash'>,
    productCode: string,
  ) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId ?? null, // Explicitly set to null if undefined to ensure it's included in JWT
      role: user.role,
      aud: productCode,
      iat: issuedAt,
      jti: `${user.id}-${issuedAt}`, // Unique token ID
      firstName: user.firstName,
      lastName: user.lastName,
      isOrganizationAdmin: !!user.tenantId,
      organizationId: user.tenantId ?? null,
    };

    let productRoleRecord:
      | (typeof productRole.$inferSelect & { productCode: string })
      | null = null;
    let productRoleCodes: string[] = [];

    // Optimized: Single query with join instead of 2 sequential queries
    if (productCode && productCode !== 'accounts') {
      const [result] = await this.db.db
        .select({
          productId: products.id,
          productCode: products.code,
          roleId: productRole.id,
          roleProductId: productRole.productId,
          roleCode: productRole.code,
          roleName: productRole.name,
          roleDescription: productRole.description,
          roleModules: productRole.modules,
          roleIsActive: productRole.isActive,
          roleCreatedAt: productRole.createdAt,
          roleUpdatedAt: productRole.updatedAt,
        })
        .from(products)
        .leftJoin(
          productRole,
          and(
            eq(productRole.productId, products.id),
            eq(productRole.code, user.role),
          ),
        )
        .where(eq(products.code, productCode))
        .limit(1);

      if (result && result.productId) {
        if (result.roleId) {
          productRoleRecord = {
            id: result.roleId,
            productId: result.roleProductId!,
            code: result.roleCode!,
            name: result.roleName!,
            description: result.roleDescription!,
            modules: result.roleModules!,
            isActive: result.roleIsActive!,
            createdAt: result.roleCreatedAt!,
            updatedAt: result.roleUpdatedAt!,
            productCode: result.productCode,
          };
        }
        // Fetch assigned product roles for this user/product
        const assignments = await this.getUserProductRolesForProduct(
          user.id,
          result.productId,
        );
        productRoleCodes = assignments.map((a) => a.roleCode);
        if (productRoleCodes.length > 0) {
          payload.productRoles = { [productCode]: productRoleCodes };
        }
      }
    }

    // Add invox-specific fields when productCode is 'invox'
    if (productCode === 'invox') {
      const selectedRoleCode =
        productRoleCodes[0] ??
        productRoleRecord?.code ??
        (user.role === USER_ROLES.ORG_ADMIN ? 'ORG_ADMIN' : 'INDEXER');

      payload.productRoles = payload.productRoles ?? {
        [productCode]: selectedRoleCode ? [selectedRoleCode] : [],
      };

      payload.userType = selectedRoleCode;
      payload.roleId = productRoleRecord?.id ?? null;
    }

    if ('iss' in payload) {
      delete payload.iss;
    }

    return this.jwtService.sign(payload);
  }

  /**
   * Generate ID token (OIDC) - contains user profile information
   * Used by frontend to display user info (not for API calls)
   */
  generateIdToken(
    user: Omit<typeof userAccount.$inferSelect, 'passwordHash'>,
    productCode: string,
  ): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const ssoIssuer =
      this.configService.get('SSO_ISSUER', { infer: true }) ||
      'https://sso.icaptur.ai';

    // ID token includes all access token claims plus additional profile claims
    const payload: TokenPayload & {
      given_name: string;
      family_name: string;
      picture?: string;
      exp: number;
    } = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId ?? null,
      role: user.role,
      aud: productCode,
      iss: ssoIssuer,
      iat: issuedAt,
      exp: issuedAt + 3600, // 1 hour expiry
      jti: `${user.id}-id-${issuedAt}`,
      firstName: user.firstName,
      lastName: user.lastName,
      isOrganizationAdmin: !!user.tenantId,
      organizationId: user.tenantId ?? null,
      // OIDC standard claims
      given_name: user.firstName,
      family_name: user.lastName,
      picture: user.profilePictureKey
        ? `${this.configService.get('S3_PUBLIC_URL', { infer: true }) || ''}/${user.profilePictureKey}`
        : undefined,
    };

    return this.jwtService.sign(payload);
  }

  private async getUserProductRolesForProduct(
    userId: string,
    productId: string,
  ) {
    const rows = await this.db.db
      .select({
        roleCode: userProductPermissions.featureCode,
        roleId: productRole.id,
      })
      .from(userProductPermissions)
      .leftJoin(
        productRole,
        and(
          eq(productRole.productId, userProductPermissions.productId),
          eq(productRole.code, userProductPermissions.featureCode),
        ),
      )
      .where(
        and(
          eq(userProductPermissions.userId, userId),
          eq(userProductPermissions.productId, productId),
        ),
      );

    return rows;
  }

  async generateRefreshToken(userId: string): Promise<string> {
    // Generate a secure random token
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Calculate expiry (7 days in dev, 30 days in prod - using 7 days for now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await this.db.db.insert(refreshToken).values({
      userId,
      tokenHash,
      expiresAt,
    });

    return token;
  }

  async validateRefreshToken(
    token: string,
  ): Promise<typeof refreshToken.$inferSelect> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const [storedToken] = await this.db.db
      .select()
      .from(refreshToken)
      .where(
        and(
          eq(refreshToken.tokenHash, tokenHash),
          gt(refreshToken.expiresAt, new Date()),
          isNull(refreshToken.revokedAt),
        ),
      )
      .limit(1);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return storedToken;
  }

  async refreshAccessToken(
    refreshTokenValue: string,
    productCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.validateRefreshToken(refreshTokenValue);

    // Get user
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.id, storedToken.userId))
      .limit(1);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Check portal enable for "API AS A Service" product
    if (productCode === 'api_as_a_service') {
      const portalEnabled = await this.checkTenantPortalEnabled(
        user.tenantId,
        productCode,
      );
      if (!portalEnabled) {
        throw new UnauthorizedException(
          'Customer Portal access is not enabled for your organization. Please contact your administrator or use API integration.',
        );
      }
    }

    // Generate new tokens first
    const newAccessToken = await this.generateAccessToken(user, productCode);
    const newRefreshTokenValue = await this.generateRefreshToken(user.id);

    // Get the newly created token record to link it
    const newTokenHash = createHash('sha256')
      .update(newRefreshTokenValue)
      .digest('hex');
    const [newTokenRecord] = await this.db.db
      .select()
      .from(refreshToken)
      .where(eq(refreshToken.tokenHash, newTokenHash))
      .limit(1);

    // Revoke old refresh token and link to new one
    if (newTokenRecord) {
      await this.db.db
        .update(refreshToken)
        .set({
          revokedAt: new Date(),
          replacedByTokenId: newTokenRecord.id,
        })
        .where(eq(refreshToken.id, storedToken.id));
    } else {
      // Fallback: just revoke if we can't find the new token (shouldn't happen)
      await this.db.db
        .update(refreshToken)
        .set({ revokedAt: new Date() })
        .where(eq(refreshToken.id, storedToken.id));
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenValue,
    };
  }

  async revokeRefreshToken(token: string): Promise<{ userId: string } | null> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Get the token record to extract userId before revoking
    const [tokenRecord] = await this.db.db
      .select({ userId: refreshToken.userId })
      .from(refreshToken)
      .where(
        and(
          eq(refreshToken.tokenHash, tokenHash),
          isNull(refreshToken.revokedAt),
        ),
      )
      .limit(1);

    if (!tokenRecord) {
      return null;
    }

    // Revoke the token
    await this.db.db
      .update(refreshToken)
      .set({ revokedAt: new Date() })
      .where(eq(refreshToken.tokenHash, tokenHash));

    return { userId: tokenRecord.userId };
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.db.db
      .update(refreshToken)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(refreshToken.userId, userId), isNull(refreshToken.revokedAt)),
      );
  }

  validateToken(token: string): TokenPayload {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getMe(userId: string) {
    const [user] = await this.db.db
      .select({
        id: userAccount.id,
        email: userAccount.email,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        role: userAccount.role,
        tenantId: userAccount.tenantId,
        status: userAccount.status,
        phone: userAccount.phone,
        profilePictureKey: userAccount.profilePictureKey,
      })
      .from(userAccount)
      .where(eq(userAccount.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async requestPasswordReset(
    email: string,
    returnUrl?: string,
    productCode?: string,
  ) {
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.email, email))
      .limit(1);

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Store token
    await this.db.db.insert(passwordResetToken).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Send email with reset link (including returnUrl/productCode for redirect back)
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      resetToken,
      returnUrl,
      productCode,
    );

    return {
      message: 'If the email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash the provided token to compare with stored hash
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Find token by hash
    const [validToken] = await this.db.db
      .select()
      .from(passwordResetToken)
      .where(
        and(
          eq(passwordResetToken.tokenHash, tokenHash),
          isNull(passwordResetToken.usedAt),
          gt(passwordResetToken.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Get user to validate password and check cognito_sub
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.id, validToken.userId))
      .limit(1);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate password strength according to BRD requirements
    PasswordValidator.validatePasswordOrThrow(
      newPassword,
      user.email,
      user.firstName,
      user.lastName,
    );

    // If Cognito is enabled and user has real cognito_sub, update in Cognito
    if (
      this.cognitoService.isEnabled() &&
      user.cognitoSub &&
      !this.cognitoService.isLocalBypassSub(user.cognitoSub)
    ) {
      try {
        await this.cognitoService.setUserPassword(
          user.cognitoSub,
          newPassword,
          true,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to update password in Cognito, falling back to local storage`,
          error,
        );
      }
    }

    // Always store password locally (for bypass mode or fallback)
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.db.db
      .update(userAccount)
      .set({ passwordHash })
      .where(eq(userAccount.id, validToken.userId));

    // Sync password to Firebase Auth if user has Firebase account
    if (user.firebaseUid) {
      try {
        await this.firebaseService.updatePassword(
          user.firebaseUid,
          newPassword,
        );
        this.logger.log(
          `Firebase password synced for user ${validToken.userId} (firebaseUid: ${user.firebaseUid})`,
        );
      } catch (error) {
        // Log error but don't fail password reset
        this.logger.warn(
          `Failed to sync password to Firebase for user ${validToken.userId}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    // Invalidate all refresh tokens for this user (security requirement per BRD)
    await this.db.db
      .update(refreshToken)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(refreshToken.userId, validToken.userId),
          isNull(refreshToken.revokedAt),
        ),
      );

    // Mark token as used
    await this.db.db
      .update(passwordResetToken)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetToken.id, validToken.id));

    this.logger.log(
      `Password reset completed for user ${validToken.userId}. All refresh tokens invalidated.`,
    );

    // Send password changed confirmation email
    try {
      await this.emailService.sendPasswordChangedEmail(
        user.email,
        user.firstName,
      );
    } catch (error: unknown) {
      // Log error but don't fail password reset
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to send password changed email to ${user.email}: ${errorMessage}`,
      );
    }

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    productCode: string = 'accounts',
  ) {
    // Get user to validate current password and get user info
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    // Try Cognito first if enabled
    if (
      this.cognitoService.isEnabled() &&
      user.cognitoSub &&
      !this.cognitoService.isLocalBypassSub(user.cognitoSub)
    ) {
      try {
        // Verify password using Cognito
        const cognitoResult = await this.cognitoService.authenticate(
          user.email,
          currentPassword,
        );
        if (!cognitoResult) {
          throw new UnauthorizedException('Current password is incorrect');
        }
      } catch {
        // If Cognito verification fails, try local password
        if (!user.passwordHash) {
          throw new UnauthorizedException('Current password is incorrect');
        }
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          user.passwordHash,
        );
        if (!isPasswordValid) {
          throw new UnauthorizedException('Current password is incorrect');
        }
      }
    } else {
      // Local authentication only
      if (!user.passwordHash) {
        throw new UnauthorizedException('Password not set');
      }
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    // Validate new password strength according to BRD requirements
    PasswordValidator.validatePasswordOrThrow(
      newPassword,
      user.email,
      user.firstName,
      user.lastName,
    );

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // If Cognito is enabled and user has real cognito_sub, update in Cognito
    if (
      this.cognitoService.isEnabled() &&
      user.cognitoSub &&
      !this.cognitoService.isLocalBypassSub(user.cognitoSub)
    ) {
      try {
        await this.cognitoService.setUserPassword(
          user.cognitoSub,
          newPassword,
          true,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to update password in Cognito, falling back to local storage`,
          error,
        );
      }
    }

    // Always store password locally (for bypass mode or fallback)
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.db.db
      .update(userAccount)
      .set({ passwordHash })
      .where(eq(userAccount.id, userId));

    // Sync password to Firebase Auth if user has Firebase account
    if (user.firebaseUid) {
      try {
        await this.firebaseService.updatePassword(
          user.firebaseUid,
          newPassword,
        );
        this.logger.log(
          `Firebase password synced for user ${userId} (firebaseUid: ${user.firebaseUid})`,
        );
      } catch (error) {
        // Log error but don't fail password change
        this.logger.warn(
          `Failed to sync password to Firebase for user ${userId}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    // Invalidate all refresh tokens for this user (security requirement per BRD)
    await this.db.db
      .update(refreshToken)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(refreshToken.userId, userId), isNull(refreshToken.revokedAt)),
      );

    this.logger.log(
      `Password changed for user ${userId}. All refresh tokens invalidated.`,
    );

    // Issue fresh tokens so the current session stays authenticated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHashUnused, ...userWithoutPassword } = user;
    const tokenProductCode = productCode || 'accounts';
    const accessToken = await this.generateAccessToken(
      userWithoutPassword,
      tokenProductCode,
    );
    const newRefreshToken = await this.generateRefreshToken(user.id);

    // Send password changed confirmation email
    try {
      await this.emailService.sendPasswordChangedEmail(
        user.email,
        user.firstName,
      );
    } catch (error: unknown) {
      // Log error but don't fail password change
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to send password changed email to ${user.email}: ${errorMessage}`,
      );
    }

    return {
      message: 'Password changed successfully',
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId ?? null,
      },
    };
  }

  async validateActivationToken(token: string) {
    const [user] = await this.db.db
      .select({
        id: userAccount.id,
        email: userAccount.email,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        status: userAccount.status,
        activationToken: userAccount.activationToken,
        activationTokenExpiresAt: userAccount.activationTokenExpiresAt,
      })
      .from(userAccount)
      .where(eq(userAccount.activationToken, token))
      .limit(1);

    if (!user) {
      return { valid: false, message: 'Invalid activation token' };
    }

    if (user.status === 'active') {
      return { valid: false, message: 'Account is already activated' };
    }

    if (
      user.activationTokenExpiresAt &&
      new Date(user.activationTokenExpiresAt) < new Date()
    ) {
      return { valid: false, message: 'Activation token has expired' };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async createPassword(token: string, password: string) {
    // Validate activation token first to get user info
    const validation = await this.validateActivationToken(token);
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const userId = validation.user!.id;
    const validationUser = validation.user!;

    // Validate password strength according to BRD requirements
    PasswordValidator.validatePasswordOrThrow(
      password,
      validationUser.email,
      validationUser.firstName,
      validationUser.lastName,
    );

    // Get user to check if they have cognito_sub
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.id, userId))
      .limit(1);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // If Cognito is enabled and user doesn't have a local bypass sub, create/update in Cognito
    if (
      this.cognitoService.isEnabled() &&
      user.cognitoSub &&
      !this.cognitoService.isLocalBypassSub(user.cognitoSub)
    ) {
      try {
        // Set password in Cognito
        await this.cognitoService.setUserPassword(
          user.cognitoSub,
          password,
          true,
        );
      } catch (error) {
        // If Cognito fails, fall back to local password storage
        this.logger.warn(
          `Failed to set password in Cognito for user ${String(userId)}, falling back to local storage`,
          error,
        );
      }
    }

    // Always store password locally (for bypass mode or fallback)
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate cognito_sub if not exists (for local bypass mode)
    let cognitoSub = user.cognitoSub;
    if (!cognitoSub || this.cognitoService.isLocalBypassSub(cognitoSub)) {
      if (this.cognitoService.isEnabled()) {
        // Try to create user in Cognito
        try {
          cognitoSub = await this.cognitoService.createUser(
            user.email,
            user.firstName,
            user.lastName,
            password,
          );
          // Set permanent password
          if (!this.cognitoService.isLocalBypassSub(cognitoSub)) {
            await this.cognitoService.setUserPassword(
              cognitoSub,
              password,
              true,
            );
          }
        } catch (error) {
          // If Cognito creation fails, use local bypass sub
          this.logger.warn(
            `Failed to create user in Cognito, using local bypass mode`,
            error,
          );
          cognitoSub = this.cognitoService.generateLocalBypassSub();
        }
      } else {
        // Bypass mode - generate local sub
        cognitoSub = this.cognitoService.generateLocalBypassSub();
      }
    }

    // Update user: set password, cognito_sub, and activate account
    await this.db.db
      .update(userAccount)
      .set({
        passwordHash,
        cognitoSub,
        status: 'active',
        activationToken: null,
        activationTokenExpiresAt: null,
      })
      .where(eq(userAccount.id, userId));

    // Invalidate any existing refresh tokens for this user (security requirement per BRD)
    // This ensures that if user had any tokens before activation, they're invalidated
    await this.db.db
      .update(refreshToken)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(refreshToken.userId, userId), isNull(refreshToken.revokedAt)),
      );

    this.logger.log(
      `Password created and account activated for user ${String(userId)}. Any existing refresh tokens invalidated.`,
    );

    // If this user is an org_admin and linked to a tenant, mark the tenant
    // as "active" when their account is first activated. This moves the
    // organization from "invited" → "active" in the onboarding flow.
    if (user.tenantId && user.role === USER_ROLES.ORG_ADMIN) {
      try {
        await this.db.db
          .update(tenant)
          .set({
            status: 'active',
            updatedAt: new Date(),
          })
          .where(eq(tenant.id, user.tenantId));
        this.logger.log(
          `Tenant ${String(
            user.tenantId,
          )} status updated to 'active' after org_admin activation`,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to update tenant status to 'active' for tenant ${String(
            user.tenantId,
          )} after user activation: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    // Create or sync Firebase user after account activation (only for experience-app users)
    // If firebaseUid already exists, still refresh token/profile
    try {
      // Get user's phone number (state and country are not in user_account table)
      const phoneNumber = user.phone ?? null;
      // Normalize phone for Firebase (E.164). If invalid, skip sending phone to Firebase to avoid errors.
      const normalizePhone = (raw: string | null): string | undefined => {
        if (!raw) return undefined;
        const trimmed = raw.trim();
        // If it already looks like E.164 with leading + and 10-15 digits
        const e164Regex = /^\+?[1-9]\d{9,14}$/;
        if (!e164Regex.test(trimmed)) {
          this.logger.warn(
            `Skipping phone for Firebase (invalid format): "${trimmed}" for user ${String(
              userId,
            )}`,
          );
          return undefined;
        }
        // Ensure it has a leading +
        return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
      };
      const phoneForFirebase = normalizePhone(phoneNumber);
      const state = null; // State is not stored in user_account table
      const country = null; // Country is not stored in user_account table

      let firebaseUid = user.firebaseUid ?? null;

      // Try to create Firebase Auth user if missing
      if (!firebaseUid) {
        try {
          firebaseUid = await this.firebaseService.createUser({
            email: user.email,
            password,
            phoneNumber: phoneForFirebase,
          });
        } catch (createErr) {
          const code = (createErr as { code?: string })?.code;
          const message =
            createErr instanceof Error ? createErr.message : String(createErr);

          // If user already exists in Firebase, fetch by email or phone and reuse UID
          if (
            code === 'auth/email-already-exists' ||
            message.includes('already exists')
          ) {
            const existingByEmail = await this.firebaseService.getUserByEmail(
              user.email,
            );
            if (existingByEmail) {
              firebaseUid = existingByEmail.uid;
              this.logger.warn(
                `Firebase user already existed for ${user.email}, reusing uid ${firebaseUid}`,
              );
            } else {
              throw createErr;
            }
          } else if (code === 'auth/phone-number-already-exists') {
            const existingByPhone =
              phoneForFirebase &&
              (await this.firebaseService.getUserByPhoneNumber(
                phoneForFirebase,
              ));
            if (
              existingByPhone &&
              existingByPhone.email?.toLowerCase() === user.email.toLowerCase()
            ) {
              firebaseUid = existingByPhone.uid;
              this.logger.warn(
                `Firebase user already existed with phone ${phoneForFirebase}, reusing uid ${firebaseUid}`,
              );
            } else {
              // phone is taken by another account - block activation
              throw new BadRequestException(
                'Phone number already exists. Please use a different phone number.',
              );
            }
          } else {
            throw createErr;
          }
        }
      }

      if (!firebaseUid) {
        throw new Error('Firebase UID is null after create/get by email');
      }

      // Build organization name for Firestore profile
      let organizationName: string | null = null;
      if (user.tenantId) {
        const [tenantRecord] = await this.db.db
          .select({
            orgName: tenant.orgName,
          })
          .from(tenant)
          .where(eq(tenant.id, user.tenantId))
          .limit(1);
        if (tenantRecord) {
          organizationName = tenantRecord.orgName;
        }
      }

      // Store Firestore profile
      await this.firebaseService.setFirestoreUser(firebaseUid, {
        organization: organizationName,
        phone_number: phoneNumber,
        state: state,
        country: country,
        mfa_enabled: false,
      });

      // Get Firebase ID token and store it in database
      let firebaseIdToken: string | null = null;
      let firebaseIdTokenExpiresAt: Date | null = null;
      try {
        const tokenResult = await this.firebaseService.getIdToken(
          firebaseUid,
          user.firebaseIdToken ?? null,
          user.firebaseIdTokenExpiresAt ?? null,
        );
        firebaseIdToken = tokenResult.idToken;
        firebaseIdTokenExpiresAt = tokenResult.expiresAt;
        this.logger.log(
          `Firebase ID token generated for user ${String(
            userId,
          )} (firebaseUid: ${firebaseUid})`,
        );
      } catch (error) {
        // Log error but don't fail - token can be generated later
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Failed to generate Firebase ID token for user ${String(
            userId,
          )}: ${errorMessage}. Token will be generated on first API call.`,
        );
      }

      // Update database with firebaseUid and idToken
      await this.db.db
        .update(userAccount)
        .set({
          firebaseUid,
          firebaseIdToken,
          firebaseIdTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(userAccount.id, userId));

      this.logger.log(
        `Firebase user created/synced for user ${String(
          userId,
        )} (firebaseUid: ${firebaseUid})`,
      );

      // Python API Integration: Register user with Python API if org_admin with "API AS A Service" subscription
      if (user.role === USER_ROLES.ORG_ADMIN && user.tenantId && firebaseUid) {
        try {
          // Check if user has "API AS A Service" subscription
          const [apiProduct] = await this.db.db
            .select()
            .from(products)
            .where(eq(products.code, 'api_as_a_service'))
            .limit(1);

          if (apiProduct) {
            const [subscription] = await this.db.db
              .select()
              .from(tenantProductSubscriptions)
              .where(
                and(
                  eq(tenantProductSubscriptions.tenantId, user.tenantId),
                  eq(tenantProductSubscriptions.productId, apiProduct.id),
                  eq(tenantProductSubscriptions.status, 'active'),
                ),
              )
              .limit(1);

            if (subscription) {
              // Determine plan type
              const planType =
                subscription.billingStatus === 'trial' ? 'trial' : 'purchased';
              const planCode =
                subscription.zohoPlanCode ||
                subscription.pendingPlanCode ||
                'api-as-a-service-trial-monthly';

              // Prepare credits allocation (default values - adjust based on plan)
              const credits = {
                initial: 1000,
                limit: 10000,
                rate_limit: 100,
              };

              // Call Python API to register user
              const pythonApiUrl = this.configService.get(
                'PYTHON_API_BASE_URL',
                { infer: true },
              );
              const pythonApiTimeout = this.configService.get(
                'PYTHON_API_TIMEOUT',
                { infer: true },
              );

              if (pythonApiUrl) {
                try {
                  await firstValueFrom(
                    this.httpService.post(
                      `${pythonApiUrl}/api/user/register`,
                      {
                        firebase_uid: firebaseUid,
                        plan_details: {
                          type: planType,
                          plan_code: planCode,
                          subscription_id: subscription.id,
                        },
                        credits,
                      },
                      {
                        timeout: pythonApiTimeout,
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      },
                    ),
                  );

                  this.logger.log(
                    `Python API user registration successful for user ${String(
                      userId,
                    )} (firebaseUid: ${firebaseUid})`,
                  );
                } catch (pythonError) {
                  // Log error but don't fail password creation
                  const errorMessage =
                    pythonError instanceof Error
                      ? pythonError.message
                      : String(pythonError);
                  this.logger.warn(
                    `Failed to register user with Python API for ${String(
                      userId,
                    )}: ${errorMessage}. User can still activate account.`,
                  );
                }
              } else {
                this.logger.debug(
                  `Python API URL not configured, skipping user registration for ${String(
                    userId,
                  )}`,
                );
              }
            }
          }
        } catch (error) {
          // Log error but don't fail password creation
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `Error checking subscription or calling Python API for ${String(
              userId,
            )}: ${errorMessage}`,
          );
        }
      }
    } catch (error) {
      // Log error but don't fail password creation
      // Firebase sync is important but not critical for account activation
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to create/sync Firebase user for ${String(userId)}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    // Send organization onboarded email after successful activation
    // Only send if user is an org admin (has tenantId and role is org_admin)
    if (user.tenantId && user.role === USER_ROLES.ORG_ADMIN) {
      try {
        // Fetch tenant information to get organization name
        const [tenantInfo] = await this.db.db
          .select({
            orgName: tenant.orgName,
          })
          .from(tenant)
          .where(eq(tenant.id, user.tenantId))
          .limit(1);

        if (tenantInfo) {
          await this.emailService.sendOrganizationOnboardedEmail(
            user.email,
            user.firstName,
            tenantInfo.orgName,
          );
          this.logger.log(
            `Organization onboarded email sent to ${user.email} after account activation`,
          );
        }
      } catch (error: unknown) {
        // Log error but don't fail password creation
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Failed to send organization onboarded email to ${user.email}: ${errorMessage}`,
        );
      }
    }

    return {
      success: true,
      message: 'Password created successfully. Your account is now activated.',
      user: validation.user,
    };
  }

  async checkEmail(email: string) {
    // Optimized: Join with tenant table to get org name in single query
    const [userWithTenant] = await this.db.db
      .select({
        id: userAccount.id,
        email: userAccount.email,
        firstName: userAccount.firstName,
        status: userAccount.status,
        role: userAccount.role,
        tenantId: userAccount.tenantId,
        activationToken: userAccount.activationToken,
        activationTokenExpiresAt: userAccount.activationTokenExpiresAt,
        orgName: tenant.orgName,
      })
      .from(userAccount)
      .leftJoin(tenant, eq(tenant.id, userAccount.tenantId))
      .where(eq(userAccount.email, email))
      .limit(1);

    if (!userWithTenant) {
      // Don't reveal if email exists
      return {
        exists: false,
        message:
          'If the email exists and account is not active, an activation email will be sent.',
      };
    }

    // If user is not active, return info without triggering any email
    if (userWithTenant.status !== 'active') {
      return {
        exists: true,
        message:
          'This email is already registered but not active. Please use a different email or contact support.',
        role: userWithTenant.role,
        orgName: userWithTenant.orgName ?? undefined,
      };
    }

    return {
      exists: true,
      message: 'Account is already active. Please sign in.',
      role: userWithTenant.role,
      orgName: userWithTenant.orgName ?? undefined,
    };
  }

  async resendActivation(email: string) {
    const [user] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists
      return {
        message:
          'If the email exists and account is not active, an activation email will be sent.',
      };
    }

    if (user.status === 'active') {
      throw new BadRequestException('Account is already active');
    }

    // Generate new activation token
    const activationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours

    await this.db.db
      .update(userAccount)
      .set({
        activationToken,
        activationTokenExpiresAt: expiresAt,
      })
      .where(eq(userAccount.id, user.id));

    // Send activation email
    await this.emailService.sendActivationEmail(
      user.email,
      user.firstName,
      activationToken,
    );

    return {
      message:
        'If the email exists and account is not active, an activation email will be sent.',
    };
  }

  /**
   * PRODUCTION: Create a new user account with organization
   * This is the main signup endpoint for new customers
   */
  async signup(
    email: string,
    firstName: string,
    lastName: string,
    organizationName: string,
    clientIp?: string,
    phone?: string,
    productCode?: string, // Product code for tracking which product user signed up for
  ) {
    // Validate organization name
    if (!organizationName || organizationName.trim().length === 0) {
      throw new BadRequestException('Organization name is required');
    }

    // Check if user already exists
    const [existingUser] = await this.db.db
      .select()
      .from(userAccount)
      .where(eq(userAccount.email, email))
      .limit(1);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Detect country from IP address
    let country = 'IN'; // Default to India for local/development
    let zohoAccountRegion: 'india' | 'international' = 'india';

    if (clientIp) {
      try {
        // Clean up IP address - remove IPv6 prefix if present
        let cleanIp = clientIp.trim();
        if (cleanIp.startsWith('::ffff:')) {
          cleanIp = cleanIp.substring(7); // Remove IPv6 prefix
        }

        this.logger.log(`Attempting to detect country from IP: ${cleanIp}`);

        // Check if it's a private/local IP
        const isPrivateIp =
          cleanIp === '127.0.0.1' ||
          cleanIp === '::1' ||
          cleanIp.startsWith('192.168.') ||
          cleanIp.startsWith('10.') ||
          cleanIp.startsWith('172.16.') ||
          cleanIp.startsWith('172.17.') ||
          cleanIp.startsWith('172.18.') ||
          cleanIp.startsWith('172.19.') ||
          cleanIp.startsWith('172.2') ||
          cleanIp.startsWith('172.30.') ||
          cleanIp.startsWith('172.31.');

        if (isPrivateIp) {
          this.logger.log(
            `🏠 Private/Local IP detected (${cleanIp}), using default country: India (IN) - Zoho region: india`,
          );
          // Keep default India for local development
        } else {
          const geo = (
            geoip as { lookup: (ip: string) => { country?: string } | null }
          ).lookup(cleanIp);

          if (geo && geo.country) {
            country = geo.country;
            // Set Zoho region based on country
            zohoAccountRegion = country === 'IN' ? 'india' : 'international';
            this.logger.log(
              `✅ Detected country ${country} from IP ${cleanIp} - Zoho region: ${zohoAccountRegion}`,
            );
          } else {
            this.logger.warn(
              `❌ Could not detect country from IP ${cleanIp} (not in GeoIP database), using default India (IN)`,
            );
          }
        }
      } catch (error) {
        this.logger.warn(
          `Error detecting country from IP ${clientIp}, using default India (IN)`,
          error,
        );
      }
    } else {
      this.logger.log(
        'No client IP provided, using default country: India (IN) - Zoho region: india',
      );
    }

    // Create tenant first. New tenants start as "invited" until the
    // org_admin activates their account (create-password flow).
    const [newTenant] = await this.db.db
      .insert(tenant)
      .values({
        orgName: organizationName.trim(),
        country,
        status: 'invited',
        email,
        primaryContactName: `${firstName} ${lastName}`,
        primaryContactEmail: email,
        primaryContactPhone: phone || null,
        zohoAccountRegion,
      })
      .returning({
        id: tenant.id,
        orgName: tenant.orgName,
        country: tenant.country,
        zohoAccountRegion: tenant.zohoAccountRegion,
      });

    // Generate activation token
    const activationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours

    // Generate cognito_sub placeholder (will be set properly when password is created)
    const cognitoSub = this.cognitoService.generateLocalBypassSub();

    // Create user account with tenant and org_admin role
    const [newUser] = await this.db.db
      .insert(userAccount)
      .values({
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: 'org_admin', // Default role is now org_admin
        tenantId: newTenant.id, // Assign to the created tenant
        status: 'invited',
        cognitoSub,
        activationToken,
        activationTokenExpiresAt: expiresAt,
        failedLoginAttempts: '0',
        mfaEnabled: 'false',
      })
      .returning({
        id: userAccount.id,
        email: userAccount.email,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        tenantId: userAccount.tenantId,
        role: userAccount.role,
      });

    // Create CRM lead (non-blocking)
    try {
      await this.zohoCrmService.createLeadForOrgAdmin(
        email,
        firstName,
        lastName,
        organizationName,
        phone,
        country,
        zohoAccountRegion,
        productCode,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create CRM lead during signup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      // Don't fail signup if CRM creation fails
    }

    // Create product subscription if productCode is provided (per BRD requirements)
    if (productCode) {
      try {
        // Find the product by code
        const [product] = await this.db.db
          .select()
          .from(products)
          .where(eq(products.code, productCode))
          .limit(1);

        if (!product) {
          this.logger.warn(
            `Product with code '${productCode}' not found. Skipping subscription creation.`,
          );
        } else if (product.isActive !== 'true') {
          this.logger.warn(
            `Product '${productCode}' is not active. Skipping subscription creation.`,
          );
        } else {
          // Create a trial subscription for the product (per BRD: signup creates trial subscription)
          const trialDays =
            this.configService.get('TRIAL_DAYS', { infer: true }) || 7;
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

          await this.db.db.insert(tenantProductSubscriptions).values({
            tenantId: newTenant.id,
            productId: product.id,
            status: 'trial', // Trial status per BRD
            billingStatus: 'trial', // Trial billing status
            zohoAccountRegion: zohoAccountRegion,
            subscribedAt: new Date(),
            trialEndsAt: trialEndsAt,
            // No zohoSubscriptionId yet - will be set when user subscribes via Zoho
          });

          this.logger.log(
            `Created trial subscription for tenant ${String(newTenant.id)} and product ${String(productCode)}`,
          );
        }
      } catch (error) {
        // Log error but don't fail signup if subscription creation fails
        this.logger.error(
          `Failed to create product subscription for ${productCode}:`,
          error,
        );
      }
    }

    // Send activation email
    await this.emailService.sendActivationEmail(
      email,
      firstName,
      activationToken,
    );

    // Note: Organization onboarded email will be sent after account activation
    // in the createPassword method, once the user successfully activates their account

    return {
      success: true,
      message:
        'Account created successfully. Please check your email for activation instructions.',
      user: newUser,
      organization: {
        ...newTenant,
        name: newTenant.orgName, // Alias for backward compatibility
      },
    };
  }
}
