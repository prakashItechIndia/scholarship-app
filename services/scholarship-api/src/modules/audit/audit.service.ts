import { Injectable, Logger } from '@nestjs/common';
import { auditEvent } from '@icaptur/database-schema';

import { DatabaseService } from '../../database/database.service';

type AuditPayload = Record<string, unknown> | undefined;

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Record an audit event in the shared audit_event table.
   * This is intentionally lightweight; callers should avoid leaking secrets.
   */
  async record(
    eventType: string,
    options: {
      tenantId?: string | null;
      actorUserId?: string | null;
      payload?: AuditPayload;
      ip?: string | null;
      userAgent?: string | null;
    } = {},
  ): Promise<void> {
    const { tenantId, actorUserId, payload, ip, userAgent } = options;

    try {
      await this.db.db.insert(auditEvent).values({
        eventType,
        tenantId: tenantId ?? null,
        actorUserId: actorUserId ?? null,
        eventPayload: payload ?? null,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
      });
    } catch (error) {
      this.logger.warn(
        `Failed to persist audit event ${eventType}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
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
    await this.record(eventType, {
      tenantId,
      actorUserId,
      payload: eventPayload,
      ip,
      userAgent,
    });
  }
}
