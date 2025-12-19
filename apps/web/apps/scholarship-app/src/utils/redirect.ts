import type { StoredUser } from '@shared/utils/secureTokenStorage';

const envOrEmpty = (key: string) =>
  (import.meta.env[key] as string | undefined) ?? '';

/**
 * Product URL mapping
 * Uses environment variables; falls back to current origin when missing
 */
const getProductUrls = (): Record<string, string> => {
  const origin = window.location.origin;
  const accountsUrl = envOrEmpty('VITE_ACCOUNTS_URL') || origin;
  const experienceUrl =
    envOrEmpty('VITE_EXPERIENCE_APP_URL') || accountsUrl || origin;

  return {
    'customer-portal': envOrEmpty('VITE_CUSTOMER_PORTAL_URL') || origin,
    invox: envOrEmpty('VITE_INVOX_URL') || origin,
    irepo: envOrEmpty('VITE_IREPO_URL') || origin,
    ipraise: envOrEmpty('VITE_IPRAISE_URL') || origin,
    accounts: accountsUrl,
    experience: experienceUrl,
  };
};

const DEFAULT_REDIRECT_URL = (() => {
  const origin = window.location.origin;
  const accountsUrl = envOrEmpty('VITE_ACCOUNTS_URL') || origin;
  return `${accountsUrl}/dashboard`;
})();

/**
 * Validate if a URL is from an allowed iCaptur domain
 */
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      // Prod
      'icaptur.ai',
      'portal.icaptur.ai',
      'invox.icaptur.ai',
      'irepo.icaptur.ai',
      'ipraise.icaptur.ai',
      'app.icaptur.ai',
      // Dev/preview
      'scholarship-dev.itechlabs.app',
      'experience-dev.itechlabs.app',
      'icaptur-cp-dev.itechlabs.app',
      'irepo-dev.itechlabs.app',
      'invox-dev.itechlabs.app',
      // Local
      'localhost',
      '127.0.0.1',
    ];

    // Allow localhost with any port in development
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return true;
    }

    return allowedDomains.some((domain) => urlObj.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

/**
 * Get product URL from product code
 */
export const getProductUrl = (productCode: string): string => {
  const urls = getProductUrls();
  return urls[productCode] || DEFAULT_REDIRECT_URL;
};

/**
 * Handle redirect after authentication
 */
const appendAuthParams = (
  targetUrl: string,
  accessToken?: string,
  refreshToken?: string,
  user?: StoredUser,
): string => {
  if (!accessToken) {
    return targetUrl;
  }

  const urlObj = new URL(targetUrl);
  urlObj.searchParams.set('token', accessToken);

  if (refreshToken) {
    urlObj.searchParams.set('refreshToken', refreshToken);
  }

  if (user) {
    try {
      const encodedUser = btoa(JSON.stringify(user));
      urlObj.searchParams.set('user', encodedUser);
    } catch (error) {
      console.error('Failed to encode user payload for redirect', error);
    }
  }

  return urlObj.toString();
};

export const handleAuthRedirect = (
  returnUrl?: string | null,
  productCode?: string | null,
  accessToken?: string,
  refreshToken?: string,
  user?: StoredUser,
): void => {
  // Priority 1: returnUrl/redirectUrl (explicit redirect URL from query param)
  if (returnUrl && isValidRedirectUrl(returnUrl)) {
    const target = appendAuthParams(returnUrl, accessToken, refreshToken, user);
    window.location.href = target;
    return;
  }

  // Priority 2: product code
  if (productCode) {
    const productUrl = getProductUrl(productCode);
    const target = appendAuthParams(
      productUrl,
      accessToken,
      refreshToken,
      user,
    );
    window.location.href = target;
    return;
  }

  // Priority 3: Default redirect (Experience App dashboard)
  const target = appendAuthParams(
    DEFAULT_REDIRECT_URL,
    accessToken,
    refreshToken,
    user,
  );
  window.location.href = target;
};

/**
 * Preserve query parameters across redirects
 */
export const preserveQueryParams = (
  baseUrl: string,
  paramsToPreserve: string[] = [
    'returnUrl',
    'product',
    'state',
    'redirect_uri',
  ],
): string => {
  const url = new URL(baseUrl, window.location.origin);
  const currentParams = new URLSearchParams(window.location.search);

  paramsToPreserve.forEach((param) => {
    const value = currentParams.get(param);
    if (value) {
      url.searchParams.set(param, value);
    }
  });

  return url.pathname + url.search;
};
