"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const country_1 = require("./country");
/**
 * State Master Table
 * Stores state/province information for use in dropdowns and address forms
 * States are linked to countries via country_id foreign key
 */
exports.state = (0, pg_core_1.pgTable)('state', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    countryId: (0, pg_core_1.uuid)('country_id')
        .notNull()
        .references(() => country_1.country.id, { onDelete: 'cascade' }), // FK to country.id
    code: (0, pg_core_1.text)('code').notNull(), // State code (e.g., 'CA', 'NY', 'MH', 'UP')
    name: (0, pg_core_1.text)('name').notNull(), // State name (e.g., 'California', 'New York', 'Maharashtra', 'Uttar Pradesh')
    isActive: (0, pg_core_1.text)('is_active').notNull().default('true'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
