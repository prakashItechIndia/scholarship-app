"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPlans = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Product Plans Table
 * Maps Zoho plan codes to plan configurations and restrictions
 * Each product can have multiple plans (Trial, Basic, Pro, Enterprise, Ultra)
 */
exports.productPlans = (0, pg_core_1.pgTable)('product_plans', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    productId: (0, pg_core_1.uuid)('product_id').notNull(), // FK to products.id
    planCode: (0, pg_core_1.text)('plan_code').notNull(), // Zoho plan code (e.g., 'invox-bas-monthly', 'invox-pro-monthly')
    planName: (0, pg_core_1.text)('plan_name').notNull(), // Display name (e.g., 'Basic', 'Pro', 'Enterprise', 'Ultra')
    planTier: (0, pg_core_1.text)('plan_tier').notNull(), // 'trial', 'basic', 'pro', 'enterprise', 'ultra'
    billingInterval: (0, pg_core_1.text)('billing_interval'), // 'month' or 'year' (null for trial)
    // Zoho subscription IDs for different regions
    zohoSubscriptionIdIn: (0, pg_core_1.text)('zoho_subscription_id_in'), // Subscription ID for India region
    zohoSubscriptionIdUs: (0, pg_core_1.text)('zoho_subscription_id_us'), // Subscription ID for US/International region
    // Plan restrictions/features stored as JSONB for flexibility
    restrictions: (0, pg_core_1.jsonb)('restrictions').notNull().default((0, drizzle_orm_1.sql) `'{}'::jsonb`), // e.g., { maxUsers: 5, maxStorage: 100, features: [...] }
    isActive: (0, pg_core_1.text)('is_active').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
