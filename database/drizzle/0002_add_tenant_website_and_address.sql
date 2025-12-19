-- Add website and address_line columns to tenant table
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "website" text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "address_line" text;

