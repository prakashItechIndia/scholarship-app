/**
 * SSO API Client Setup
 * Creates typed API clients for SSO API using generated OpenAPI types
 */

import { AxiosInstance } from 'axios';
import {
  AuthenticationApi,
  MFAApi,
  HealthApi,
  JWKSApi,
  AdminRedirectURIsApi,
  Configuration,
  ConfigurationParameters,
} from '../_api';

export interface SsoApiClients {
  authentication: AuthenticationApi;
  mfa: MFAApi;
  health: HealthApi;
  jwks: JWKSApi;
  adminRedirectUris: AdminRedirectURIsApi;
}

/**
 * Create SSO API clients with proper configuration
 * Note: Don't pass basePath if axiosInstance already has baseURL set with /api
 * The axios instance's baseURL will be used automatically
 */
export const createSsoApiClients = (
  axiosInstance: AxiosInstance,
  basePath?: string,
): SsoApiClients => {
  // If axios instance already has baseURL with /api, set basePath to empty string
  // This prevents double /api prefix:
  // - axios baseURL: https://sso-dev.itechlabs.app/api
  // - basePath: '' (empty)
  // - path: /auth/check-email
  // - Result: https://sso-dev.itechlabs.app/api/auth/check-email ✅
  // If basePath is explicitly provided, use it (for cases where baseURL is not set)
  const hasBaseURL = !!axiosInstance.defaults.baseURL;
  // Use empty string when axios has baseURL, so the generated client creates relative URLs
  const effectiveBasePath = basePath ?? (hasBaseURL ? '' : undefined);

  const config: ConfigurationParameters = {
    basePath: effectiveBasePath ?? '',
    baseOptions: axiosInstance.defaults,
  };

  const configuration = new Configuration(config);

  return {
    authentication: new AuthenticationApi(
      configuration,
      effectiveBasePath ?? '',
      axiosInstance,
    ),
    mfa: new MFAApi(configuration, effectiveBasePath ?? '', axiosInstance),
    health: new HealthApi(configuration, effectiveBasePath ?? '', axiosInstance),
    jwks: new JWKSApi(configuration, effectiveBasePath ?? '', axiosInstance),
    adminRedirectUris: new AdminRedirectURIsApi(
      configuration,
      effectiveBasePath ?? '',
      axiosInstance,
    ),
  };
};

/**
 * Example usage:
 *
 * import { createSsoApiClients } from '@shared/common/sso-api-client';
 * import { apiClient } from './api-client';
 *
 * // Don't pass basePath if apiClient already has baseURL with /api
 * const ssoApis = createSsoApiClients(apiClient);
 *
 * // Use typed API calls
 * const loginResponse = await ssoApis.authentication.authControllerLogin({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 *
 * // Types are automatically inferred from OpenAPI spec
 * const user = await ssoApis.authentication.authControllerGetMe();
 */
