import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Headers } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { AuthenticatedRequest } from '../../common/types/request.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { EnvVars } from '../../config/env.validation';
import { AuditService } from '../audit/audit.service';

class InvalidatePermissionsDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  productCode!: string;
}

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly auditService: AuditService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user permissions for product (from token aud)',
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions for the product',
    schema: {
      type: 'object',
      properties: {
        permissions: {
          type: 'array',
          items: { type: 'string' },
        },
        productCode: { type: 'string' },
      },
    },
  })
  async getMyPermissions(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;
    const productCode = req.user.productCode; // Audience = product code

    const permissions = await this.permissionsService.getUserPermissions(
      userId,
      tenantId,
      productCode,
    );

    return {
      permissions,
      productCode,
    };
  }

  @Post('invalidate')
  @ApiBearerAuth()
  @ApiBody({ type: InvalidatePermissionsDto })
  @ApiOperation({
    summary:
      'Invalidate cached permissions for a tenant/product (service-to-service)',
  })
  @ApiResponse({ status: 200, description: 'Invalidation accepted' })
  async invalidatePermissions(
    @Body() body: InvalidatePermissionsDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    // Since this endpoint is service-to-service, we manually check the bearer token
    const configuredToken = this.configService.get('SERVICE_API_TOKEN', {
      infer: true,
    });

    const rawAuthorization = headers.authorization ?? headers.Authorization;
    const authorizationHeader =
      typeof rawAuthorization === 'string'
        ? rawAuthorization
        : Array.isArray(rawAuthorization)
          ? rawAuthorization[0]
          : undefined;

    const token =
      typeof authorizationHeader === 'string' &&
      authorizationHeader.startsWith('Bearer ')
        ? authorizationHeader.slice('Bearer '.length)
        : undefined;

    if (!configuredToken || token !== configuredToken) {
      throw new UnauthorizedException('Invalid service token');
    }

    await this.permissionsService.invalidatePermissions(
      body.tenantId,
      body.productCode,
    );

    // Record audit entry for traceability
    await this.auditService.logEvent({
      tenantId: body.tenantId,
      eventType: 'permissions/invalidate',
      eventPayload: { productCode: body.productCode },
      actorUserId: null,
    });

    return { success: true };
  }
}
