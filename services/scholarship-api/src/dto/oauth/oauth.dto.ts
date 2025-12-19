import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';

// ============================================================================
// OAuth2 Authorize DTOs
// ============================================================================

export class AuthorizeRequestDto {
  @ApiProperty({
    description: 'Response type - must be "code"',
    example: 'code',
    enum: ['code'],
  })
  @IsString()
  @IsEnum(['code'])
  response_type: string;

  @ApiProperty({
    description: 'Client ID (product code)',
    example: 'invox',
  })
  @IsString()
  client_id: string;

  @ApiProperty({
    description: 'Redirect URI (must be whitelisted)',
    example: 'https://invox-dev.itechlabs.app/callback',
  })
  @IsUrl()
  redirect_uri: string;

  @ApiProperty({
    description: 'Random state for CSRF protection',
    example: 'random_state_string',
  })
  @IsString()
  state: string;

  @ApiPropertyOptional({
    description: 'PKCE code challenge (SHA-256 hash of verifier)',
    example: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  })
  @IsOptional()
  @IsString()
  code_challenge?: string;

  @ApiPropertyOptional({
    description: 'PKCE code challenge method',
    example: 'S256',
    enum: ['S256', 'plain'],
  })
  @IsOptional()
  @IsEnum(['S256', 'plain'])
  code_challenge_method?: 'S256' | 'plain';

  @ApiPropertyOptional({
    description: 'Requested scopes (space-separated)',
    example: 'openid profile email',
  })
  @IsOptional()
  @IsString()
  scope?: string;
}

// ============================================================================
// OAuth2 Token DTOs
// ============================================================================

export class TokenRequestDto {
  @ApiProperty({
    description: 'Grant type - must be "authorization_code"',
    example: 'authorization_code',
    enum: ['authorization_code'],
  })
  @IsString()
  @IsEnum(['authorization_code'])
  grant_type: string;

  @ApiProperty({
    description: 'Authorization code from /authorize',
    example: 'auth_code_here',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Redirect URI (must match the one used in /authorize)',
    example: 'https://invox-dev.itechlabs.app/callback',
  })
  @IsUrl()
  redirect_uri: string;

  @ApiProperty({
    description: 'Client ID (product code)',
    example: 'invox',
  })
  @IsString()
  client_id: string;

  @ApiPropertyOptional({
    description: 'PKCE code verifier',
    example: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  })
  @IsOptional()
  @IsString()
  code_verifier?: string;
}

export class TokenResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'a1b2c3d4e5f6...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'ID token (OIDC) - contains user profile information',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  id_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Token expiry in seconds',
    example: 3600,
  })
  expires_in: number;
}

export class TokenErrorResponseDto {
  @ApiProperty({
    description: 'Error code',
    example: 'invalid_grant',
    enum: [
      'invalid_request',
      'invalid_grant',
      'unauthorized_client',
      'unsupported_grant_type',
      'invalid_scope',
    ],
  })
  error: string;

  @ApiProperty({
    description: 'Human-readable error description',
    example: 'The provided authorization code is invalid or expired',
  })
  error_description: string;
}

// ============================================================================
// Generate Code (Internal) DTOs
// ============================================================================

export class GenerateCodeRequestDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-here',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Product code',
    example: 'invox',
  })
  @IsString()
  productCode: string;

  @ApiProperty({
    description: 'Redirect URI',
    example: 'https://invox-dev.itechlabs.app/callback',
  })
  @IsUrl()
  redirectUri: string;

  @ApiProperty({
    description: 'PKCE code challenge',
    example: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  })
  @IsString()
  codeChallenge: string;

  @ApiProperty({
    description: 'PKCE code challenge method',
    example: 'S256',
    enum: ['S256', 'plain'],
  })
  @IsEnum(['S256', 'plain'])
  codeChallengeMethod: 'S256' | 'plain';
}

export class GenerateCodeResponseDto {
  @ApiProperty({
    description: 'Authorization code',
    example: 'abc123xyz...',
  })
  code: string;
}
