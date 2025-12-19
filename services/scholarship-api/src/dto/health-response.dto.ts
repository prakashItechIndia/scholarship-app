import { ApiProperty } from '@nestjs/swagger';

type Environment = 'development' | 'test' | 'production' | 'staging';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({
    enum: ['development', 'test', 'production', 'staging'],
    example: 'development',
  })
  environment!: Environment;

  @ApiProperty({
    description: 'ISO8601 timestamp representing the service evaluation moment',
    example: new Date().toISOString(),
    type: String,
    format: 'date-time',
  })
  timestamp!: string;
}
