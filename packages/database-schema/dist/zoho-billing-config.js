"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zohoBillingConfig = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.zohoBillingConfig = (0, pg_core_1.pgTable)('zoho_billing_config', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    regionCode: (0, pg_core_1.text)('region_code').notNull().unique(), // 'india' or 'international'
    apiBaseUrl: (0, pg_core_1.text)('api_base_url').notNull(), // 'https://billing.zoho.in' or 'https://billing.zoho.com'
    orgId: (0, pg_core_1.text)('org_id').notNull(),
    clientId: (0, pg_core_1.text)('client_id').notNull(),
    clientSecretEncrypted: (0, pg_core_1.text)('client_secret_encrypted').notNull(), // Encrypted client secret
    refreshTokenEncrypted: (0, pg_core_1.text)('refresh_token_encrypted').notNull(), // Encrypted refresh token
    webhookSecretEncrypted: (0, pg_core_1.text)('webhook_secret_encrypted'), // Encrypted webhook signing secret
    isActive: (0, pg_core_1.text)('is_active').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
