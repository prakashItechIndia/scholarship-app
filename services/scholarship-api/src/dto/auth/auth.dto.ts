import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

// ============================================================================
// Login DTOs
// ============================================================================

export class LoginRequestDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'Product code for product-specific login',
    example: 'invox',
  })
  @IsOptional()
  @IsString()
  productCode?: string;
}

export class UserDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User role', example: 'user' })
  role: string;

  @ApiPropertyOptional({
    description: 'Tenant ID',
    example: 'tenant-uuid',
    type: String,
  })
  tenantId?: string | null;
}

export class LoginResponseDto {
  @ApiPropertyOptional({ description: 'JWT access token' })
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Refresh token' })
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Token expiry in seconds',
    example: 3600,
  })
  expiresIn?: number;

  @ApiPropertyOptional({ description: 'Token type', example: 'Bearer' })
  tokenType?: string;

  @ApiPropertyOptional({ description: 'User information', type: UserDto })
  user?: UserDto;

  @ApiPropertyOptional({
    description: 'Whether MFA is required',
    example: false,
  })
  mfaRequired?: boolean;

  @ApiPropertyOptional({ description: 'Temporary token for MFA verification' })
  tempToken?: string;

  @ApiPropertyOptional({ description: 'User ID (for MFA flow)' })
  userId?: string;
}

// ============================================================================
// Refresh Token DTOs
// ============================================================================

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token_here',
  })
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'New JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'New refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Token expiry in seconds', example: 3600 })
  expiresIn: number;
}

// ============================================================================
// Logout DTOs
// ============================================================================

export class LogoutRequestDto {
  @ApiProperty({
    description: 'Refresh token to invalidate',
    example: 'refresh_token_here',
  })
  @IsString()
  refreshToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({ description: 'Success status', example: true })
  success: boolean;

  @ApiProperty({ description: 'Message', example: 'Logged out successfully' })
  message: string;
}

// ============================================================================
// Password Reset DTOs
// ============================================================================

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Return URL to redirect after password reset',
    example: 'https://invox.icaptur.ai/dashboard',
    required: false,
  })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiProperty({
    description: 'Product code for redirect after password reset',
    example: 'invox',
    required: false,
  })
  @IsOptional()
  @IsString()
  productCode?: string;
}

export class PasswordResetResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from email',
    example: 'reset_token_here',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

// ============================================================================
// Account Activation DTOs
// ============================================================================

export class ValidateActivationTokenDto {
  @ApiProperty({
    description: 'Activation token from email',
    example: 'activation_token_here',
  })
  @IsString()
  token: string;
}

export class ActivationTokenValidationResponseDto {
  @ApiProperty({ description: 'Validation status', example: true })
  valid: boolean;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
}

export class CreatePasswordDto {
  @ApiProperty({
    description: 'Activation token',
    example: 'activation_token_here',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

// ============================================================================
// Email Check DTOs
// ============================================================================

export class CheckEmailDto {
  @ApiProperty({
    description: 'Email address to check',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class EmailCheckResponseDto {
  @ApiProperty({ description: 'Whether email exists', example: true })
  exists: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Account is already active. Please sign in.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: 'org_admin',
  })
  role?: string;

  @ApiPropertyOptional({
    description: 'Organization name (for org_admin users)',
    example: 'Tech Solutions',
  })
  orgName?: string;
}

// ============================================================================
// Resend Activation DTOs
// ============================================================================

export class ResendActivationDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

// ============================================================================
// Signup DTOs
// ============================================================================

export class SignupRequestDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  organizationName: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Product code for tracking which product user signed up for',
    example: 'invox',
  })
  @IsOptional()
  @IsString()
  productCode?: string;
}

export class SignupResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'User ID', example: 'uuid-here' })
  userId: string;
}

// ============================================================================
// Change Password DTOs
// ============================================================================

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'CurrentPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ChangePasswordResponseDto extends LoginResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
}

// ============================================================================
// Get Me Response DTO
// ============================================================================

export class GetMeResponseDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User role', example: 'user' })
  role: string;

  @ApiPropertyOptional({
    description: 'Tenant ID',
    example: 'tenant-uuid',
    type: String,
  })
  tenantId?: string | null;

  @ApiProperty({ description: 'Account status', example: 'active' })
  status: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
    type: String,
  })
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'Profile picture key',
    type: String,
  })
  profilePictureKey?: string | null;
}
