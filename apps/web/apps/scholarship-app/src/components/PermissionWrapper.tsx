import React, { ReactNode, useEffect, useState } from 'react';
import { PermissionProvider } from '../contexts/PermissionContext';

interface PermissionWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides permissions based on scholarship auth
 */
export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Get user ID from scholarship auth localStorage
    const loadUserId = () => {
      try {
        const authData = localStorage.getItem('scholarship_auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          // Try different possible user ID fields from scholarship auth
          // The login response structure: { user: { userId, userName, roleId, userType } }
          const id = parsed?.user?.userId || 
                     parsed?.user?.id || 
                     parsed?.user?.ID ||
                     parsed?.userId || 
                     parsed?.id ||
                     parsed?.ID;
          if (id !== null && id !== undefined) {
            const numId = typeof id === 'string' ? parseInt(id, 10) : id;
            if (!isNaN(numId) && numId > 0) {
              setUserId(numId);
              return; // Found userId, no need to check session token
            }
          }
        }
        
        // Fallback: Try to get userId from session token
        const sessionToken = sessionStorage.getItem('scholarship_admin_session_token') ||
                            sessionStorage.getItem('scholarship_session_token') ||
                            localStorage.getItem('scholarship_session_token');
        if (sessionToken) {
          try {
            const sessionData = JSON.parse(atob(sessionToken));
            const sessionUserId = sessionData?.userId;
            if (sessionUserId) {
              const numId = typeof sessionUserId === 'string' ? parseInt(sessionUserId, 10) : sessionUserId;
              if (!isNaN(numId) && numId > 0) {
                setUserId(numId);
              }
            }
          } catch {
            // Invalid session token, ignore
          }
        }
      } catch (error) {
        console.error('Failed to load user ID for permissions:', error);
      }
    };

    loadUserId();
    
    // Listen for storage changes
    window.addEventListener('storage', loadUserId);
    const interval = setInterval(loadUserId, 1000); // Check every second for auth changes
    
    return () => {
      window.removeEventListener('storage', loadUserId);
      clearInterval(interval);
    };
  }, []);

  return (
    <PermissionProvider userId={userId}>
      {children}
    </PermissionProvider>
  );
};

