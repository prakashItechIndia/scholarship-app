"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProductPermissions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Optional user-level permission overrides
exports.userProductPermissions = (0, pg_core_1.pgTable)('user_product_permissions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(), // FK to user_account.id
    productId: (0, pg_core_1.uuid)('product_id').notNull(), // FK to products.id
    featureCode: (0, pg_core_1.text)('feature_code').notNull(), // e.g., 'cad_table', 'invoices'
    isGranted: (0, pg_core_1.text)('is_granted').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
