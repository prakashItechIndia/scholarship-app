import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { EnvVars } from './config/env.validation';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<EnvVars, true>) {}

  getHealth(): HealthResponseDto {
    const environment = this.configService.getOrThrow<EnvVars['NODE_ENV']>(
      'NODE_ENV',
      {
        infer: true,
      },
    ) as EnvVars['NODE_ENV'];

    return {
      status: 'ok',

      environment,
      timestamp: new Date().toISOString(),
    };
  }
}
