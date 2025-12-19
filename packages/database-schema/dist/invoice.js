"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoice = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Invoices Table
 * Stores invoice information from Zoho
 */
exports.invoice = (0, pg_core_1.pgTable)('invoice', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull(), // FK to tenant.id
    // Optional FK to products.id for reporting/joins
    productId: (0, pg_core_1.uuid)('product_id'),
    // Zoho identifiers
    zohoInvoiceId: (0, pg_core_1.text)('zoho_invoice_id').notNull().unique(), // Zoho invoice ID
    zohoInvoiceNumber: (0, pg_core_1.text)('zoho_invoice_number').notNull(), // Invoice number (e.g., INV-001)
    zohoSubscriptionId: (0, pg_core_1.text)('zoho_subscription_id'), // FK to subscription (if linked)
    // Invoice details
    status: (0, pg_core_1.text)('status').notNull(), // 'draft', 'sent', 'paid', 'overdue', 'void'
    total: (0, pg_core_1.numeric)('total', { precision: 10, scale: 2 }).notNull(), // Total invoice amount
    balance: (0, pg_core_1.numeric)('balance', { precision: 10, scale: 2 }).notNull(), // Outstanding balance
    currencyCode: (0, pg_core_1.text)('currency_code').notNull(), // 'INR' or 'USD'
    // Dates
    invoiceDate: (0, pg_core_1.timestamp)('invoice_date', { withTimezone: true }).notNull(), // Invoice date
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }), // Due date
    paidDate: (0, pg_core_1.timestamp)('paid_date', { withTimezone: true }), // When invoice was paid (if paid)
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
