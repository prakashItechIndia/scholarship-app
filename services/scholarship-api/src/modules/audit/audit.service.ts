import { Injectable, Logger } from '@nestjs/common';

// Note: Audit service is currently a no-op stub
// The original implementation used @icaptur/database-schema (Drizzle ORM) which is not available
// Audit logging is marked as "optional" in the codebase
// If PostgreSQL audit_event table logging is needed, implement using raw SQL queries

type AuditPayload = Record<string, unknown> | undefined;

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  /**
   * Record an audit event in the shared audit_event table.
   * This is intentionally lightweight; callers should avoid leaking secrets.
   *
   * Currently a no-op stub - audit logging is optional and not implemented
   * To enable: implement PostgreSQL connection and raw SQL INSERT queries
   */
  record(
    eventType: string,
    options: {
      tenantId?: string | null;
      actorUserId?: string | null;
      payload?: AuditPayload;
      ip?: string | null;
      userAgent?: string | null;
    } = {},
  ): void {
    // No-op: Audit logging is optional and not currently implemented
    // Log to console in development for debugging
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(
        `[Audit] ${eventType} - User: ${options.actorUserId ?? 'N/A'}, Tenant: ${options.tenantId ?? 'N/A'}`,
      );
    }
    // Silently succeed - audit logging is optional
  }

  async logEvent(input: {
    tenantId?: string | null;
    actorUserId?: string | null;
    eventType: string;
    eventPayload?: Record<string, unknown>;
    ip?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    const { tenantId, actorUserId, eventType, eventPayload, ip, userAgent } =
      input;
    // Make it async to maintain compatibility with existing callers
    this.record(eventType, {
      tenantId,
      actorUserId,
      payload: eventPayload,
      ip,
      userAgent,
    });
    return Promise.resolve();
  }
}
