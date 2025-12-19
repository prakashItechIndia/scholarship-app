"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetToken = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.passwordResetToken = (0, pg_core_1.pgTable)('password_reset_token', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(), // FK to user_account.id (CASCADE DELETE)
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(), // SHA-256 hash of reset token
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at', { withTimezone: true }), // Timestamp when token was used (single-use enforcement)
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
