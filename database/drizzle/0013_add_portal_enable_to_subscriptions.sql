-- Add portal_enable column to tenant_product_subscriptions table
-- This flag controls Customer Portal UI access for "API AS A Service" product
-- Set by org_admin during onboarding (Step 5 - Services selection)
-- Stored per organization subscription, NOT at product level
ALTER TABLE "tenant_product_subscriptions" ADD COLUMN "portal_enable" text NOT NULL DEFAULT 'false';--> statement-breakpoint

