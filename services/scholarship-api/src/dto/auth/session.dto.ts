import { ApiProperty } from '@nestjs/swagger';

// ============================================================================
// Session DTOs
// ============================================================================

export class SessionResponseDto {
  @ApiProperty({ description: 'Session ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'User ID', example: 'uuid-here' })
  userId: string;

  @ApiProperty({ description: 'Session token' })
  sessionToken: string;

  @ApiProperty({ description: 'Session active status', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Session expiry timestamp' })
  expiresAt: Date;

  @ApiProperty({ description: 'Last activity timestamp' })
  lastActivityAt: Date;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.1',
    nullable: true,
  })
  ipAddress: string | null;

  @ApiProperty({
    description: 'User agent',
    example: 'Mozilla/5.0...',
    nullable: true,
  })
  userAgent: string | null;

  @ApiProperty({ description: 'Session created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Session updated timestamp' })
  updatedAt: Date;
}

export class LogoutAllSessionsResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of sessions invalidated',
    example: 3,
  })
  sessionsInvalidated: number;
}
