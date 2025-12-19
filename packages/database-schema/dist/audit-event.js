"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditEvent = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.auditEvent = (0, pg_core_1.pgTable)('audit_event', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id'), // Nullable for iTech admin actions
    actorUserId: (0, pg_core_1.uuid)('actor_user_id'), // User who performed the action
    eventType: (0, pg_core_1.text)('event_type').notNull(), // e.g., 'user/login', 'subscription/created', 'user/created'
    eventPayload: (0, pg_core_1.jsonb)('event_payload'), // JSONB for event-specific data
    ip: (0, pg_core_1.text)('ip'), // Source IP address (masked in logs)
    userAgent: (0, pg_core_1.text)('user_agent'), // User agent string
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
