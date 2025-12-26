import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PermissionGuard } from '../permissions/PermissionGuard';
import {
  isScholarshipLoggedIn,
  getScholarshipUserType,
  getLandingPage,
  canUserTypeAccessRoute,
} from '../../utils/routeProtection';
import {
  getRouteConfig,
  isPublicRoute,
  requiresAuth,
} from '../../config/routeConfig';

interface RouteGuardProps {
  children: React.ReactNode;
  path: string;
}

/**
 * RouteGuard Component
 * 
 * Central route protection component that handles:
 * 1. If user is logged in and tries to access login page → redirect to landing page based on userType
 * 2. If user is not logged in and tries to access protected route → redirect to login page
 * 3. If logged-in user tries to access route without permission → redirect to landing page based on userType
 * 
 * Route metadata (from routeConfig):
 * - requiresAuth: Whether login is required
 * - isPublic: Whether this is a public route (login/registration pages)
 * - allowedUserTypes: Which user types can access this route
 * - screenUrl: Screen URL for permission checking via PermissionContext
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children, path }) => {
  const location = useLocation();
  
  // Check auth status synchronously - these functions read from storage and are fast
  // No need for useEffect or memoization which can cause infinite loops
  const isLoggedIn = isScholarshipLoggedIn();
  const userType = getScholarshipUserType();

  const routeConfig = getRouteConfig(path);
  const isPublic = isPublicRoute(path);
  const needsAuth = requiresAuth(path);
  const currentPath = location.pathname;

  // Case 1: User is logged in and trying to access public route (login page)
  // → Redirect to landing page based on userType
  if (isLoggedIn && isPublic) {
    const landingPage = getLandingPage(userType);
    // Prevent redirect loop - only redirect if we're not already on the landing page
    if (currentPath !== landingPage) {
      return <Navigate to={landingPage} replace />;
    }
  }

  // Case 2: User is not logged in and trying to access protected route
  // → Redirect to login page with redirect parameter
  if (!isLoggedIn && needsAuth) {
    // Prevent redirect loop - don't redirect if we're already on a login page
    if (currentPath !== '/admin-login' && currentPath !== '/user-login') {
      // Determine which login page to redirect to
      // For admin routes, redirect to admin-login, otherwise user-login
      const isAdminRoute = path.includes('admin') || 
                          path.includes('role-management') || 
                          path.includes('user-management') ||
                          path.includes('home') ||
                          path.includes('reports');
      const loginPath = isAdminRoute ? '/admin-login' : '/user-login';
      
      return (
        <Navigate 
          to={`${loginPath}?redirect=${encodeURIComponent(path)}`} 
          replace 
          state={{ from: location }}
        />
      );
    }
  }

  // Case 3: User is logged in but doesn't have permission based on userType
  // Check userType restrictions first (before screen-level permissions)
  if (isLoggedIn && routeConfig?.allowedUserTypes) {
    if (!canUserTypeAccessRoute(userType, routeConfig.allowedUserTypes)) {
      const landingPage = getLandingPage(userType);
      // Prevent redirect loop - only redirect if we're not already on the landing page
      if (currentPath !== landingPage) {
        return <Navigate to={landingPage} replace state={{ from: location }} />;
      }
      // If we're already on the landing page but don't have permission, show nothing or error
      return null;
    }
  }

  // Case 4: User is logged in and route requires permission check via PermissionContext
  // Use PermissionGuard for screen-level permissions (action-level: create, view, update, delete)
  if (isLoggedIn && routeConfig?.screenUrl) {
    // Administrators have full access to all pages - skip permission checks
    if (userType === 'Administrator') {
      return <>{children}</>;
    }
    
    // Managers have access to Process and Reports - skip permission checks for these routes
    if (userType === 'Manager') {
      if (currentPath === '/process' || currentPath === '/reports') {
        return <>{children}</>;
      }
    }
    
    // Standard Users have access to Process only - skip permission checks for this route
    if (userType === 'Standard User') {
      if (currentPath === '/process') {
        return <>{children}</>;
      }
    }
    
    const landingPage = getLandingPage(userType);
    
    // If we're already on the landing page, skip permission check to avoid blank screen
    // The landing page should be accessible to the user based on their userType
    // This prevents the case where permissions haven't loaded yet and we show a blank screen
    if (currentPath === landingPage) {
      return <>{children}</>;
    }
    
    return (
      <PermissionGuard
        screenUrl={routeConfig.screenUrl}
        requireAll={false}
        fallback={
          // Prevent redirect loop - only redirect if we're not already on the landing page
          currentPath !== landingPage ? (
            <Navigate 
              to={landingPage} 
              replace 
              state={{ from: location }} 
            />
          ) : (
            // If already on landing page but no permission, show children anyway
            // (landing page should be accessible based on userType)
            <>{children}</>
          )
        }
      >
        {children}
      </PermissionGuard>
    );
  }

  // All checks passed - render the route
  return <>{children}</>;
};

