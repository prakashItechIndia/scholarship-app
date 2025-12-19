"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_account_1 = require("./user-account");
exports.file = (0, pg_core_1.pgTable)('files', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    key: (0, pg_core_1.text)('key').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    extension: (0, pg_core_1.text)('extension').notNull(),
    mimeType: (0, pg_core_1.text)('mime_type').notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    url: (0, pg_core_1.text)('url'),
    type: (0, pg_core_1.text)('type').notNull().default('document'), // e.g., profile_picture, contract, document
    ownerUserId: (0, pg_core_1.uuid)('owner_user_id').references(() => user_account_1.userAccount.id, {
        onDelete: 'set null',
    }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
