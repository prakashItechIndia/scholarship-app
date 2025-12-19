-- Add api_key_encrypted column to tenant table
-- This stores the encrypted API_KEY from Python team for "API AS A Service" product
-- Only org_admin can retrieve this key to access Python APIs
ALTER TABLE "tenant" ADD COLUMN "api_key_encrypted" text;--> statement-breakpoint

