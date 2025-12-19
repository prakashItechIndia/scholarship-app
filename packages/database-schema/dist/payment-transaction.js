"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTransaction = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Payment Transactions Table
 * Stores all payment transactions from Zoho (successful and failed)
 */
exports.paymentTransaction = (0, pg_core_1.pgTable)('payment_transaction', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull(), // FK to tenant.id
    // Optional FK to products.id for reporting/joins
    productId: (0, pg_core_1.uuid)('product_id'),
    // Zoho identifiers
    zohoTransactionId: (0, pg_core_1.text)('zoho_transaction_id').notNull().unique(), // Zoho transaction ID
    zohoPaymentId: (0, pg_core_1.text)('zoho_payment_id'), // Zoho payment ID (if available)
    zohoInvoiceId: (0, pg_core_1.text)('zoho_invoice_id').notNull(), // FK to invoice
    zohoInvoiceNumber: (0, pg_core_1.text)('zoho_invoice_number').notNull(), // Invoice number for display
    // Transaction details
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(), // Transaction amount
    currencyCode: (0, pg_core_1.text)('currency_code').notNull(), // 'INR' or 'USD'
    status: (0, pg_core_1.text)('status').notNull(), // 'success', 'failed', 'pending', 'refunded'
    paymentMode: (0, pg_core_1.text)('payment_mode'), // 'card', 'bank_transfer', 'razorpay', 'stripe', etc.
    paymentGateway: (0, pg_core_1.text)('payment_gateway'), // 'razorpay', 'stripe', etc.
    // Payment details
    description: (0, pg_core_1.text)('description'), // Transaction description
    referenceNumber: (0, pg_core_1.text)('reference_number'), // Payment gateway reference number
    gatewayTransactionId: (0, pg_core_1.text)('gateway_transaction_id'), // Gateway-specific transaction ID
    // Dates
    transactionDate: (0, pg_core_1.timestamp)('transaction_date', { withTimezone: true }).notNull(), // When transaction occurred
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
