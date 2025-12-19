import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  secureTokenStorage,
  type StoredUser,
} from '@shared/utils/secureTokenStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    productCode?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    const token = await secureTokenStorage.getAccessToken();
    const refreshToken = await secureTokenStorage.getRefreshToken();
    const storedUser = await secureTokenStorage.getUser();

    // If we have a token, check if it's valid
    if (token) {
      const isValid = await secureTokenStorage.hasValidToken();
      if (isValid) {
        setAccessToken(token);
        setUser(storedUser);
        setIsAuthenticated(true);

        // Optionally verify token with backend
        try {
          const { getMe } = await import('../services/auth.service');
          const userData = await getMe();
          const storedUser: StoredUser = {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            tenantId: userData.tenantId ?? null,
          };
          setUser(storedUser);
          const refreshToken = await secureTokenStorage.getRefreshToken();
          await secureTokenStorage.setTokens(
            token,
            refreshToken ?? undefined,
            storedUser,
          );
        } catch {
          // Token invalid, clear storage
          secureTokenStorage.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          setAccessToken(null);
        }
      } else {
        // Access token expired - attempt to refresh if we have a refresh token
        if (refreshToken) {
          try {
            const { getAccessToken } = await import(
              '@shared/services/centralizedTokenRefresh'
            );
            // Force refresh since token is expired
            const newToken = await getAccessToken(true);
            if (newToken) {
              // Refresh succeeded - update state and verify with backend
              const updatedUser = await secureTokenStorage.getUser();
              setAccessToken(newToken);
              setUser(updatedUser ?? storedUser);
              setIsAuthenticated(true);

              // Verify token with backend
              try {
                const { getMe } = await import('../services/auth.service');
                const userData = await getMe();
                const storedUser: StoredUser = {
                  id: userData.id,
                  email: userData.email,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  role: userData.role,
                  tenantId: userData.tenantId ?? null,
                };
                setUser(storedUser);
                const refreshToken = await secureTokenStorage.getRefreshToken();
                await secureTokenStorage.setTokens(
                  newToken,
                  refreshToken ?? undefined,
                  storedUser,
                );
              } catch {
                // Backend verification failed, but token refresh succeeded
                // Keep user authenticated with refreshed token
                console.warn(
                  '[AuthContext] Token refreshed but backend verification failed',
                );
              }
            } else {
              // Refresh failed - clear storage
              secureTokenStorage.clearTokens();
              setIsAuthenticated(false);
              setUser(null);
              setAccessToken(null);
            }
          } catch (error) {
            // Refresh failed - clear storage
            console.error('[AuthContext] Token refresh failed:', error);
            secureTokenStorage.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
            setAccessToken(null);
          }
        } else {
          // No refresh token - clear storage
          secureTokenStorage.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          setAccessToken(null);
        }
      }
    } else if (refreshToken) {
      // No access token but we have refresh token - try to refresh
      try {
        const { getAccessToken } = await import(
          '@shared/services/centralizedTokenRefresh'
        );
        const newToken = await getAccessToken(true);
        if (newToken) {
          // Refresh succeeded
          const updatedUser = await secureTokenStorage.getUser();
          setAccessToken(newToken);
          setUser(updatedUser ?? storedUser);
          setIsAuthenticated(true);

          // Verify token with backend
          try {
            const { getMe } = await import('../services/auth.service');
            const userData = await getMe();
            const storedUser: StoredUser = {
              id: userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role,
              tenantId: userData.tenantId ?? null,
            };
            setUser(storedUser);
            const refreshToken = await secureTokenStorage.getRefreshToken();
            await secureTokenStorage.setTokens(
              newToken,
              refreshToken ?? undefined,
              storedUser,
            );
          } catch {
            // Backend verification failed, but token refresh succeeded
            console.warn(
              '[AuthContext] Token refreshed but backend verification failed',
            );
          }
        } else {
          // Refresh failed - clear storage
          secureTokenStorage.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        // Refresh failed - clear storage
        console.error('[AuthContext] Token refresh failed:', error);
        secureTokenStorage.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      }
    } else {
      // No tokens at all
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    void checkAuthStatus();
    
    // Initialize centralized token refresh system for authenticated users
    const initTokenRefresh = async () => {
      // Check if we're on signin page with logout parameter - don't initialize refresh in that case
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') === 'true') {
          return () => {
            // No-op cleanup function
          };
        }
      }
      
      // Initialize token refresh if we have either access token or refresh token
      const token = await secureTokenStorage.getAccessToken();
      const refreshToken = await secureTokenStorage.getRefreshToken();
      if (token || refreshToken) {
        const { initializeTokenRefresh } = await import('@shared/services/centralizedTokenRefresh');
        const cleanup = initializeTokenRefresh();
        return cleanup;
      }
      return () => {
        // No-op cleanup function
      };
    };
    
    let cleanup: (() => void) | undefined;
    void initTokenRefresh().then((cleanupFn) => {
      cleanup = cleanupFn;
    });
    
    return () => {
      cleanup?.();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    productCode?: string,
  ) => {
    const { signIn } = await import('../services/auth.service');
    const response = await signIn({ email, password, productCode });

    // Check if MFA is required
    if (response.mfaRequired) {
      throw new Error('MFA_REQUIRED');
    }

    const { accessToken: token, refreshToken, user: userData } = response;
    if (!token || !userData) {
      throw new Error('Invalid login response');
    }
    const storedUser: StoredUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      tenantId: userData.tenantId ?? null,
    };
    await secureTokenStorage.setTokens(
      token,
      refreshToken ?? undefined,
      storedUser,
    );
    setAccessToken(token);
    setUser(storedUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // Use centralized logout to ensure all products are logged out
    try {
      const { centralizedLogout } = await import('@shared/services/centralizedTokenRefresh');
      await centralizedLogout();
    } catch (error) {
      console.error('Centralized logout failed, clearing local tokens:', error);
      // Fallback to local logout if centralized logout fails
      secureTokenStorage.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        loading,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
