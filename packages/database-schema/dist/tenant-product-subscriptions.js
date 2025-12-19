"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantProductSubscriptions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tenantProductSubscriptions = (0, pg_core_1.pgTable)('tenant_product_subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull(), // FK to tenant.id
    productId: (0, pg_core_1.uuid)('product_id').notNull(), // FK to products.id
    status: (0, pg_core_1.text)('status').notNull().default('trial'), // 'trial', 'active', 'canceled', 'expired', 'past_due'
    billingStatus: (0, pg_core_1.text)('billing_status').notNull().default('trial'), // 'trial', 'active', 'past_due', 'canceled'
    // Zoho subscription details
    zohoSubscriptionId: (0, pg_core_1.text)('zoho_subscription_id'), // Zoho subscription ID
    zohoPlanCode: (0, pg_core_1.text)('zoho_plan_code'), // Zoho plan code (e.g., 'customer-portal-pro-monthly')
    pendingPlanCode: (0, pg_core_1.text)('pending_plan_code'), // Intended paid plan code when payment is pending (for trial subscriptions awaiting payment)
    paymentLink: (0, pg_core_1.text)('payment_link'), // Payment link/hosted page URL for pending payments
    hostedPageId: (0, pg_core_1.text)('hosted_page_id'), // Zoho hosted page ID for payment
    zohoAccountRegion: (0, pg_core_1.text)('zoho_account_region'), // 'india' or 'international'
    // Subscription dates
    subscribedAt: (0, pg_core_1.timestamp)('subscribed_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    trialEndsAt: (0, pg_core_1.timestamp)('trial_ends_at', { withTimezone: true }),
    currentPeriodStart: (0, pg_core_1.timestamp)('current_period_start', {
        withTimezone: true,
    }),
    currentPeriodEnd: (0, pg_core_1.timestamp)('current_period_end', { withTimezone: true }),
    nextBillingDate: (0, pg_core_1.timestamp)('next_billing_date', { withTimezone: true }),
    canceledAt: (0, pg_core_1.timestamp)('canceled_at', { withTimezone: true }),
    canceledReason: (0, pg_core_1.text)('canceled_reason'),
    // Portal enable flag - controls Customer Portal UI access for "API AS A Service" product
    // Set by org_admin during onboarding (Step 5 - Services selection)
    // Stored per organization subscription, NOT at product level
    portalEnable: (0, pg_core_1.text)('portal_enable').notNull().default('false'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
