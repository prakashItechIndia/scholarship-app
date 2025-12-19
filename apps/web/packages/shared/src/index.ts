// ============================================
// MAIN EXPORTS - @shared
// ============================================

// Providers (legacy theme helpers)
export * from './providers';

// Hooks & utilities
export * from './lib';

// Types
export * from './type';

// Common utilities
export * from './common';

// API clients (optional, for internal use)
export * from './_api';

// Export API client factories for easy access
export { createSsoApiClients } from './common/sso-api-client';
export type { SsoApiClients } from './common/sso-api-client';
export { secureTokenStorage } from './utils/secureTokenStorage';
export type { StoredUser } from './utils/secureTokenStorage';
export {
  initializeTokenRefresh,
  startTokenRefresh,
  stopTokenRefresh,
  setupCrossTabSync,
  centralizedLogout,
  getAccessToken,
} from './services/centralizedTokenRefresh';
