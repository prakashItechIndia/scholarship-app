"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productEntitlements = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.productEntitlements = (0, pg_core_1.pgTable)('product_entitlements', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    subscriptionId: (0, pg_core_1.uuid)('subscription_id').notNull(), // FK to tenant_product_subscriptions.id
    featureCode: (0, pg_core_1.text)('feature_code').notNull(), // e.g., 'cad_table', 'invoices', 'eob'
    isGranted: (0, pg_core_1.text)('is_granted').notNull().default('true'), // 'true' or 'false'
    config: (0, pg_core_1.jsonb)('config'), // JSONB for feature-specific configuration (e.g., { max_mb: 100, max_concurrent_jobs: 5 })
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
