"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.refreshToken = (0, pg_core_1.pgTable)('refresh_token', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(), // FK to user_account.id
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(), // SHA-256 hash of refresh token
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at', { withTimezone: true }), // Timestamp when token was revoked
    replacedByTokenId: (0, pg_core_1.uuid)('replaced_by_token_id'), // Token ID that replaced this one (for rotation)
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
