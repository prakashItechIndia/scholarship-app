CREATE TABLE "product_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"plan_code" text NOT NULL,
	"plan_name" text NOT NULL,
	"plan_tier" text NOT NULL,
	"billing_interval" text,
	"zoho_subscription_id_in" text,
	"zoho_subscription_id_us" text,
	"restrictions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "logo_file_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_subscription_id_in" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "zoho_subscription_id_us" text;