"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotificationPreferences = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_account_1 = require("./user-account");
/**
 * User Notification Preferences Table
 * Stores user-specific notification settings
 */
exports.userNotificationPreferences = (0, pg_core_1.pgTable)('user_notification_preferences', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_account_1.userAccount.id, { onDelete: 'cascade' })
        .unique(), // One preference record per user
    // Desktop notification settings
    enableDesktopNotification: (0, pg_core_1.text)('enable_desktop_notification')
        .notNull()
        .default('true'), // 'true' or 'false'
    enableUnreadNotificationBadge: (0, pg_core_1.text)('enable_unread_notification_badge')
        .notNull()
        .default('true'), // 'true' or 'false'
    pushNotificationTimeout: (0, pg_core_1.integer)('push_notification_timeout')
        .notNull()
        .default(5000), // Timeout in milliseconds (default 5 seconds)
    // Email notification settings
    communicationEmails: (0, pg_core_1.text)('communication_emails')
        .notNull()
        .default('true'), // 'true' or 'false'
    announcementAndUpdates: (0, pg_core_1.text)('announcement_and_updates')
        .notNull()
        .default('false'), // 'true' or 'false'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
