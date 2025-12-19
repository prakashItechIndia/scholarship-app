"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenant = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tenant = (0, pg_core_1.pgTable)('tenant', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    orgName: (0, pg_core_1.text)('org_name').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('active'), // 'active', 'inactive', 'suspended'
    country: (0, pg_core_1.text)('country').notNull(), // ISO country code, e.g., 'IN', 'US'
    email: (0, pg_core_1.text)('email'),
    phone: (0, pg_core_1.text)('phone'),
    website: (0, pg_core_1.text)('website'),
    addressLine: (0, pg_core_1.text)('address_line'),
    logoKey: (0, pg_core_1.text)('logo_key'), // S3 key for organization logo
    logoFileId: (0, pg_core_1.uuid)('logo_file_id'),
    primaryContactName: (0, pg_core_1.text)('primary_contact_name'),
    primaryContactEmail: (0, pg_core_1.text)('primary_contact_email'),
    primaryContactPhone: (0, pg_core_1.text)('primary_contact_phone'),
    // Zoho Billing integration fields
    zohoCustomerId: (0, pg_core_1.text)('zoho_customer_id'), // Zoho customer ID
    zohoAccountRegion: (0, pg_core_1.text)('zoho_account_region'), // 'india' or 'international'
    // API AS A Service - Python API Key (encrypted)
    apiKeyEncrypted: (0, pg_core_1.text)('api_key_encrypted'), // Encrypted API_KEY from Python team for API access
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
