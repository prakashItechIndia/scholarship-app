"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mfaAuditLog = exports.mfaVerificationSessions = exports.userMfaConfig = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_account_1 = require("./user-account");
exports.userMfaConfig = (0, pg_core_1.pgTable)('user_mfa_config', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' })
        .unique(),
    mfaEnabled: (0, pg_core_1.boolean)('mfa_enabled').default(false).notNull(),
    mfaMethod: (0, pg_core_1.text)('mfa_method'), // 'totp', 'sms', 'email'
    // TOTP (Time-based One-Time Password)
    totpSecret: (0, pg_core_1.text)('totp_secret'), // Encrypted secret key
    totpVerified: (0, pg_core_1.boolean)('totp_verified').default(false),
    // SMS MFA
    phoneNumber: (0, pg_core_1.text)('phone_number'), // Phone number for SMS MFA
    smsOtpCode: (0, pg_core_1.text)('sms_otp_code'), // Current SMS OTP code (hashed)
    smsOtpExpiresAt: (0, pg_core_1.timestamp)('sms_otp_expires_at', { withTimezone: true }), // OTP expiry
    smsVerified: (0, pg_core_1.boolean)('sms_verified').default(false),
    // Backup codes
    backupCodes: (0, pg_core_1.text)('backup_codes').array(), // Array of hashed backup codes
    // Audit
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at', { withTimezone: true }),
});
exports.mfaVerificationSessions = (0, pg_core_1.pgTable)('mfa_verification_sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' }),
    sessionToken: (0, pg_core_1.text)('session_token').notNull().unique(),
    purpose: (0, pg_core_1.text)('purpose').notNull(), // 'login', 'setup', 'change_settings'
    verified: (0, pg_core_1.boolean)('verified').default(false),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.mfaAuditLog = (0, pg_core_1.pgTable)('mfa_audit_log', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' }),
    eventType: (0, pg_core_1.text)('event_type').notNull(), // 'setup', 'verify_success', 'verify_failed', 'disabled', 'backup_code_used'
    method: (0, pg_core_1.text)('method'), // 'totp', 'sms', 'email', 'backup_code'
    success: (0, pg_core_1.boolean)('success').notNull(),
    ipAddress: (0, pg_core_1.text)('ip_address'),
    userAgent: (0, pg_core_1.text)('user_agent'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
