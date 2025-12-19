import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

import { DatabaseService } from '../../database/database.service';
import { RedisService } from '../../common/redis/redis.service';
import {
  auditEvent,
  userAccount,
  tenantProductSubscriptions,
  products,
  productEntitlements,
  userProductPermissions,
} from '@icaptur/database-schema';
import { USER_ROLES } from '@icaptur/shared-utils';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  async invalidatePermissions(
    tenantId: string,
    productCode: string,
  ): Promise<void> {
    await this.db.db.insert(auditEvent).values({
      tenantId,
      actorUserId: null,
      eventType: 'permissions/invalidate',
      eventPayload: { productCode },
    });

    // Broadcast to listeners (if Redis configured)
    await this.redisService.publish('permissions.invalidate', {
      tenantId,
      productCode,
      at: new Date().toISOString(),
    });
  }

  async getUserPermissions(
    userId: string,
    tenantId: string | null,
    productCode: string,
  ): Promise<string[]> {
    // First, get user to verify tenant match early
    const [user] = await this.db.db
      .select({
        id: userAccount.id,
        role: userAccount.role,
        tenantId: userAccount.tenantId,
      })
      .from(userAccount)
      .where(eq(userAccount.id, userId))
      .limit(1);

    if (!user) {
      return [];
    }

    // Verify user belongs to tenant (if tenantId provided)
    if (tenantId && user.tenantId !== tenantId) {
      return [];
    }

    // If no tenant, user might be iCaptur admin - return empty for now
    if (!user.tenantId) {
      return [];
    }
    // Optimized: Single query with joins to fetch all required data at once
    // This reduces 4 sequential queries to 1 query
    type PermissionRow = {
      entitlementFeatureCode: string | null;
      userPermissionFeatureCode: string | null;
      userPermissionIsGranted: 'true' | 'false' | null;
    };

    const queryResult = await this.db.db
      .select({
        entitlementFeatureCode: productEntitlements.featureCode,
        userPermissionFeatureCode: userProductPermissions.featureCode,
        userPermissionIsGranted: userProductPermissions.isGranted,
      })
      .from(products)
      .innerJoin(
        tenantProductSubscriptions,
        and(
          eq(tenantProductSubscriptions.tenantId, user.tenantId),
          eq(tenantProductSubscriptions.productId, products.id),
          eq(tenantProductSubscriptions.status, 'active'),
        ),
      )
      .innerJoin(
        productEntitlements,
        and(
          eq(productEntitlements.subscriptionId, tenantProductSubscriptions.id),
          eq(productEntitlements.isGranted, 'true'),
        ),
      )
      .leftJoin(
        userProductPermissions,
        and(
          eq(userProductPermissions.userId, user.id),
          eq(userProductPermissions.productId, products.id),
          eq(
            userProductPermissions.featureCode,
            productEntitlements.featureCode,
          ),
        ),
      )
      .where(eq(products.code, productCode))
      .limit(1000); // Reasonable limit for entitlements

    const result: PermissionRow[] = queryResult.map((row) => ({
      entitlementFeatureCode:
        typeof row.entitlementFeatureCode === 'string'
          ? row.entitlementFeatureCode
          : null,
      userPermissionFeatureCode:
        typeof row.userPermissionFeatureCode === 'string'
          ? row.userPermissionFeatureCode
          : null,
      userPermissionIsGranted:
        typeof row.userPermissionIsGranted === 'string'
          ? (row.userPermissionIsGranted as 'true' | 'false')
          : null,
    }));

    if (result.length === 0) {
      return [];
    }

    const userRole = user.role;

    // If user is org_admin, grant all features
    if (userRole === USER_ROLES.ORG_ADMIN) {
      return [
        ...new Set(
          result
            .map((r) => r.entitlementFeatureCode)
            .filter((code): code is string => typeof code === 'string'),
        ),
      ];
    }

    // For org_user, filter based on user-specific permissions
    const userPermissionMap = new Map<string, boolean>();
    for (const row of result) {
      if (row.userPermissionFeatureCode && row.userPermissionIsGranted) {
        userPermissionMap.set(
          row.userPermissionFeatureCode,
          row.userPermissionIsGranted === 'true',
        );
      }
    }

    const permissions: string[] = [];
    const seenFeatures = new Set<string>();

    for (const row of result) {
      const featureCode = row.entitlementFeatureCode;
      if (!featureCode || seenFeatures.has(featureCode)) {
        continue;
      }
      seenFeatures.add(featureCode);

      const userPermission = userPermissionMap.get(featureCode);

      // If no user-specific permission, inherit from subscription (grant)
      if (userPermission === undefined || userPermission === true) {
        permissions.push(featureCode);
      }
    }

    return permissions;
  }
}
