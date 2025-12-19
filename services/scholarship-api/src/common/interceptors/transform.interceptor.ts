import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response transformation interceptor
 * Standardizes API responses and removes sensitive data
 */
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already transformed, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data as Response<T>;
        }

        // Transform to standard response format
        return {
          success: true,
          data: data as T,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
