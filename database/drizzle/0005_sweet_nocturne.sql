ALTER TABLE "products" ADD COLUMN "zoho_product_id_in" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_product_id_us" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_product_name" text;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "zoho_subscription_id_in";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "zoho_subscription_id_us";