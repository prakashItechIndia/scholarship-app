import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { roleManagement } from '../services/scholarship.service';

export interface Screen {
  id: number;
  screenName: string;
  url: string;
  isActive: boolean;
}

export interface UserPermission {
  userId: number;
  roleId: number;
  roleName: string;
  screens: Screen[];
}

interface PermissionContextType {
  permissions: UserPermission | null;
  loading: boolean;
  hasPermission: (screenUrl: string) => boolean;
  hasAnyPermission: (screenUrls: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ 
  children,
  userId 
}: { 
  children: ReactNode;
  userId?: number;
}) => {
  const [permissions, setPermissions] = useState<UserPermission | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userPermissions = await roleManagement.getUserPermissions(userId);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPermissions();
  }, [userId]);

  const hasPermission = (screenUrl: string): boolean => {
    if (!permissions || !permissions.screens) {
      return false;
    }

    // Normalize URLs for comparison (remove leading/trailing slashes)
    const normalizeUrl = (url: string) => url.replace(/^\/+|\/+$/g, '').toLowerCase();
    const normalizedTarget = normalizeUrl(screenUrl);

    return permissions.screens.some(
      (screen) => normalizeUrl(screen.url) === normalizedTarget || 
                  normalizedTarget.startsWith(normalizeUrl(screen.url))
    );
  };

  const hasAnyPermission = (screenUrls: string[]): boolean => {
    return screenUrls.some((url) => hasPermission(url));
  };

  const refreshPermissions = async () => {
    await loadPermissions();
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        loading,
        hasPermission,
        hasAnyPermission,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

