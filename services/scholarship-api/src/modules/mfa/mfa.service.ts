import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, gt } from 'drizzle-orm';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../database/database.service';
import {
  userMfaConfig,
  mfaVerificationSessions,
  mfaAuditLog,
} from '@icaptur/database-schema';
import type { EnvVars } from '../../config/env.validation';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Initialize MFA setup for a user (generates TOTP secret)
   */
  async initMfaSetup(userId: string, userEmail: string) {
    // Check if user already has MFA enabled
    const [existingConfig] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    if (existingConfig && existingConfig.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled for this user');
    }

    // Generate TOTP secret
    const mfaIssuer = this.configService.get('MFA_ISSUER', { infer: true });
    const totp = new TOTP({
      issuer: mfaIssuer,
      label: userEmail,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    const secret = totp.secret.base32;

    // Generate backup codes (10 codes)
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10)),
    );

    // Store or update config
    if (existingConfig) {
      await this.db.db
        .update(userMfaConfig)
        .set({
          totpSecret: secret,
          totpVerified: false,
          mfaEnabled: false,
          mfaMethod: 'totp',
          backupCodes: hashedBackupCodes,
          updatedAt: new Date(),
        })
        .where(eq(userMfaConfig.userId, userId));
    } else {
      await this.db.db.insert(userMfaConfig).values({
        userId,
        totpSecret: secret,
        totpVerified: false,
        mfaEnabled: false,
        mfaMethod: 'totp',
        backupCodes: hashedBackupCodes,
      });
    }

    // Generate QR code for the secret
    const otpauthUrl = totp.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    this.logger.log(`MFA setup initialized for user ${userId}`);

    return {
      secret,
      qrCode: qrCodeDataUrl,
      backupCodes, // Return plain-text codes only once
    };
  }

  /**
   * Verify TOTP code and enable MFA
   */
  async verifyAndEnableMfa(
    userId: string,
    totpCode: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    if (!config || !config.totpSecret) {
      throw new NotFoundException('MFA setup not initialized');
    }

    // Verify TOTP code
    const isValid = this.verifyTotpCode(config.totpSecret, totpCode);

    if (!isValid) {
      await this.logMfaEvent(
        userId,
        'verify_failed',
        'totp',
        false,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Invalid MFA code');
    }

    // Enable MFA
    await this.db.db
      .update(userMfaConfig)
      .set({
        mfaEnabled: true,
        totpVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(userMfaConfig.userId, userId));

    await this.logMfaEvent(userId, 'setup', 'totp', true, ipAddress, userAgent);

    this.logger.log(`MFA enabled successfully for user ${userId}`);

    return { success: true };
  }

  /**
   * Verify MFA code during login
   */
  async verifyMfaLogin(
    userId: string,
    code: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(
        and(
          eq(userMfaConfig.userId, userId),
          eq(userMfaConfig.mfaEnabled, true),
        ),
      )
      .limit(1);

    if (!config) {
      throw new NotFoundException('MFA not enabled for this user');
    }

    // Check if it's a backup code (works for both TOTP and SMS)
    if (config.backupCodes && config.backupCodes.length > 0) {
      const backupCodeMatch = await this.verifyBackupCode(
        code,
        config.backupCodes,
      );
      if (backupCodeMatch !== null) {
        // Remove used backup code
        const updatedBackupCodes = config.backupCodes.filter(
          (_, idx) => idx !== backupCodeMatch,
        );
        await this.db.db
          .update(userMfaConfig)
          .set({
            backupCodes: updatedBackupCodes,
            lastUsedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(userMfaConfig.userId, userId));

        await this.logMfaEvent(
          userId,
          'verify_success',
          'backup_code',
          true,
          ipAddress,
          userAgent,
        );

        this.logger.log(`Backup code used for user ${userId}`);
        return true;
      }
    }

    // Verify based on MFA method
    if (config.mfaMethod === 'sms') {
      return this.verifySmsOtp(userId, code, config, ipAddress, userAgent);
    } else if (config.mfaMethod === 'totp') {
      // Verify TOTP code
      const isValid = this.verifyTotpCode(config.totpSecret || '', code);

      await this.logMfaEvent(
        userId,
        isValid ? 'verify_success' : 'verify_failed',
        'totp',
        isValid,
        ipAddress,
        userAgent,
      );

      if (isValid) {
        await this.db.db
          .update(userMfaConfig)
          .set({
            lastUsedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(userMfaConfig.userId, userId));
      }

      return isValid;
    } else {
      throw new BadRequestException('Unknown MFA method');
    }
  }

  /**
   * Disable MFA for a user
   */
  async disableMfa(userId: string, ipAddress?: string, userAgent?: string) {
    await this.db.db
      .update(userMfaConfig)
      .set({
        mfaEnabled: false,
        updatedAt: new Date(),
      })
      .where(eq(userMfaConfig.userId, userId));

    await this.logMfaEvent(
      userId,
      'disabled',
      'totp',
      true,
      ipAddress,
      userAgent,
    );

    this.logger.log(`MFA disabled for user ${userId}`);
  }

  /**
   * Check if user has MFA enabled
   */
  async isMfaEnabled(userId: string): Promise<boolean> {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    return config?.mfaEnabled ?? false;
  }

  /**
   * Get MFA status for user
   */
  async getMfaStatus(userId: string) {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    return {
      enabled: config?.mfaEnabled ?? false,
      method: config?.mfaMethod ?? null,
      phoneNumber: config?.phoneNumber ?? null,
      backupCodesRemaining: config?.backupCodes?.length ?? 0,
    };
  }

  /**
   * Create MFA verification session (for multi-step login)
   */
  async createVerificationSession(userId: string, purpose: string) {
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.db.db.insert(mfaVerificationSessions).values({
      userId,
      sessionToken,
      purpose,
      expiresAt,
    });

    return sessionToken;
  }

  /**
   * Verify and consume MFA session
   */
  async verifySession(sessionToken: string) {
    const [session] = await this.db.db
      .select()
      .from(mfaVerificationSessions)
      .where(
        and(
          eq(mfaVerificationSessions.sessionToken, sessionToken),
          gt(mfaVerificationSessions.expiresAt, new Date()),
          eq(mfaVerificationSessions.verified, false),
        ),
      )
      .limit(1);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired MFA session');
    }

    // Mark as verified
    await this.db.db
      .update(mfaVerificationSessions)
      .set({ verified: true })
      .where(eq(mfaVerificationSessions.id, session.id));

    return session;
  }

  /**
   * Verify TOTP code
   */
  private verifyTotpCode(secret: string, code: string): boolean {
    const mfaIssuer = this.configService.get('MFA_ISSUER', { infer: true });
    const totp = new TOTP({
      issuer: mfaIssuer,
      label: 'user',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });

    // Allow 1 window before/after for clock skew (90 seconds total)
    const currentWindow = totp.validate({ token: code, window: 1 });
    return currentWindow !== null;
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Verify backup code against hashed codes
   */
  private async verifyBackupCode(
    code: string,
    hashedCodes: string[],
  ): Promise<number | null> {
    for (let i = 0; i < hashedCodes.length; i++) {
      const isMatch = await bcrypt.compare(code.toUpperCase(), hashedCodes[i]);
      if (isMatch) {
        return i; // Return index of matched code
      }
    }
    return null;
  }

  /**
   * Initialize SMS MFA setup
   */
  async initSmsMfaSetup(userId: string, phoneNumber: string) {
    // Validate phone number
    if (!this.smsService.validatePhoneNumber(phoneNumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Normalize phone number
    const normalizedPhone = this.smsService.normalizePhoneNumber(phoneNumber);

    // Check if user already has MFA enabled
    const [existingConfig] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    if (existingConfig && existingConfig.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled for this user');
    }

    // Generate OTP code
    const otpCode = this.smsService.generateOtpCode();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Generate backup codes (10 codes)
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10)),
    );

    // Store or update config
    if (existingConfig) {
      await this.db.db
        .update(userMfaConfig)
        .set({
          phoneNumber: normalizedPhone,
          smsOtpCode: hashedOtp,
          smsOtpExpiresAt: expiresAt,
          smsVerified: false,
          mfaEnabled: false,
          mfaMethod: 'sms',
          backupCodes: hashedBackupCodes,
          updatedAt: new Date(),
        })
        .where(eq(userMfaConfig.userId, userId));
    } else {
      await this.db.db.insert(userMfaConfig).values({
        userId,
        phoneNumber: normalizedPhone,
        smsOtpCode: hashedOtp,
        smsOtpExpiresAt: expiresAt,
        smsVerified: false,
        mfaEnabled: false,
        mfaMethod: 'sms',
        backupCodes: hashedBackupCodes,
      });
    }

    // Send OTP via SMS
    const smsSent = await this.smsService.sendOtpCode(normalizedPhone, otpCode);
    if (!smsSent) {
      this.logger.warn(`Failed to send SMS OTP to ${normalizedPhone}`);
      // Don't throw error - allow user to request resend
    }

    this.logger.log(`SMS MFA setup initialized for user ${userId}`);

    return {
      phoneNumber: normalizedPhone,
      backupCodes, // Return plain-text codes only once
    };
  }

  /**
   * Send SMS OTP code (for login or resend)
   */
  async sendSmsOtp(userId: string): Promise<boolean> {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(
        and(
          eq(userMfaConfig.userId, userId),
          eq(userMfaConfig.mfaEnabled, true),
          eq(userMfaConfig.mfaMethod, 'sms'),
        ),
      )
      .limit(1);

    if (!config || !config.phoneNumber) {
      throw new NotFoundException('SMS MFA not configured for this user');
    }

    // Generate new OTP code
    const otpCode = this.smsService.generateOtpCode();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update config with new OTP
    await this.db.db
      .update(userMfaConfig)
      .set({
        smsOtpCode: hashedOtp,
        smsOtpExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(userMfaConfig.userId, userId));

    // Send OTP via SMS
    const smsSent = await this.smsService.sendOtpCode(
      config.phoneNumber,
      otpCode,
    );

    if (smsSent) {
      await this.logMfaEvent(userId, 'otp_sent', 'sms', true);
    }

    return smsSent;
  }

  /**
   * Verify SMS OTP code and enable SMS MFA
   */
  async verifyAndEnableSmsMfa(
    userId: string,
    otpCode: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const [config] = await this.db.db
      .select()
      .from(userMfaConfig)
      .where(eq(userMfaConfig.userId, userId))
      .limit(1);

    if (!config || !config.phoneNumber || !config.smsOtpCode) {
      throw new NotFoundException('SMS MFA setup not initialized');
    }

    // Check if OTP is expired
    if (!config.smsOtpExpiresAt || config.smsOtpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP code has expired');
    }

    // Verify OTP code
    const isValid = await bcrypt.compare(otpCode, config.smsOtpCode);

    if (!isValid) {
      await this.logMfaEvent(
        userId,
        'verify_failed',
        'sms',
        false,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Invalid OTP code');
    }

    // Enable MFA
    await this.db.db
      .update(userMfaConfig)
      .set({
        mfaEnabled: true,
        smsVerified: true,
        smsOtpCode: null, // Clear OTP after successful verification
        smsOtpExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(userMfaConfig.userId, userId));

    await this.logMfaEvent(userId, 'setup', 'sms', true, ipAddress, userAgent);

    this.logger.log(`SMS MFA enabled successfully for user ${userId}`);

    return { success: true };
  }

  /**
   * Verify SMS OTP during login
   */
  private async verifySmsOtp(
    userId: string,
    code: string,
    config: typeof userMfaConfig.$inferSelect,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    if (!config.phoneNumber) {
      throw new NotFoundException('Phone number not configured for SMS MFA');
    }

    // If no OTP code is stored, send a new one
    if (!config.smsOtpCode || !config.smsOtpExpiresAt) {
      // Send new OTP
      await this.sendSmsOtp(userId);
      return false; // Return false so user can enter the new code
    }

    // Check if OTP is expired
    if (config.smsOtpExpiresAt < new Date()) {
      // Send new OTP
      await this.sendSmsOtp(userId);
      throw new UnauthorizedException(
        'OTP code has expired. A new code has been sent to your phone.',
      );
    }

    // Verify OTP code
    const isValid = await bcrypt.compare(code, config.smsOtpCode);

    await this.logMfaEvent(
      userId,
      isValid ? 'verify_success' : 'verify_failed',
      'sms',
      isValid,
      ipAddress,
      userAgent,
    );

    if (isValid) {
      // Clear OTP after successful verification
      await this.db.db
        .update(userMfaConfig)
        .set({
          smsOtpCode: null,
          smsOtpExpiresAt: null,
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userMfaConfig.userId, userId));
    }

    return isValid;
  }

  /**
   * Log MFA event to audit log
   */
  private async logMfaEvent(
    userId: string,
    eventType: string,
    method: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await this.db.db.insert(mfaAuditLog).values({
      userId,
      eventType,
      method,
      success,
      ipAddress,
      userAgent,
    });
  }
}
