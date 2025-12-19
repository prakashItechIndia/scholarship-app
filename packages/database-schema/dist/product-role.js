"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const products_1 = require("./products");
exports.productRole = (0, pg_core_1.pgTable)('product_roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    productId: (0, pg_core_1.uuid)('product_id')
        .notNull()
        .references(() => products_1.products.id, {
        onDelete: 'cascade',
    }),
    code: (0, pg_core_1.text)('code').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    modules: (0, pg_core_1.jsonb)('modules')
        .$type()
        .notNull()
        .default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
}, (table) => ({
    productCodeUnique: (0, pg_core_1.uniqueIndex)('product_roles_product_code_unique').on(table.productId, table.code),
}));
