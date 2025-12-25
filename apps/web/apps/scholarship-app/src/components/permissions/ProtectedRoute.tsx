import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PermissionGuard } from './PermissionGuard';

interface ProtectedRouteProps {
  screenUrl: string | string[];
  children: React.ReactNode;
  redirectTo?: string;
  requireAll?: boolean;
}

/**
 * ProtectedRoute component - Redirects if user doesn't have permission
 * 
 * @example
 * <Route 
 *   path="/process" 
 *   element={
 *     <ProtectedRoute screenUrl="/process">
 *       <ProcessPage />
 *     </ProtectedRoute>
 *   } 
 * />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  screenUrl,
  children,
  redirectTo = '/home',
  requireAll = false,
}) => {
  const location = useLocation();

  return (
    <PermissionGuard
      screenUrl={screenUrl}
      requireAll={requireAll}
      fallback={<Navigate to={redirectTo} state={{ from: location }} replace />}
    >
      {children}
    </PermissionGuard>
  );
};

