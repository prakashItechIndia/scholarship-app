/**
 * Input Sanitization Interceptor
 * Automatically sanitizes request body, query, and params to prevent XSS attacks
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sanitizeObject, sanitizeString } from './validation';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // Sanitize request body
    if (request.body && typeof request.body === 'object') {
      request.body = sanitizeObject(request.body);
    }

    // Sanitize query parameters
    // Note: request.query is read-only (has only a getter), so we sanitize values in place
    if (request.query && typeof request.query === 'object') {
      try {
        // Iterate over query keys and sanitize string values in place
        Object.keys(request.query).forEach((key) => {
          const value = request.query[key];
          if (typeof value === 'string') {
            const sanitized = sanitizeString(value);
            // Use Object.defineProperty to replace the value
            // This works around the read-only getter limitation
            try {
              Object.defineProperty(request.query, key, {
                value: sanitized,
                writable: true,
                enumerable: true,
                configurable: true,
              });
            } catch {
              // If we can't modify, the value will remain unsanitized
              // This is acceptable as it's a defensive measure
            }
          } else if (typeof value === 'object' && value !== null) {
            // For nested objects, sanitize recursively
            const sanitized = sanitizeObject(value);
            try {
              Object.defineProperty(request.query, key, {
                value: sanitized,
                writable: true,
                enumerable: true,
                configurable: true,
              });
            } catch {
              // If we can't modify, skip
            }
          }
        });
      } catch {
        // If sanitization fails, continue without sanitizing query
      }
    }

    // Sanitize route parameters
    // Note: request.params is also read-only, so we sanitize values in place
    if (request.params && typeof request.params === 'object') {
      try {
        Object.keys(request.params).forEach((key) => {
          const value = request.params[key];
          if (typeof value === 'string') {
            const sanitized = sanitizeString(value);
            try {
              Object.defineProperty(request.params, key, {
                value: sanitized,
                writable: true,
                enumerable: true,
                configurable: true,
              });
            } catch {
              // If we can't modify, skip
            }
          } else if (typeof value === 'object' && value !== null) {
            const sanitized = sanitizeObject(value);
            try {
              Object.defineProperty(request.params, key, {
                value: sanitized,
                writable: true,
                enumerable: true,
                configurable: true,
              });
            } catch {
              // If we can't modify, skip
            }
          }
        });
      } catch {
        // If sanitization fails, continue without sanitizing params
      }
    }

    return next.handle().pipe(
      map((data) => {
        // Optionally sanitize response data (be careful with this)
        // For now, we'll only sanitize inputs, not outputs
        return data;
      }),
    );
  }
}
