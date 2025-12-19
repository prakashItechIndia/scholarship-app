"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccount = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userAccount = (0, pg_core_1.pgTable)('user_account', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id'), // Nullable for iTech admins - FK to tenant.id
    email: (0, pg_core_1.text)('email').notNull().unique(),
    firstName: (0, pg_core_1.text)('first_name').notNull(),
    lastName: (0, pg_core_1.text)('last_name').notNull(),
    phone: (0, pg_core_1.text)('phone'),
    profilePictureKey: (0, pg_core_1.text)('profile_picture_key'), // S3 key for profile picture
    fileId: (0, pg_core_1.uuid)('file_id'),
    roleId: (0, pg_core_1.uuid)('role_id'), // FK to role.id (nullable for backward compatibility during migration)
    role: (0, pg_core_1.text)('role').notNull(), // 'org_admin', 'org_user', 'icaptur_support_admin', 'icaptur_finance_admin', 'icaptur_super_admin' (kept for backward compatibility)
    status: (0, pg_core_1.text)('status').notNull().default('invited'), // 'invited', 'active', 'inactive'
    // Authentication fields
    passwordHash: (0, pg_core_1.text)('password_hash'), // Bcrypt hash (dev) or null if using Cognito
    cognitoSub: (0, pg_core_1.text)('cognito_sub'), // Cognito user identifier (for production)
    firebaseUid: (0, pg_core_1.text)('firebase_uid'), // Firebase Auth user ID - stored in DB
    firebaseIdToken: (0, pg_core_1.text)('firebase_id_token'), // Firebase idToken for Python API calls - stored in DB
    firebaseIdTokenExpiresAt: (0, pg_core_1.timestamp)('firebase_id_token_expires_at', {
        withTimezone: true,
    }), // When the idToken expires (typically 1 hour from issue)
    // Account lockout protection
    failedLoginAttempts: (0, pg_core_1.text)('failed_login_attempts').default('0'),
    lockedUntil: (0, pg_core_1.timestamp)('locked_until', { withTimezone: true }),
    lastFailedLoginAt: (0, pg_core_1.timestamp)('last_failed_login_at', { withTimezone: true }),
    // Activation fields
    activationToken: (0, pg_core_1.text)('activation_token'), // Secure token for account activation
    activationTokenExpiresAt: (0, pg_core_1.timestamp)('activation_token_expires_at', {
        withTimezone: true,
    }),
    // MFA fields
    mfaEnabled: (0, pg_core_1.text)('mfa_enabled').default('false'), // 'true' or 'false'
    mfaSecretEncrypted: (0, pg_core_1.text)('mfa_secret_encrypted'), // Encrypted TOTP secret
    mfaBackupCodesEncrypted: (0, pg_core_1.text)('mfa_backup_codes_encrypted'), // Encrypted backup codes (JSON array)
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
