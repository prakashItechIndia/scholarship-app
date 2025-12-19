import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

// ============================================================================
// MFA Setup DTOs
// ============================================================================

export class MfaSetupResponseDto {
  @ApiProperty({
    description: 'TOTP secret (base32 encoded)',
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string;

  @ApiProperty({
    description: 'QR code data URL for authenticator apps',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qrCode: string;

  @ApiProperty({
    description: 'Backup codes (one-time use)',
    example: ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2'],
    type: [String],
  })
  backupCodes: string[];
}

// ============================================================================
// MFA Verify DTOs
// ============================================================================

export class MfaVerifyRequestDto {
  @ApiProperty({
    description: '6-digit TOTP code from authenticator app',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^[0-9]{6}$/, { message: 'Code must be 6 digits' })
  code: string;
}

export class MfaVerifyResponseDto {
  @ApiProperty({
    description: 'Verification success status',
    example: true,
  })
  success: boolean;
}

// ============================================================================
// MFA Login Verify DTOs
// ============================================================================

export class MfaLoginVerifyRequestDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-here',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '6-digit TOTP code or 8-character backup code',
    example: '123456',
    minLength: 6,
    maxLength: 8,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Temporary token from login (required for security)',
    example: 'temp-jwt-token-here',
    required: false,
  })
  @IsOptional()
  @IsString()
  tempToken?: string;

  @ApiProperty({
    description: 'Product code for access token generation',
    example: 'experience',
    required: false,
  })
  @IsOptional()
  @IsString()
  productCode?: string;
}

export class MfaLoginVerifyResponseDto {
  @ApiProperty({
    description: 'Verification success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'JWT access token (returned on successful verification)',
    required: false,
  })
  accessToken?: string;

  @ApiProperty({
    description: 'Refresh token (returned on successful verification)',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Token expiry in seconds',
    example: 3600,
    required: false,
  })
  expiresIn?: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    required: false,
  })
  tokenType?: string;

  @ApiProperty({
    description: 'User information (returned on successful verification)',
    required: false,
  })
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string | null;
  };
}

// ============================================================================
// MFA Status DTOs
// ============================================================================

export class MfaStatusResponseDto {
  @ApiProperty({
    description: 'Whether MFA is enabled for the user',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'MFA method being used',
    example: 'totp',
    enum: ['totp', 'sms', 'email'],
    nullable: true,
  })
  method: string | null;

  @ApiProperty({
    description: 'Phone number for SMS MFA (if method is SMS)',
    example: '+1234567890',
    nullable: true,
    required: false,
  })
  phoneNumber?: string | null;

  @ApiProperty({
    description: 'Number of unused backup codes remaining',
    example: 8,
  })
  backupCodesRemaining: number;
}

// ============================================================================
// SMS MFA Setup DTOs
// ============================================================================

export class MfaSmsSetupRequestDto {
  @ApiProperty({
    description: 'Phone number for SMS MFA',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;
}

export class MfaSmsSetupResponseDto {
  @ApiProperty({
    description: 'Phone number (normalized)',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Backup codes (one-time use)',
    example: ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2'],
    type: [String],
  })
  backupCodes: string[];
}

// ============================================================================
// MFA Disable Response DTO
// ============================================================================

export class MfaDisableResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;
}
