import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Scholarship Session Guard
 * 
 * Validates that the request has a valid scholarship session token.
 * This guard checks for the session token in:
 * 1. Authorization header: "Bearer <session_token>"
 * 2. X-Scholarship-Session header
 * 3. Cookie: scholarship_session_token
 * 
 * The session token is a base64-encoded JSON object containing:
 * - username
 * - userId
 * - userName
 * - roleId
 * - timestamp
 * - expiresAt
 * - isAdmin
 */
@Injectable()
export class ScholarshipSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Try to get session token from various sources
    let sessionToken: string | undefined;
    
    // 1. Check Authorization header (Bearer token)
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7);
    }
    
    // 2. Check custom header
    if (!sessionToken) {
      sessionToken = request.headers['x-scholarship-session'] as string;
    }
    
    // 3. Check cookie
    if (!sessionToken && request.cookies) {
      sessionToken = request.cookies['scholarship_session_token'] || 
                     request.cookies['scholarship_admin_session_token'];
    }
    
    // 4. Check query parameter (for development/testing only)
    if (!sessionToken && process.env.NODE_ENV === 'development') {
      sessionToken = request.query.sessionToken as string;
    }
    
    if (!sessionToken) {
      throw new UnauthorizedException(
        'Scholarship session token is required. Please log in.',
      );
    }
    
    // Validate session token
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
      
      // Check if session is expired
      const now = Date.now();
      if (sessionData.expiresAt && sessionData.expiresAt < now) {
        throw new UnauthorizedException('Session has expired. Please log in again.');
      }
      
      // Attach session data to request for use in controllers/services
      // userType should be included in the session token (set during login)
      (request as Request & { scholarshipSession: typeof sessionData }).scholarshipSession = sessionData;
      
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        'Invalid session token. Please log in again.',
      );
    }
  }
}

