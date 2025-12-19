/**
 * PKCE (Proof Key for Code Exchange) implementation
 * RFC 7636: https://tools.ietf.org/html/rfc7636
 */

/**
 * Generate cryptographically random string for code verifier
 * Must be 43-128 characters from [A-Z, a-z, 0-9, -, ., _, ~]
 */
function generateRandomString(length: number): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);

  // Use Web Crypto API for cryptographically secure randomness
  crypto.getRandomValues(values);

  return Array.from(values)
    .map((v) => charset[v % charset.length])
    .join('');
}

/**
 * Generate SHA-256 hash of code verifier
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

/**
 * Base64URL encode (RFC 4648 Section 5)
 * Convert to base64, then replace +/= with -_
 */
function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate PKCE code verifier and challenge
 *
 * @returns Object with codeVerifier and codeChallenge
 */
export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  // Generate random code verifier (128 characters for maximum security)
  const codeVerifier = generateRandomString(128);

  // Generate code challenge (SHA-256 hash of verifier, base64url encoded)
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);

  return { codeVerifier, codeChallenge };
}

/**
 * Generate random state for CSRF protection
 */
export function generateRandomState(): string {
  return generateRandomString(32);
}
