"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    code: (0, pg_core_1.text)('code').notNull().unique(), // e.g., 'customer-portal', 'invo-x', 'irepo'
    name: (0, pg_core_1.text)('name').notNull(), // e.g., 'Customer Portal', 'InvoX', 'iRepo'
    description: (0, pg_core_1.text)('description'),
    logoFileId: (0, pg_core_1.uuid)('logo_file_id'), // FK to files.id for product logo
    // Zoho product identifier mapping - maps system product to Zoho Billing products
    // Different regions (India vs International) use different Zoho Billing accounts/orgs
    // Prefer zohoProductId if available (more reliable), otherwise use zohoProductName
    // If both null, uses the system product code to match plan codes by prefix
    zohoProductIdIn: (0, pg_core_1.text)('zoho_product_id_in'), // Zoho Billing product ID for India region (system-generated, numeric)
    zohoProductIdUs: (0, pg_core_1.text)('zoho_product_id_us'), // Zoho Billing product ID for US/International region (system-generated, numeric)
    zohoProductName: (0, pg_core_1.text)('zoho_product_name'), // Zoho Billing product name (user-defined, e.g., 'TestInvox') - used as fallback if IDs not available
    isActive: (0, pg_core_1.text)('is_active').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
