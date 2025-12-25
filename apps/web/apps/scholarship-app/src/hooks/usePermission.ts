import { usePermissions } from '../contexts/PermissionContext';

/**
 * Hook to check if user has permission to access a screen
 * 
 * @example
 * const canAccessProcess = usePermission('/process');
 * if (canAccessProcess) {
 *   // Show process page
 * }
 */
export const usePermission = (screenUrl: string | string[]): boolean => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (Array.isArray(screenUrl)) {
    return hasAnyPermission(screenUrl);
  }

  return hasPermission(screenUrl);
};

/**
 * Hook to get all user permissions
 */
export const useUserPermissions = () => {
  const { permissions, loading, refreshPermissions } = usePermissions();

  return {
    permissions,
    loading,
    refreshPermissions,
  };
};

