import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { eq, and, gt, lt, inArray } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { ssoSessions, productSessions } from '@icaptur/database-schema';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Create SSO session for user
   */
  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.db.db.insert(ssoSessions).values({
      userId,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
      isActive: true,
    });

    this.logger.log(`SSO session created for user ${userId}`);
    return sessionToken;
  }

  /**
   * Validate session token and return user ID if valid
   * Used by OAuth authorize endpoint to check if user is already authenticated
   * Optimized: Uses RETURNING clause to combine select and update in single query
   */
  async validateSessionToken(sessionToken: string): Promise<string | null> {
    if (!sessionToken) {
      return null;
    }

    const now = new Date();

    // Optimized: Single query with RETURNING clause - combines select and update
    const [session] = await this.db.db
      .update(ssoSessions)
      .set({ lastActivityAt: now })
      .where(
        and(
          eq(ssoSessions.sessionToken, sessionToken),
          eq(ssoSessions.isActive, true),
          gt(ssoSessions.expiresAt, now),
        ),
      )
      .returning({
        userId: ssoSessions.userId,
      });

    if (!session) {
      return null;
    }

    this.logger.log(`Session validated for user ${String(session.userId)}`);
    return session.userId;
  }

  /**
   * Link product session to SSO session
   */
  async linkProductSession(
    sessionToken: string,
    productCode: string,
    accessTokenJti: string,
  ): Promise<void> {
    const [session] = await this.db.db
      .select()
      .from(ssoSessions)
      .where(
        and(
          eq(ssoSessions.sessionToken, sessionToken),
          eq(ssoSessions.isActive, true),
          gt(ssoSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) {
      this.logger.warn(`Invalid or expired session token: ${sessionToken}`);
      return;
    }

    await this.db.db.insert(productSessions).values({
      ssoSessionId: session.id,
      productCode,
      accessTokenJti,
      isActive: true,
    });

    // Update last activity
    await this.db.db
      .update(ssoSessions)
      .set({ lastActivityAt: new Date() })
      .where(eq(ssoSessions.id, session.id));

    this.logger.log(
      `Product session linked: ${productCode} for session ${sessionToken}`,
    );
  }

  /**
   * Get all active product sessions for a user
   */
  async getUserProductSessions(userId: string) {
    const sessions = await this.db.db
      .select({
        sessionId: ssoSessions.id,
        sessionToken: ssoSessions.sessionToken,
        productCode: productSessions.productCode,
        productSessionId: productSessions.id,
        accessTokenJti: productSessions.accessTokenJti,
        lastUsedAt: productSessions.lastUsedAt,
      })
      .from(ssoSessions)
      .innerJoin(
        productSessions,
        eq(productSessions.ssoSessionId, ssoSessions.id),
      )
      .where(
        and(
          eq(ssoSessions.userId, userId),
          eq(ssoSessions.isActive, true),
          eq(productSessions.isActive, true),
          gt(ssoSessions.expiresAt, new Date()),
        ),
      );

    return sessions;
  }

  /**
   * Logout user from all products (single logout)
   * Optimized: Uses batch queries instead of loops to reduce database round trips
   */
  async logoutAllProducts(
    userId: string,
    reason: 'user_initiated' | 'admin_revoked' | 'security',
  ): Promise<string[]> {
    const now = new Date();

    // Optimized: Get all active sessions and product sessions in parallel with joins
    const sessionsWithProducts = await this.db.db
      .select({
        sessionId: ssoSessions.id,
        accessTokenJti: productSessions.accessTokenJti,
      })
      .from(ssoSessions)
      .leftJoin(
        productSessions,
        and(
          eq(productSessions.ssoSessionId, ssoSessions.id),
          eq(productSessions.isActive, true),
        ),
      )
      .where(
        and(eq(ssoSessions.userId, userId), eq(ssoSessions.isActive, true)),
      );

    if (sessionsWithProducts.length === 0) {
      return [];
    }

    // Collect JWT IDs for token revocation
    const revokedTokens = sessionsWithProducts
      .map((sp) => sp.accessTokenJti)
      .filter((jti): jti is string => Boolean(jti));

    // Get unique session IDs
    const sessionIds = [
      ...new Set(sessionsWithProducts.map((sp) => sp.sessionId)),
    ];

    // Optimized: Batch update all product sessions at once using inArray
    if (sessionIds.length > 0) {
      await this.db.db
        .update(productSessions)
        .set({ isActive: false })
        .where(inArray(productSessions.ssoSessionId, sessionIds));
    }

    // Optimized: Batch update all SSO sessions at once
    await this.db.db
      .update(ssoSessions)
      .set({
        isActive: false,
        logoutAt: now,
        logoutReason: reason,
      })
      .where(
        and(eq(ssoSessions.userId, userId), eq(ssoSessions.isActive, true)),
      );

    this.logger.log(
      `User ${userId} logged out from ${sessionIds.length} SSO sessions, ${revokedTokens.length} tokens revoked`,
    );

    return revokedTokens;
  }

  /**
   * Logout user from specific product
   */
  async logoutProduct(
    userId: string,
    productCode: string,
  ): Promise<string | null> {
    const [session] = await this.db.db
      .select()
      .from(ssoSessions)
      .where(
        and(eq(ssoSessions.userId, userId), eq(ssoSessions.isActive, true)),
      )
      .limit(1);

    if (!session) {
      return null;
    }

    const [prodSession] = await this.db.db
      .select()
      .from(productSessions)
      .where(
        and(
          eq(productSessions.ssoSessionId, session.id),
          eq(productSessions.productCode, productCode),
          eq(productSessions.isActive, true),
        ),
      )
      .limit(1);

    if (!prodSession) {
      return null;
    }

    // Deactivate product session
    await this.db.db
      .update(productSessions)
      .set({ isActive: false })
      .where(eq(productSessions.id, prodSession.id));

    this.logger.log(`User ${userId} logged out from product ${productCode}`);

    return prodSession.accessTokenJti;
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    const expiredSessions = await this.db.db
      .select()
      .from(ssoSessions)
      .where(
        and(eq(ssoSessions.isActive, true), lt(ssoSessions.expiresAt, now)),
      );

    for (const session of expiredSessions) {
      await this.db.db
        .update(ssoSessions)
        .set({
          isActive: false,
          logoutAt: new Date(),
          logoutReason: 'expired',
        })
        .where(eq(ssoSessions.id, session.id));
    }

    const count = expiredSessions.length;
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired SSO sessions`);
    }

    return count;
  }
}
