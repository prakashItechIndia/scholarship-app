import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const role = pgTable('role', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // 'product_admin', 'org_admin', 'org_user', etc.
  name: text('name').notNull(), // Display name: 'Product Admin', 'Organization Admin', etc.
  description: text('description'), // Description of what this role can do
  isSystemRole: boolean('is_system_role').default(false).notNull(), // System roles cannot be deleted
  requiresTenant: boolean('requires_tenant').default(true).notNull(), // Whether this role requires a tenant_id
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RoleInsert = typeof role.$inferInsert;
export type RoleRecord = typeof role.$inferSelect;
