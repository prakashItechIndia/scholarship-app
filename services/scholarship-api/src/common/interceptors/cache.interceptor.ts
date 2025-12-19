import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

/**
 * Cache interceptor for GET requests
 * Uses in-memory cache with TTL
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: unknown; expiresAt: number }>();
  private readonly defaultTTL = 60 * 1000; // 1 minute default

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      query: Record<string, unknown>;
      headers: Record<string, string | string[] | undefined>;
      user?: { userId?: string };
    }>();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check for cache control headers
    const cacheControl = request.headers['cache-control'];
    if (cacheControl === 'no-cache' || cacheControl === 'no-store') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);

    // Check if cache is valid
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.data);
    }

    // Get TTL from metadata or use default
    const ttl = this.getTTL() || this.defaultTTL;

    return next.handle().pipe(
      tap((data) => {
        // Cache the response
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + ttl,
        });

        // Clean up expired entries periodically
        this.cleanupExpiredEntries();
      }),
    );
  }

  private generateCacheKey(request: {
    method: string;
    url: string;
    query: Record<string, unknown>;
    user?: { userId?: string };
  }): string {
    const { url, query, user } = request;
    const userKey = user?.userId || 'anonymous';
    return `${request.method}:${url}:${JSON.stringify(query)}:${userKey}`;
  }

  private getTTL(): number | null {
    // You can use SetMetadata to set custom TTL per endpoint
    // For now, return null to use default
    return null;
  }

  private cleanupExpiredEntries(): void {
    // Clean up every 100th request to avoid performance impact
    if (Math.random() < 0.01) {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (value.expiresAt <= now) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Clear cache for a specific pattern
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
