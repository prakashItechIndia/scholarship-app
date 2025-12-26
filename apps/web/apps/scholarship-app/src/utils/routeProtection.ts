/**
 * Route Protection Utilities
 * 
 * Provides utilities for route protection, authentication checks, and landing page determination
 */

export interface ScholarshipAuthData {
  email?: string;
  cardcode?: string;
  rememberMe?: boolean;
  timestamp?: number;
  user?: {
    userId?: number;
    userName?: string;
    roleId?: number;
    userType?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Check if user is logged in using scholarship auth
 */
export const isScholarshipLoggedIn = (): boolean => {
  try {
    const authData = localStorage.getItem('scholarship_auth');
    if (!authData) {
      return false;
    }
    
    const parsed = JSON.parse(authData) as ScholarshipAuthData;
    
    // Check if we have user data
    if (!parsed?.user) {
      return false;
    }
    
    // Check if session token exists (for admin users)
    const adminSessionToken = sessionStorage.getItem('scholarship_admin_session_token');
    if (adminSessionToken) {
      try {
        const sessionData = JSON.parse(atob(adminSessionToken));
        const now = Date.now();
        if (sessionData.expiresAt && sessionData.expiresAt > now) {
          return true;
        }
      } catch {
        // Invalid session token
      }
    }
    
    // Check if regular session token exists (for student users)
    const sessionToken = localStorage.getItem('scholarship_session_token') || 
                        sessionStorage.getItem('scholarship_session_token');
    if (sessionToken) {
      try {
        const sessionData = JSON.parse(atob(sessionToken));
        const now = Date.now();
        if (sessionData.expiresAt && sessionData.expiresAt > now) {
          return true;
        }
      } catch {
        // Invalid session token
      }
    }
    
    // If we have user data but no valid session token, still consider logged in
    // (for backward compatibility, but session should be checked)
    return true;
  } catch {
    return false;
  }
};

/**
 * Get user data from scholarship auth
 */
export const getScholarshipUserData = (): ScholarshipAuthData | null => {
  try {
    const authData = localStorage.getItem('scholarship_auth');
    if (!authData) {
      return null;
    }
    return JSON.parse(authData) as ScholarshipAuthData;
  } catch {
    return null;
  }
};

/**
 * Get user type from scholarship auth
 */
export const getScholarshipUserType = (): string | null => {
  const userData = getScholarshipUserData();
  return userData?.user?.userType ?? null;
};

/**
 * Get landing page based on user type
 */
export const getLandingPage = (userType?: string | null): string => {
  if (!userType) {
    return '/home'; // Default landing page
  }
  
  switch (userType) {
    case 'Administrator':
      return '/home'; // Full dashboard access
    case 'Manager':
      return '/process'; // Process and Reports only
    case 'Standard User':
      return '/process'; // Process only
    default:
      return '/home'; // Default fallback
  }
};

/**
 * Check if a user type has permission to access a route
 * This is a simple check based on userType - more granular checks use PermissionContext
 */
export const canUserTypeAccessRoute = (
  userType: string | null | undefined,
  requiredUserTypes?: string[]
): boolean => {
  if (!requiredUserTypes || requiredUserTypes.length === 0) {
    return true; // No restrictions
  }
  
  if (!userType) {
    return false; // No user type means no access
  }
  
  return requiredUserTypes.includes(userType);
};

