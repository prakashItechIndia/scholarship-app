import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { products } from './products';

export const productRole = pgTable(
  'product_roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
      }),
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    modules: jsonb('modules')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productCodeUnique: uniqueIndex('product_roles_product_code_unique').on(
      table.productId,
      table.code,
    ),
  }),
);

export type ProductRoleInsert = typeof productRole.$inferInsert;
export type ProductRoleRecord = typeof productRole.$inferSelect;
