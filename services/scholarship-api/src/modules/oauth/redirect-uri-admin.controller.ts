import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { eq, and } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import {
  productRedirectUris,
  type ProductRedirectUri,
  products,
} from '@icaptur/database-schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateRedirectUriDto,
  UpdateRedirectUriDto,
  RedirectUriResponseDto,
} from '../../dto/admin/redirect-uri.dto';

@ApiTags('Admin - Redirect URIs')
@Controller('admin/redirect-uris')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RedirectUriAdminController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all redirect URIs' })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'environment', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of redirect URIs',
    type: [RedirectUriResponseDto],
  })
  async getAllRedirectUris(
    @Query('productId') productId?: string,
    @Query('environment') environment?: string,
  ): Promise<RedirectUriResponseDto[]> {
    if (!productId && !environment) {
      // No filters, return all
      return this.db.db.select().from(productRedirectUris);
    }

    if (productId && environment) {
      // Both filters
      return this.db.db
        .select()
        .from(productRedirectUris)
        .where(
          and(
            eq(productRedirectUris.productId, productId),
            eq(productRedirectUris.environment, environment),
          ),
        );
    }

    if (productId) {
      // Only productId filter
      return this.db.db
        .select()
        .from(productRedirectUris)
        .where(eq(productRedirectUris.productId, productId));
    }

    // Only environment filter
    return this.db.db
      .select()
      .from(productRedirectUris)
      .where(eq(productRedirectUris.environment, environment!));
  }

  @Get('by-product/:productCode')
  @ApiOperation({ summary: 'Get redirect URIs for a specific product' })
  @ApiParam({ name: 'productCode', description: 'Product code (e.g., invox)' })
  @ApiResponse({ status: 200, description: 'Redirect URIs for the product' })
  async getRedirectUrisByProduct(
    @Param('productCode') productCode: string,
  ): Promise<ProductRedirectUri[]> {
    const [product] = await this.db.db
      .select()
      .from(products)
      .where(eq(products.code, productCode))
      .limit(1);

    if (!product) {
      return [];
    }

    return this.db.db
      .select()
      .from(productRedirectUris)
      .where(eq(productRedirectUris.productId, product.id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new redirect URI' })
  @ApiResponse({
    status: 201,
    description: 'Redirect URI created successfully',
    type: RedirectUriResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createRedirectUri(
    @Body() dto: CreateRedirectUriDto,
  ): Promise<RedirectUriResponseDto> {
    const [newUri] = await this.db.db
      .insert(productRedirectUris)
      .values({
        productId: dto.productId,
        redirectUri: dto.redirectUri,
        environment: dto.environment,
        isActive: true,
      })
      .returning();

    return newUri;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a redirect URI' })
  @ApiParam({ name: 'id', description: 'Redirect URI ID' })
  @ApiResponse({
    status: 200,
    description: 'Redirect URI updated successfully',
    type: RedirectUriResponseDto,
  })
  async updateRedirectUri(
    @Param('id') id: string,
    @Body() dto: UpdateRedirectUriDto,
  ): Promise<RedirectUriResponseDto> {
    const updateData: Partial<ProductRedirectUri> = {
      updatedAt: new Date(),
    };

    if (dto.redirectUri !== undefined) {
      updateData.redirectUri = dto.redirectUri;
    }
    if (dto.environment !== undefined) {
      updateData.environment = dto.environment;
    }
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive;
    }

    const [updated] = await this.db.db
      .update(productRedirectUris)
      .set(updateData)
      .where(eq(productRedirectUris.id, id))
      .returning();

    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a redirect URI' })
  @ApiParam({ name: 'id', description: 'Redirect URI ID' })
  @ApiResponse({
    status: 204,
    description: 'Redirect URI deleted successfully',
  })
  async deleteRedirectUri(@Param('id') id: string): Promise<void> {
    await this.db.db
      .delete(productRedirectUris)
      .where(eq(productRedirectUris.id, id));
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a redirect URI' })
  @ApiParam({ name: 'id', description: 'Redirect URI ID' })
  @ApiResponse({ status: 200, description: 'Redirect URI activated' })
  async activateRedirectUri(
    @Param('id') id: string,
  ): Promise<ProductRedirectUri> {
    const [updated] = await this.db.db
      .update(productRedirectUris)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(productRedirectUris.id, id))
      .returning();

    return updated;
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a redirect URI' })
  @ApiParam({ name: 'id', description: 'Redirect URI ID' })
  @ApiResponse({ status: 200, description: 'Redirect URI deactivated' })
  async deactivateRedirectUri(
    @Param('id') id: string,
  ): Promise<ProductRedirectUri> {
    const [updated] = await this.db.db
      .update(productRedirectUris)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(productRedirectUris.id, id))
      .returning();

    return updated;
  }
}
