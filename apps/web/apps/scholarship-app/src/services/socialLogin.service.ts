import { apiClient } from '../shared/api-client';

export type SocialProvider = 'microsoft' | 'google' | 'apple';

interface SocialLoginConfig {
  clientId: string;
  redirectUri: string;
  scope?: string;
}

/**
 * Get OAuth configuration for a provider
 */
const getOAuthConfig = (provider: SocialProvider): SocialLoginConfig | null => {
  const baseUrl = window.location.origin;
  const redirectUri = `${baseUrl}/oauth-callback/${provider}`;

  const configs: Record<SocialProvider, SocialLoginConfig | null> = {
    microsoft: {
      clientId: (import.meta.env.VITE_MICROSOFT_CLIENT_ID as string) ?? '',
      redirectUri,
      scope: 'openid profile email',
    },
    google: {
      clientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ?? '',
      redirectUri,
      scope: 'openid profile email',
    },
    apple: {
      clientId: (import.meta.env.VITE_APPLE_CLIENT_ID as string) ?? '',
      redirectUri,
      scope: 'name email',
    },
  };

  const config = configs[provider];
  if (!config?.clientId) {
    console.warn(`OAuth configuration missing for ${provider}`);
    return null;
  }

  return config;
};

/**
 * Generate a random state string for CSRF protection
 */
const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store state in sessionStorage for verification
 */
const storeState = (state: string, provider: SocialProvider): void => {
  sessionStorage.setItem(`oauth_state_${provider}`, state);
  sessionStorage.setItem(`oauth_provider`, provider);
};

/**
 * Verify and clear stored state
 */
const verifyAndClearState = (state: string, provider: SocialProvider): boolean => {
  const storedState = sessionStorage.getItem(`oauth_state_${provider}`);
  const storedProvider = sessionStorage.getItem(`oauth_provider`);

  if (storedState === state && storedProvider === provider) {
    sessionStorage.removeItem(`oauth_state_${provider}`);
    sessionStorage.removeItem(`oauth_provider`);
    return true;
  }

  return false;
};

/**
 * Initiate OAuth login flow
 */
export const initiateSocialLogin = (provider: SocialProvider): void => {
  const config = getOAuthConfig(provider);
  if (!config) {
    throw new Error(
      `OAuth configuration not available for ${provider}. Please set VITE_${provider.toUpperCase()}_CLIENT_ID in your .env file.`,
    );
  }

  const state = generateState();
  storeState(state, provider);

  let authUrl = '';

  switch (provider) {
    case 'microsoft': {
      const params = new URLSearchParams({
        client_id: config.clientId,
        response_type: 'code',
        redirect_uri: config.redirectUri,
        response_mode: 'query',
        scope: config.scope ?? 'openid profile email',
        state,
      });
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
      break;
    }
    case 'google': {
      const params = new URLSearchParams({
        client_id: config.clientId,
        response_type: 'code',
        redirect_uri: config.redirectUri,
        scope: config.scope ?? 'openid profile email',
        state,
        access_type: 'offline',
        prompt: 'consent',
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      break;
    }
    case 'apple': {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        response_mode: 'query',
        scope: config.scope ?? 'name email',
        state,
      });
      authUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
      break;
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  // Redirect to OAuth provider
  window.location.href = authUrl;
};

/**
 * Handle OAuth callback - exchange code for tokens via backend
 * Returns same format as manual login for consistent handling
 */
export const handleOAuthCallback = async (
  provider: SocialProvider,
  code: string,
  state: string,
): Promise<{ success: boolean; user?: unknown; error?: string }> => {
  // Verify state
  if (!verifyAndClearState(state, provider)) {
    return { success: false, error: 'Invalid state parameter' };
  }

  try {
    // Call backend API - returns same format as manual login
    const response = await apiClient.post<{
      userId: number;
      userName: string;
      roleId: number;
      userType: string;
      passwordChange: boolean;
    }>('/scholarship-auth/social-login', {
      provider,
      code,
      redirectUri: getOAuthConfig(provider)?.redirectUri,
    });

    // Backend returns same format as manual login
    // Extract email from userName or use a fallback
    // The backend handles user creation/validation same as manual login
    const loginResponse = response.data;

    // Create session token (same as manual login)
    // userName from backend is actually the email (User_ID)
    const email = loginResponse.userName; // Backend returns email as userName
    const sessionToken = btoa(
      JSON.stringify({
        email: email,
        userId: loginResponse.userId,
        userName: loginResponse.userName,
        timestamp: Date.now(),
        expiresAt: Date.now() + 20 * 60 * 1000, // 20 minutes session timeout per BRD
      }),
    );

    // Store session token and user data (same as manual login)
    localStorage.setItem('scholarship_session_token', sessionToken);
    localStorage.setItem(
      'scholarship_auth',
      JSON.stringify({
        email: email,
        timestamp: Date.now(),
        user: loginResponse,
      }),
    );

    return { success: true, user: loginResponse };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to authenticate with social provider';
    return { success: false, error: errorMessage };
  }
};

/**
 * Check if OAuth is configured for a provider
 */
export const isOAuthConfigured = (provider: SocialProvider): boolean => {
  const config = getOAuthConfig(provider);
  return config !== null && config.clientId !== '';
};

/**
 * Social Login Service
 * Exports the same interface as manual login for consistency
 */
export const socialLogin = {
  initiate: initiateSocialLogin,
  handleCallback: handleOAuthCallback,
  isConfigured: isOAuthConfigured,
};

