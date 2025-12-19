CREATE TABLE "user_notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"enable_desktop_notification" text DEFAULT 'true' NOT NULL,
	"enable_unread_notification_badge" text DEFAULT 'true' NOT NULL,
	"push_notification_timeout" integer DEFAULT 5000 NOT NULL,
	"communication_emails" text DEFAULT 'true' NOT NULL,
	"announcement_and_updates" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_notification_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_mfa_config" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user_mfa_config" ADD COLUMN "sms_otp_code" text;--> statement-breakpoint
ALTER TABLE "user_mfa_config" ADD COLUMN "sms_otp_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_mfa_config" ADD COLUMN "sms_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_user_account_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id") ON DELETE cascade ON UPDATE no action;