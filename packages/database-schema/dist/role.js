"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.role = (0, pg_core_1.pgTable)('role', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    code: (0, pg_core_1.text)('code').notNull().unique(), // 'product_admin', 'org_admin', 'org_user', etc.
    name: (0, pg_core_1.text)('name').notNull(), // Display name: 'Product Admin', 'Organization Admin', etc.
    description: (0, pg_core_1.text)('description'), // Description of what this role can do
    isSystemRole: (0, pg_core_1.boolean)('is_system_role').default(false).notNull(), // System roles cannot be deleted
    requiresTenant: (0, pg_core_1.boolean)('requires_tenant').default(true).notNull(), // Whether this role requires a tenant_id
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
