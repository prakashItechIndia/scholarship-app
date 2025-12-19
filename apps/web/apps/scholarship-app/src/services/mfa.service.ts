import { apiClient } from '../shared/api-client';
import { createSsoApiClients } from '@shared/common/sso-api-client';
import type {
  MfaSetupResponseDto,
  MfaVerifyRequestDto,
  MfaVerifyResponseDto,
  MfaStatusResponseDto,
  MfaLoginVerifyRequestDto,
} from '@shared/_api';

// Create typed API clients
// Don't pass basePath - apiClient already has baseURL with /api from env var
const scholarshipApis = createSsoApiClients(apiClient);

/**
 * Get user agent string from browser
 */
function getUserAgent(): string {
  return navigator.userAgent;
}

/**
 * Initialize MFA setup (get QR code and backup codes)
 */
export async function initMfaSetup(): Promise<MfaSetupResponseDto> {
  const response = await scholarshipApis.mfa.mfaControllerInitMfaSetup();
  return response.data;
}

/**
 * Verify TOTP code and enable MFA
 */
export async function verifyAndEnableMfa(
  code: string,
): Promise<MfaVerifyResponseDto> {
  const userAgent = getUserAgent();
  const request: MfaVerifyRequestDto = { code };
  const response = await scholarshipApis.mfa.mfaControllerVerifyAndEnableMfa(
    userAgent,
    request,
  );
  return response.data;
}

/**
 * MFA Login Verify Response (extended to include tokens)
 */
export interface MfaLoginVerifyResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string | null;
  };
}

/**
 * Verify MFA code during login
 */
export async function verifyMfaLogin(
  userId: string,
  code: string,
  productCode?: string,
  tempToken?: string,
): Promise<MfaLoginVerifyResponse> {
  const userAgent = getUserAgent();
  // tempToken is part of the backend DTO but not in generated types yet
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  type MfaLoginVerifyRequestWithTemp = MfaLoginVerifyRequestDto & {
    tempToken?: string;
  };
  const request: MfaLoginVerifyRequestWithTemp = {
    userId,
    code,
    productCode,
    tempToken, // Include tempToken for security validation
  };
  const response = await scholarshipApis.mfa.mfaControllerVerifyMfaLogin(
    userAgent,
    request,
  );
  return response.data as MfaLoginVerifyResponse;
}

/**
 * Get MFA status for current user
 */
export async function getMfaStatus(): Promise<MfaStatusResponseDto> {
  const response = await scholarshipApis.mfa.mfaControllerGetMfaStatus();
  return response.data;
}

/**
 * Disable MFA
 */
export async function disableMfa(): Promise<void> {
  const userAgent = getUserAgent();
  await scholarshipApis.mfa.mfaControllerDisableMfa(userAgent);
}
