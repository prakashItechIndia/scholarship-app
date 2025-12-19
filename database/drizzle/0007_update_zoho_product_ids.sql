-- Remove old columns
ALTER TABLE "products"
DROP COLUMN IF EXISTS "zoho_product_id";

ALTER TABLE "products"
DROP COLUMN IF EXISTS "zoho_subscription_id_in";

ALTER TABLE "products"
DROP COLUMN IF EXISTS "zoho_subscription_id_us";

-- Add new region-specific product ID columns
ALTER TABLE "products"
ADD COLUMN "zoho_product_id_in" text;

ALTER TABLE "products"
ADD COLUMN "zoho_product_id_us" text;