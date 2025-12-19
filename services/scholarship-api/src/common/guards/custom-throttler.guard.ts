import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * Custom throttler guard that implements both IP-based and user-based rate limiting
 *
 * Rate Limits:
 * - IP-based: 1000 requests per minute per IP address
 * - User-based: 100 requests per minute per authenticated user
 *
 * IP extraction handles common proxy headers:
 * - X-Forwarded-For (takes first IP)
 * - X-Real-IP
 * - req.ip (fallback)
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Generate throttler key based on IP address and optionally user ID
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Request): Promise<string> {
    // Extract client IP address
    const clientIp = this.getClientIp(req);

    // Check if user is authenticated
    const user = (req as { user?: { userId?: string } }).user;

    if (user?.userId) {
      // For authenticated requests, use user ID for stricter limit
      return `user:${user.userId}`;
    }

    // For unauthenticated requests, use IP address
    return `ip:${clientIp}`;
  }

  /**
   * Get throttler limit based on request type
   * - Authenticated users: 100 req/min
   * - Unauthenticated (IP-based): 1000 req/min
   */
  protected getThrottlerLimit(context: ExecutionContext): number {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as { user?: { userId?: string } }).user;

    if (user?.userId) {
      // Authenticated user limit: 100 requests per minute
      return 100;
    }

    // IP-based limit: 1000 requests per minute
    return 1000;
  }

  /**
   * Get throttler TTL (time window) - 60 seconds for both
   */
  protected getThrottlerTtl(): number {
    return 60000; // 60 seconds (1 minute)
  }

  /**
   * Extract client IP address from request
   * Handles common proxy headers
   */
  private getClientIp(req: Request): string {
    // Check X-Forwarded-For header (set by proxies/load balancers)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first one (client IP)
      const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
      return ips.split(',')[0].trim();
    }

    // Check X-Real-IP header (set by some proxies)
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fallback to req.ip (direct connection or Express trust proxy)
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  /**
   * Override to provide custom error message
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as { user?: { userId?: string } }).user;
    const clientIp = this.getClientIp(request);

    const limitType = user?.userId ? 'user' : 'IP';
    const limit = user?.userId ? 100 : 1000;

    throw new ThrottlerException(
      `Rate limit exceeded. Maximum ${limit} requests per minute per ${limitType}. ` +
        `Please try again later. (${limitType}: ${user?.userId || clientIp})`,
    );
  }
}
