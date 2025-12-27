import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Note: This baseURL should include /api prefix (matching VITE_EXPERIENCE_API_URL pattern)
// The /api prefix is included in the environment variable, so manual API calls don't need it
const API_BASE_URL: string =
  (import.meta.env.VITE_SSO_API_URL as string | undefined) ?? '';

/**
 * Handle session expiration by redirecting to appropriate login page
 */
const handleSessionExpiration = () => {
  // Clear all scholarship session tokens
  localStorage.removeItem('scholarship_session_token');
  sessionStorage.removeItem('scholarship_session_token');
  sessionStorage.removeItem('scholarship_admin_session_token');
  localStorage.removeItem('scholarship_auth');
  sessionStorage.removeItem('scholarship_auth');
  
  // Clear other tokens
  localStorage.removeItem('icaptur_access_token');
  localStorage.removeItem('icaptur_refresh_token');
  localStorage.removeItem('icaptur_user');
  
  // Determine which login page to redirect to based on current route
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.includes('admin') || 
                      currentPath.includes('role-management') || 
                      currentPath.includes('user-management') ||
                      currentPath.includes('home') ||
                      currentPath.includes('reports');
  
  const loginPath = isAdminRoute ? '/admin-login' : '/user-login';
  const redirectUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
  
  // Use window.location for a full page reload to ensure clean state
  // Small delay to ensure tokens are cleared before redirect
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 100);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check if this is a scholarship endpoint (role-management, user-management, scholarship-auth)
    const isScholarshipEndpoint = 
      config.url?.includes('/role-management') ||
      config.url?.includes('/user-management') ||
      config.url?.includes('/scholarship-auth');
    
    if (isScholarshipEndpoint) {
      // For scholarship endpoints, use scholarship session token
      const adminSessionToken = sessionStorage.getItem('scholarship_admin_session_token');
      const sessionToken = sessionStorage.getItem('scholarship_session_token') ?? 
                          localStorage.getItem('scholarship_session_token');
      
      if (adminSessionToken) {
        config.headers.Authorization = `Bearer ${adminSessionToken}`;
      } else if (sessionToken) {
        config.headers.Authorization = `Bearer ${sessionToken}`;
      }
    } else {
      // For other endpoints, use JWT token from secure storage
      try {
        const { secureTokenStorage } = await import(
          '@shared/utils/secureTokenStorage'
        );
        const token = await secureTokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Fallback to localStorage if secure storage fails
        const token = localStorage.getItem('icaptur_access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as AxiosError;
    
    // Extract error message safely
    let errorMessage = 'An error occurred';
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data as { message?: string; error?: string };
      if (typeof responseData.message === 'string') {
        errorMessage = responseData.message;
      } else if (typeof responseData.error === 'string') {
        errorMessage = responseData.error;
      }
    } else if (axiosError instanceof Error) {
      errorMessage = axiosError.message;
    }
    
    // Check for session expiration messages
    const sessionExpiredMessages = [
      'Session has expired',
      'session has expired',
      'Session expired',
      'session expired',
      'Please log in again',
      'please log in again',
      'Unauthorized',
      'unauthorized',
    ];
    
    const isSessionExpired = 
      axiosError.response?.status === 401 ||
      sessionExpiredMessages.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()));
    
    if (isSessionExpired) {
      // Handle session expiration with redirect
      // handleSessionExpiration();
      return Promise.reject(new Error(errorMessage));
    }
    
    // For other 401 errors, clear tokens but don't redirect (let the component handle it)
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('icaptur_access_token');
      localStorage.removeItem('icaptur_refresh_token');
      localStorage.removeItem('icaptur_user');
    }
    
    return Promise.reject(new Error(errorMessage));
  },
);
