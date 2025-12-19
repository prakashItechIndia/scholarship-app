ALTER TABLE "tenant_product_subscriptions" ADD COLUMN "pending_plan_code" text;--> statement-breakpoint
ALTER TABLE "tenant_product_subscriptions" ADD COLUMN "payment_link" text;--> statement-breakpoint
ALTER TABLE "tenant_product_subscriptions" ADD COLUMN "hosted_page_id" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_transaction" ADD COLUMN "product_id" uuid;