CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "is_active" text DEFAULT 'true' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "products_code_unique" UNIQUE ("code")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tenant" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_name" text NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "country" text NOT NULL,
  "email" text,
  "phone" text,
  "logo_key" text,
  "logo_file_id" uuid,
  "primary_contact_name" text,
  "primary_contact_email" text,
  "primary_contact_phone" text,
  "zoho_customer_id" text,
  "zoho_account_region" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "role" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "is_system_role" boolean DEFAULT false NOT NULL,
  "requires_tenant" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "role_code_unique" UNIQUE ("code")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user_account" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid,
  "email" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "phone" text,
  "profile_picture_key" text,
  "file_id" uuid,
  "role_id" uuid,
  "role" text NOT NULL,
  "status" text DEFAULT 'invited' NOT NULL,
  "password_hash" text,
  "cognito_sub" text,
  "failed_login_attempts" text DEFAULT '0',
  "locked_until" timestamptz,
  "last_failed_login_at" timestamptz,
  "activation_token" text,
  "activation_token_expires_at" timestamptz,
  "mfa_enabled" text DEFAULT 'false',
  "mfa_secret_encrypted" text,
  "mfa_backup_codes_encrypted" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "user_account_email_unique" UNIQUE ("email")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tenant_product_subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "status" text DEFAULT 'trial' NOT NULL,
  "billing_status" text DEFAULT 'trial' NOT NULL,
  "zoho_subscription_id" text,
  "zoho_plan_code" text,
  "zoho_account_region" text,
  "subscribed_at" timestamptz DEFAULT now() NOT NULL,
  "trial_ends_at" timestamptz,
  "current_period_start" timestamptz,
  "current_period_end" timestamptz,
  "next_billing_date" timestamptz,
  "canceled_at" timestamptz,
  "canceled_reason" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_entitlements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "subscription_id" uuid NOT NULL,
  "feature_code" text NOT NULL,
  "is_granted" text DEFAULT 'true' NOT NULL,
  "config" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user_product_permissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "feature_code" text NOT NULL,
  "is_granted" text DEFAULT 'true' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "zoho_billing_config" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "region_code" text NOT NULL,
  "api_base_url" text NOT NULL,
  "org_id" text NOT NULL,
  "client_id" text NOT NULL,
  "client_secret_encrypted" text NOT NULL,
  "refresh_token_encrypted" text NOT NULL,
  "webhook_secret_encrypted" text,
  "is_active" text DEFAULT 'true' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "zoho_billing_config_region_code_unique" UNIQUE ("region_code")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "audit_event" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid,
  "actor_user_id" uuid,
  "event_type" text NOT NULL,
  "event_payload" jsonb,
  "ip" text,
  "user_agent" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "password_reset_token" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "token_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "used_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "password_reset_token_token_hash_unique" UNIQUE ("token_hash")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "refresh_token" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "token_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "revoked_at" timestamptz,
  "replaced_by_token_id" uuid,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "refresh_token_token_hash_unique" UNIQUE ("token_hash")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_roles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "product_roles_product_code_unique"
  ON "product_roles" ("product_id", "code");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "name" text NOT NULL,
  "extension" text NOT NULL,
  "mime_type" text NOT NULL,
  "size" integer NOT NULL,
  "url" text,
  "type" text DEFAULT 'document' NOT NULL,
  "owner_user_id" uuid,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "authorization_codes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "user_id" uuid NOT NULL,
  "product_code" text NOT NULL,
  "redirect_uri" text NOT NULL,
  "code_challenge" text,
  "code_challenge_method" text,
  "expires_at" timestamptz NOT NULL,
  "used_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "authorization_codes_code_unique" UNIQUE ("code")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_redirect_uris" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "redirect_uri" text NOT NULL,
  "environment" text NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "product_redirect_uri_unique"
    UNIQUE ("product_id", "redirect_uri", "environment")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "mfa_audit_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "event_type" text NOT NULL,
  "method" text,
  "success" boolean NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "mfa_verification_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "session_token" text NOT NULL,
  "purpose" text NOT NULL,
  "verified" boolean DEFAULT false,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "mfa_verification_sessions_session_token_unique" UNIQUE ("session_token")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user_mfa_config" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "mfa_enabled" boolean DEFAULT false NOT NULL,
  "mfa_method" text,
  "totp_secret" text,
  "totp_verified" boolean DEFAULT false,
  "backup_codes" text[],
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "last_used_at" timestamptz,
  CONSTRAINT "user_mfa_config_user_id_unique" UNIQUE ("user_id")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "sso_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "session_token" text NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "device_fingerprint" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "last_activity_at" timestamptz DEFAULT now() NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "logout_at" timestamptz,
  "logout_reason" text,
  CONSTRAINT "sso_sessions_session_token_unique" UNIQUE ("session_token")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sso_session_id" uuid NOT NULL,
  "product_code" text NOT NULL,
  "product_session_id" text,
  "access_token_jti" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "last_used_at" timestamptz DEFAULT now() NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint

ALTER TABLE "tenant_product_subscriptions"
  ADD CONSTRAINT "tenant_product_subscriptions_tenant_id_tenant_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "tenant_product_subscriptions"
  ADD CONSTRAINT "tenant_product_subscriptions_product_id_products_id_fk"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "product_entitlements"
  ADD CONSTRAINT "product_entitlements_subscription_id_tenant_prod_sub_id_fk"
  FOREIGN KEY ("subscription_id") REFERENCES "tenant_product_subscriptions"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "user_product_permissions"
  ADD CONSTRAINT "user_product_permissions_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "user_product_permissions"
  ADD CONSTRAINT "user_product_permissions_product_id_products_id_fk"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "authorization_codes"
  ADD CONSTRAINT "authorization_codes_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "product_redirect_uris"
  ADD CONSTRAINT "product_redirect_uris_product_id_products_id_fk"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "mfa_audit_log"
  ADD CONSTRAINT "mfa_audit_log_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "mfa_verification_sessions"
  ADD CONSTRAINT "mfa_verification_sessions_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "user_mfa_config"
  ADD CONSTRAINT "user_mfa_config_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "sso_sessions"
  ADD CONSTRAINT "sso_sessions_user_id_user_account_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "product_sessions"
  ADD CONSTRAINT "product_sessions_sso_session_id_sso_sessions_id_fk"
  FOREIGN KEY ("sso_session_id") REFERENCES "sso_sessions"("id") ON DELETE cascade;
--> statement-breakpoint

ALTER TABLE "files"
  ADD CONSTRAINT "files_owner_user_id_user_account_id_fk"
  FOREIGN KEY ("owner_user_id") REFERENCES "user_account"("id") ON DELETE set null;
--> statement-breakpoint

ALTER TABLE "tenant"
  ADD CONSTRAINT "tenant_logo_file_id_files_id_fk"
  FOREIGN KEY ("logo_file_id") REFERENCES "files"("id") ON DELETE set null;
--> statement-breakpoint

ALTER TABLE "user_account"
  ADD CONSTRAINT "user_account_file_id_files_id_fk"
  FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE set null;
--> statement-breakpoint

ALTER TABLE "user_account"
  ADD CONSTRAINT "user_account_role_id_role_id_fk"
  FOREIGN KEY ("role_id") REFERENCES "role"("id");
--> statement-breakpoint

