import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * Scholarship User Type Guard
 * 
 * Checks if the user's userType matches the required user types for the endpoint.
 * 
 * Usage:
 * @UseGuards(ScholarshipSessionGuard, ScholarshipUserTypeGuard)
 * @RequireUserTypes('Administrator', 'Manager')
 * async someEndpoint() { ... }
 */
export const REQUIRE_USER_TYPES_KEY = 'requireUserTypes';

export const RequireUserTypes = (...userTypes: string[]) => {
  return SetMetadata(REQUIRE_USER_TYPES_KEY, userTypes);
};

@Injectable()
export class ScholarshipUserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredUserTypes = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_USER_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredUserTypes || requiredUserTypes.length === 0) {
      // No restrictions - allow access
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { 
      scholarshipSession?: { userType?: string; [key: string]: unknown };
    }>();
    
    const session = request.scholarshipSession;
    if (!session) {
      // If no session, this guard should be used after ScholarshipSessionGuard
      // which would have already thrown an error
      throw new ForbiddenException('Session not found. Please log in.');
    }

    const userType = session.userType;
    if (!userType) {
      throw new ForbiddenException(
        'User type not found in session. Please log in again.',
      );
    }

    if (!requiredUserTypes.includes(userType)) {
      throw new ForbiddenException(
        `Access denied. This endpoint requires one of the following user types: ${requiredUserTypes.join(', ')}. Your user type: ${userType}`,
      );
    }

    return true;
  }
}

