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
        // First, try to get userId from session token (most reliable)
        const sessionToken = sessionStorage.getItem('scholarship_admin_session_token') ||
                            sessionStorage.getItem('scholarship_session_token') ||
                            localStorage.getItem('scholarship_session_token');
        if (sessionToken) {
          try {
            const sessionData = JSON.parse(atob(sessionToken));
            const sessionUserId = sessionData?.userId;
            if (sessionUserId !== null && sessionUserId !== undefined) {
              const numId = typeof sessionUserId === 'string' ? parseInt(sessionUserId, 10) : sessionUserId;
              if (!isNaN(numId) && numId > 0) {
                console.log('[PermissionWrapper] Found userId from session token:', numId);
                setUserId(numId);
                return; // Found userId from session token, no need to check localStorage
              }
            }
          } catch (error) {
            console.warn('[PermissionWrapper] Failed to parse session token:', error);
          }
        }
        
        // Fallback: Try to get userId from localStorage scholarship_auth
        const authData = localStorage.getItem('scholarship_auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          console.log('[PermissionWrapper] Parsed auth data:', parsed);
          
          // The login response structure: { user: { userId, userName, roleId, userType } }
          // Try different possible user ID fields from scholarship auth
          const id = parsed?.user?.userId || 
                     parsed?.user?.id || 
                     parsed?.user?.ID ||
                     parsed?.user?.User_Id ||
                     parsed?.userId || 
                     parsed?.id ||
                     parsed?.ID;
          
          console.log('[PermissionWrapper] Extracted ID:', id);
          
          if (id !== null && id !== undefined) {
            const numId = typeof id === 'string' ? parseInt(id, 10) : id;
            if (!isNaN(numId) && numId > 0) {
              console.log('[PermissionWrapper] Setting userId from localStorage:', numId);
              setUserId(numId);
              return;
            } else {
              console.warn('[PermissionWrapper] Invalid userId extracted:', numId);
            }
          } else {
            console.warn('[PermissionWrapper] No userId found in auth data');
          }
        } else {
          console.warn('[PermissionWrapper] No scholarship_auth found in localStorage');
        }
      } catch (error) {
        console.error('[PermissionWrapper] Failed to load user ID for permissions:', error);
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

