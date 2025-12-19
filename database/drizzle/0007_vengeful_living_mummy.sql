CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"zoho_invoice_id" text NOT NULL,
	"zoho_invoice_number" text NOT NULL,
	"zoho_subscription_id" text,
	"status" text NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"balance" numeric(10, 2) NOT NULL,
	"currency_code" text NOT NULL,
	"invoice_date" timestamp with time zone NOT NULL,
	"due_date" timestamp with time zone,
	"paid_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoice_zoho_invoice_id_unique" UNIQUE("zoho_invoice_id")
);
--> statement-breakpoint
CREATE TABLE "payment_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"zoho_transaction_id" text NOT NULL,
	"zoho_payment_id" text,
	"zoho_invoice_id" text NOT NULL,
	"zoho_invoice_number" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency_code" text NOT NULL,
	"status" text NOT NULL,
	"payment_mode" text,
	"payment_gateway" text,
	"description" text,
	"reference_number" text,
	"gateway_transaction_id" text,
	"transaction_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transaction_zoho_transaction_id_unique" UNIQUE("zoho_transaction_id")
);
