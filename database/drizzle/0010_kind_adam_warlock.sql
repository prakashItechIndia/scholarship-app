ALTER TABLE "user_account" ADD COLUMN "firebase_id_token" text;--> statement-breakpoint
ALTER TABLE "user_account" ADD COLUMN "firebase_id_token_expires_at" timestamp with time zone;