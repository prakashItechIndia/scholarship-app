import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional, IsUrl, IsUUID } from 'class-validator';

// ============================================================================
// Redirect URI DTOs
// ============================================================================

export class CreateRedirectUriDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-here',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Redirect URI',
    example: 'https://invox.icaptur.ai/callback',
  })
  @IsUrl()
  redirectUri: string;

  @ApiProperty({
    description: 'Environment',
    example: 'production',
    enum: ['development', 'staging', 'production'],
  })
  @IsEnum(['development', 'staging', 'production'])
  environment: 'development' | 'staging' | 'production';
}

export class UpdateRedirectUriDto {
  @ApiPropertyOptional({
    description: 'Redirect URI',
    example: 'https://invox.icaptur.ai/callback',
  })
  @IsOptional()
  @IsUrl()
  redirectUri?: string;

  @ApiPropertyOptional({
    description: 'Environment',
    example: 'production',
    enum: ['development', 'staging', 'production'],
  })
  @IsOptional()
  @IsEnum(['development', 'staging', 'production'])
  environment?: 'development' | 'staging' | 'production';

  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RedirectUriResponseDto {
  @ApiProperty({ description: 'Redirect URI ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Product ID', example: 'uuid-here' })
  productId: string;

  @ApiProperty({
    description: 'Redirect URI',
    example: 'https://invox.icaptur.ai/callback',
  })
  redirectUri: string;

  @ApiProperty({
    description: 'Environment',
    example: 'production',
    enum: ['development', 'staging', 'production'],
  })
  environment: string;

  @ApiProperty({ description: 'Active status', example: true, nullable: true })
  isActive: boolean | null;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}
