import { apiClient } from '../shared/api-client';

/**
 * Check if current request is OAuth2 flow
 */
export function isOAuth2Flow(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has('redirect_uri') &&
    searchParams.has('state') &&
    searchParams.has('code_challenge')
  );
}

/**
 * Generate authorization code after successful login
 * This is called from SignIn page after authentication
 */
export async function generateAuthorizationCode(
  userId: string,
  productCode: string,
  redirectUri: string,
  codeChallenge: string,
  codeChallengeMethod: 'S256' | 'plain',
): Promise<string> {
  try {
    const response = await apiClient.post<{ code: string }>(
      '/oauth/generate-code',
      {
        userId,
        productCode,
        redirectUri,
        codeChallenge,
        codeChallengeMethod,
      },
    );

    const code = response.data.code;
    if (typeof code !== 'string') {
      throw new Error('Invalid authorization code format');
    }
    return code;
  } catch (error) {
    console.error('Failed to generate authorization code:', error);
    throw new Error('Authorization code generation failed');
  }
}

/**
 * Get OAuth2 parameters from URL
 */
export interface OAuth2Params {
  redirectUri: string;
  state: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
  scope?: string;
}

export function getOAuth2Params(
  searchParams: URLSearchParams,
): OAuth2Params | null {
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');

  if (!redirectUri || !state) {
    return null;
  }

  return {
    redirectUri,
    state,
    codeChallenge: searchParams.get('code_challenge') ?? undefined,
    codeChallengeMethod:
      (searchParams.get('code_challenge_method') as 'S256' | 'plain') ?? 'S256',
    scope: searchParams.get('scope') ?? undefined,
  };
}
