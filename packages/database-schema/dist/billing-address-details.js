"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingAddressDetails = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.billingAddressDetails = (0, pg_core_1.pgTable)('billing_address_details', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull(), // FK to tenant.id
    // Contact person + organization info
    name: (0, pg_core_1.text)('name'),
    email: (0, pg_core_1.text)('email'),
    mobileNumber: (0, pg_core_1.text)('mobile_number'),
    organizationName: (0, pg_core_1.text)('organization_name'),
    // Billing address fields
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.text)('city'),
    state: (0, pg_core_1.text)('state'),
    country: (0, pg_core_1.text)('country'),
    zipcode: (0, pg_core_1.text)('zipcode'),
    contactEmail: (0, pg_core_1.text)('contact_email'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
