import { Request } from 'express';

/**
 * User object attached to request by JWT strategy
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  tenantId: string | null;
  role: string;
  productCode: string;
}

/**
 * Authenticated request with user object
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
