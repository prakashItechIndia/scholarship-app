CREATE TABLE "billing_address_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"zipcode" text,
	"contact_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_product_id_in" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_product_id_us" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_product_name" text;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "zoho_subscription_id_in";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "zoho_subscription_id_us";