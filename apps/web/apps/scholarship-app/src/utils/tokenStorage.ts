// Re-export secure token storage from shared package
export * from '@shared/utils/secureTokenStorage';

// For backward compatibility, create a synchronous wrapper
// Note: This will use encrypted storage internally
import {
  secureTokenStorage,
  type StoredUser,
} from '@shared/utils/secureTokenStorage';

export type { StoredUser };

/**
 * Synchronous token storage wrapper (for backward compatibility)
 * Uses secure encrypted storage internally
 * Note: Some methods are async but wrapped for compatibility
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    // Return null synchronously - callers should use secureTokenStorage directly
    // This maintains compatibility but tokens should be accessed via secureTokenStorage
    return null;
  },

  async getAccessTokenAsync(): Promise<string | null> {
    return secureTokenStorage.getAccessToken();
  },

  getRefreshToken(): string | null {
    return null;
  },

  async getRefreshTokenAsync(): Promise<string | null> {
    return secureTokenStorage.getRefreshToken();
  },

  getUser(): StoredUser | null {
    return null;
  },

  async getUserAsync(): Promise<StoredUser | null> {
    return secureTokenStorage.getUser();
  },

  setTokens(
    accessToken: string,
    refreshToken?: string,
    user?: StoredUser,
  ): void {
    // Defer to async version
    void secureTokenStorage.setTokens(accessToken, refreshToken, user);
  },

  async setTokensAsync(
    accessToken: string,
    refreshToken?: string,
    user?: StoredUser,
  ): Promise<void> {
    return secureTokenStorage.setTokens(accessToken, refreshToken, user);
  },

  clearTokens(): void {
    secureTokenStorage.clearTokens();
  },

  hasValidToken(): boolean {
    // Return false synchronously - use secureTokenStorage.hasValidToken() for async check
    return false;
  },

  async hasValidTokenAsync(): Promise<boolean> {
    return secureTokenStorage.hasValidToken();
  },
};
