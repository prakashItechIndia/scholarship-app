"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRedirectUris = exports.authorizationCodes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_account_1 = require("./user-account");
const products_1 = require("./products");
exports.authorizationCodes = (0, pg_core_1.pgTable)('authorization_codes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    code: (0, pg_core_1.text)('code').notNull().unique(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' }),
    productCode: (0, pg_core_1.text)('product_code').notNull(),
    redirectUri: (0, pg_core_1.text)('redirect_uri').notNull(),
    // PKCE fields
    codeChallenge: (0, pg_core_1.text)('code_challenge'),
    codeChallengeMethod: (0, pg_core_1.text)('code_challenge_method'), // 'S256' or 'plain'
    // Lifecycle
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at', { withTimezone: true }),
    // Audit
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.productRedirectUris = (0, pg_core_1.pgTable)('product_redirect_uris', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    productId: (0, pg_core_1.uuid)('product_id')
        .notNull()
        .references(() => products_1.products.id, { onDelete: 'cascade' }),
    redirectUri: (0, pg_core_1.text)('redirect_uri').notNull(),
    environment: (0, pg_core_1.text)('environment').notNull(), // 'development', 'staging', 'production'
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
