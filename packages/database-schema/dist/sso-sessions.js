"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSessions = exports.ssoSessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_account_1 = require("./user-account");
exports.ssoSessions = (0, pg_core_1.pgTable)('sso_sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' }),
    sessionToken: (0, pg_core_1.text)('session_token').notNull().unique(),
    // Session metadata
    ipAddress: (0, pg_core_1.text)('ip_address'),
    userAgent: (0, pg_core_1.text)('user_agent'),
    deviceFingerprint: (0, pg_core_1.text)('device_fingerprint'),
    // Lifecycle
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    lastActivityAt: (0, pg_core_1.timestamp)('last_activity_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    // Logout tracking
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    logoutAt: (0, pg_core_1.timestamp)('logout_at', { withTimezone: true }),
    logoutReason: (0, pg_core_1.text)('logout_reason'), // 'user_initiated', 'admin_revoked', 'expired', 'security'
});
exports.productSessions = (0, pg_core_1.pgTable)('product_sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    ssoSessionId: (0, pg_core_1.uuid)('sso_session_id')
        .notNull()
        .references(() => exports.ssoSessions.id, { onDelete: 'cascade' }),
    productCode: (0, pg_core_1.text)('product_code').notNull(),
    productSessionId: (0, pg_core_1.text)('product_session_id'),
    accessTokenJti: (0, pg_core_1.text)('access_token_jti'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
});
