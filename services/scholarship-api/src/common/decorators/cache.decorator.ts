import { SetMetadata } from '@nestjs/common';

export const CACHE_TTL_KEY = 'cache_ttl';

/**
 * Decorator to set cache TTL for an endpoint
 * @param ttl Time to live in milliseconds
 */
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_KEY, ttl);

/**
 * Decorator to disable caching for an endpoint
 */
export const NoCache = () => SetMetadata('no_cache', true);
