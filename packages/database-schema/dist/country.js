"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.country = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Country Master Table
 * Stores country information for use in dropdowns and address forms
 */
exports.country = (0, pg_core_1.pgTable)('country', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    code: (0, pg_core_1.text)('code').notNull().unique(), // ISO 3166-1 alpha-2 country code (e.g., 'US', 'IN', 'GB')
    name: (0, pg_core_1.text)('name').notNull(), // Country name (e.g., 'United States', 'India', 'United Kingdom')
    iso3: (0, pg_core_1.text)('iso3'), // ISO 3166-1 alpha-3 country code (e.g., 'USA', 'IND', 'GBR')
    phoneCode: (0, pg_core_1.text)('phone_code'), // International phone code (e.g., '+1', '+91', '+44')
    isActive: (0, pg_core_1.text)('is_active').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
