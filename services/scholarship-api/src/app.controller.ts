import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API root - List available endpoints' })
  @ApiOkResponse({
    description: 'API information and available endpoints',
  })
  getRoot() {
    return {
      service: 'Scholarship Management',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        docs: '/api/docs',
        auth: {
          login: 'POST /api/auth/login',
          checkEmail: 'POST /api/auth/check-email',
          createPassword: 'POST /api/auth/create-password',
          passwordResetRequest: 'POST /api/auth/password-reset/request',
          passwordResetConfirm: 'POST /api/auth/password-reset/confirm',
          resendActivation: 'POST /api/auth/resend-activation',
          profile: 'GET /api/auth/profile',
          refresh: 'POST /api/auth/refresh',
        },
        permissions: {
          me: 'GET /api/permissions/me',
          products: 'GET /api/permissions/products',
        },
        jwks: 'GET /.well-known/jwks.json',
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Service health check' })
  @ApiOkResponse({
    description: 'Current health status of the SSO service',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return this.appService.getHealth();
  }
}
