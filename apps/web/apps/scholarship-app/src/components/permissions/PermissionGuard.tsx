import React, { ReactNode } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

interface PermissionGuardProps {
  screenUrl: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
  requireAll?: boolean; // If true, requires all permissions; if false, requires any
}

/**
 * PermissionGuard component - Conditionally renders children based on permissions
 * 
 * @example
 * <PermissionGuard screenUrl="/process">
 *   <ProcessPage />
 * </PermissionGuard>
 * 
 * @example
 * <PermissionGuard screenUrl={["/process", "/admin"]} requireAll={false}>
 *   <AdminOrProcessPage />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  screenUrl,
  fallback = null,
  children,
  requireAll = false,
}) => {
  const { hasPermission, hasAnyPermission, loading } = usePermissions();

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  let hasAccess = false;

  if (Array.isArray(screenUrl)) {
    if (requireAll) {
      hasAccess = screenUrl.every((url) => hasPermission(url));
    } else {
      hasAccess = hasAnyPermission(screenUrl);
    }
  } else {
    hasAccess = hasPermission(screenUrl);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

