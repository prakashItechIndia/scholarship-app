import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { EnvVars } from '../../config/env.validation';

interface JWK {
  kty: string;
  use: string;
  kid: string;
  alg: string;
  n?: string;
  e?: string;
  k?: string;
}

interface JWKSResponse {
  keys: JWK[];
}

@ApiTags('JWKS')
@Controller('.well-known')
export class JwksController {
  constructor(private readonly configService: ConfigService<EnvVars, true>) {}

  @Get('jwks.json')
  @ApiOperation({
    summary: 'Get JSON Web Key Set (JWKS)',
    description:
      'Returns public keys for verifying JWT signatures. Products can use this endpoint to verify access tokens without contacting the SSO API.',
  })
  @ApiResponse({
    status: 200,
    description: 'JWKS retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        keys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              kty: { type: 'string', example: 'oct' },
              use: { type: 'string', example: 'sig' },
              kid: { type: 'string', example: 'default' },
              alg: { type: 'string', example: 'HS256' },
              k: {
                type: 'string',
                description: 'Base64url-encoded key (for symmetric keys)',
              },
            },
          },
        },
      },
    },
  })
  getJwks(): JWKSResponse {
    const jwtSecret = this.configService.get('JWT_SECRET', { infer: true });

    // For HMAC (HS256), we use symmetric key
    // Note: In production, consider using RSA (RS256) with public/private key pair
    const jwk: JWK = {
      kty: 'oct', // Octet sequence (symmetric key)
      use: 'sig', // Used for signature
      kid: 'default', // Key ID
      alg: 'HS256', // Algorithm
      k: Buffer.from(jwtSecret).toString('base64url'), // Base64url-encoded secret
    };

    return {
      keys: [jwk],
    };
  }

  @Get('openid-configuration')
  @ApiOperation({
    summary: 'Get OpenID Connect Discovery document',
    description:
      'Returns OpenID Connect configuration metadata for automatic client configuration.',
  })
  @ApiResponse({
    status: 200,
    description: 'OpenID configuration retrieved successfully',
  })
  getOpenIdConfiguration() {
    const issuer = this.configService.get('SSO_ISSUER', { infer: true });

    return {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['HS256'],
      token_endpoint_auth_methods_supported: ['none'],
      code_challenge_methods_supported: ['S256'],
    };
  }
}
