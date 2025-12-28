/**
 * Route Configuration
 * 
 * Defines route metadata including authentication requirements and permissions
 */

export interface RouteConfig {
  /** Path pattern (supports React Router patterns like /edit/:id) */
  path: string;
  /** Whether login is required to access this route */
  requiresAuth: boolean;
  /** Screen URL for permission checking (used with PermissionContext) */
  screenUrl?: string;
  /** Required user types that can access this route (empty = all authenticated users) */
  allowedUserTypes?: string[];
  /** Whether this is a public route (login/registration pages) */
  isPublic?: boolean;
}

/**
 * Route configuration map
 * Maps route paths to their protection requirements
 */
export const routeConfig: RouteConfig[] = [
  // Public auth routes (no login required, redirect if logged in)
  {
    path: '/user-login',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/admin-login',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/create-password',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/registration',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/forgot-password',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/reset-password',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/admin-reset-password',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/change-password',
    requiresAuth: true,
    screenUrl: '/change-password',
  },
  {
    path: '/mfa/verify',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/mfa-verify',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/verification',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/set-password',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/email-verification',
    requiresAuth: false,
    isPublic: true,
  },
  {
    path: '/oauth-callback/:provider',
    requiresAuth: false,
    isPublic: true,
  },
  
  // Protected routes (require login and permissions)
  {
    path: '/process',
    requiresAuth: true,
    screenUrl: '/process',
    allowedUserTypes: ['Administrator', 'Manager', 'Standard User'],
  },
  {
    path: '/reports',
    requiresAuth: true,
    screenUrl: '/reports',
    allowedUserTypes: ['Administrator', 'Manager'],
  },
  {
    path: '/role-management',
    requiresAuth: true,
    screenUrl: '/role-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/role-management/add',
    requiresAuth: true,
    screenUrl: '/role-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/role-management/edit/:id',
    requiresAuth: true,
    screenUrl: '/role-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/user-management',
    requiresAuth: true,
    screenUrl: '/user-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/user-management/add',
    requiresAuth: true,
    screenUrl: '/user-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/user-management/edit/:id',
    requiresAuth: true,
    screenUrl: '/user-management',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/scholarship-change-password',
    requiresAuth: true,
    screenUrl: '/change-password',
  },
  {
    path: '/user-dashboard',
    requiresAuth: true,
    screenUrl: '/user-dashboard',
  },
  {
    path: '/admin-dashboard',
    requiresAuth: true,
    screenUrl: '/admin-dashboard',
    allowedUserTypes: ['Administrator'],
  },
  {
    path: '/home',
    requiresAuth: true,
    screenUrl: '/home',
    allowedUserTypes: ['Administrator'],
  },
];

/**
 * Get route configuration for a given path
 * Supports React Router path patterns (e.g., /edit/:id)
 */
export const getRouteConfig = (pathname: string): RouteConfig | null => {
  // First try exact match
  let config = routeConfig.find((r) => r.path === pathname);
  
  if (config) {
    return config;
  }
  
  // Try pattern matching (for routes with parameters like /edit/:id)
  for (const route of routeConfig) {
    if (route.path.includes(':')) {
      // Convert route path pattern to regex
      const pattern = route.path
        .replace(/:[^/]+/g, '[^/]+') // Replace :param with [^/]+
        .replace(/\//g, '\\/'); // Escape slashes
      const regex = new RegExp(`^${pattern}$`);
      
      if (regex.test(pathname)) {
        return route;
      }
    }
  }
  
  return null;
};

/**
 * Check if a route is public (login/registration pages)
 */
export const isPublicRoute = (pathname: string): boolean => {
  const config = getRouteConfig(pathname);
  return config?.isPublic === true;
};

/**
 * Check if a route requires authentication
 */
export const requiresAuth = (pathname: string): boolean => {
  const config = getRouteConfig(pathname);
  return config?.requiresAuth === true;
};

