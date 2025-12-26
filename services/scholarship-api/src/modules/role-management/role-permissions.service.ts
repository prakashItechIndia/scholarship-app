import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { getCaseInsensitiveValue } from '../../utils/case-insensitive';

export interface Screen {
  id: number;
  screenName: string;
  url: string;
  moduleName?: string;
  isActive: boolean;
}

export interface RolePermission {
  roleId: number;
  screenId: number;
  screenName: string;
  url: string;
  isActive: boolean;
  canCreate: boolean;
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface ScreenPermission {
  id: number;
  screenName: string;
  url: string;
  isActive: boolean;
  canCreate: boolean;
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface UserPermission {
  userId: number;
  roleId: number;
  roleName: string;
  screens: ScreenPermission[];
}

@Injectable()
export class RolePermissionsService {
  private readonly logger = new Logger(RolePermissionsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all available screens
   */
  async getAllScreens(): Promise<Screen[]> {
    try {
      const query = `
        SELECT
          Id,
          Screen_Name,
          URL,
          Module_Name,
          Is_Active
        FROM T_SCREENS
        WHERE Is_Active = 1 AND (Is_Deleted = 0 OR Is_Deleted IS NULL)
        ORDER BY Screen_Name
      `;

      const result = await this.db.query(query);
      return (result.recordset || []).map((row: Record<string, unknown>) => {
        const rowRecord = row as Record<string, unknown>;
        const isActiveValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Is_Active',
        );
        const isActive =
          isActiveValue === true ||
          isActiveValue === 1 ||
          String(isActiveValue) === '1';

        return {
          id: Number(getCaseInsensitiveValue<number>(rowRecord, 'Id') || 0),
          screenName:
            getCaseInsensitiveValue<string>(rowRecord, 'Screen_Name') || '',
          url: getCaseInsensitiveValue<string>(rowRecord, 'URL') || '',
          moduleName:
            getCaseInsensitiveValue<string>(rowRecord, 'Module_Name') || '',
          isActive,
        };
      });
    } catch (error) {
      this.logger.error('Error fetching screens', error);
      throw new BadRequestException('Failed to fetch screens');
    }
  }

  /**
   * Get permissions for a specific role (with action-level permissions)
   */
  async getRolePermissions(roleId: number): Promise<RolePermission[]> {
    try {
      const query = `
        SELECT
          RP.Id as Permission_Id,
          RP.Roles_Id,
          RP.Screens_Id,
          RP.Is_Active,
          RP.Can_Create,
          RP.Can_View,
          RP.Can_Update,
          RP.Can_Delete,
          S.Screen_Name,
          S.URL,
          S.Module_Name
        FROM T_ROLES_PRIVILEGE RP
        INNER JOIN T_SCREENS S ON RP.Screens_Id = S.Id
        WHERE RP.Roles_Id = @roleId
          AND RP.Is_Active = 1
          AND S.Is_Active = 1
          AND (S.Is_Deleted = 0 OR S.Is_Deleted IS NULL)
        ORDER BY S.Screen_Name
      `;

      const result = await this.db.query(query, { roleId });
      return (result.recordset || []).map((row: Record<string, unknown>) => {
        const rowRecord = row as Record<string, unknown>;
        const isActiveValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Is_Active',
        );
        const isActive =
          isActiveValue === true ||
          isActiveValue === 1 ||
          String(isActiveValue) === '1';

        const canCreateValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Can_Create',
        );
        const canCreate =
          canCreateValue === true ||
          canCreateValue === 1 ||
          String(canCreateValue) === '1';

        const canViewValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Can_View',
        );
        const canView =
          canViewValue === true ||
          canViewValue === 1 ||
          String(canViewValue) === '1';

        const canUpdateValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Can_Update',
        );
        const canUpdate =
          canUpdateValue === true ||
          canUpdateValue === 1 ||
          String(canUpdateValue) === '1';

        const canDeleteValue = getCaseInsensitiveValue<boolean | number | string>(
          rowRecord,
          'Can_Delete',
        );
        const canDelete =
          canDeleteValue === true ||
          canDeleteValue === 1 ||
          String(canDeleteValue) === '1';

        return {
          roleId: Number(
            getCaseInsensitiveValue<number>(rowRecord, 'Roles_Id') || 0,
          ),
          screenId: Number(
            getCaseInsensitiveValue<number>(rowRecord, 'Screens_Id') || 0,
          ),
          screenName:
            getCaseInsensitiveValue<string>(rowRecord, 'Screen_Name') || '',
          url: getCaseInsensitiveValue<string>(rowRecord, 'URL') || '',
          isActive,
          canCreate,
          canView,
          canUpdate,
          canDelete,
        };
      });
    } catch (error) {
      this.logger.error('Error fetching role permissions', error);
      throw new BadRequestException('Failed to fetch role permissions');
    }
  }

  /**
   * Get permissions for a specific user based on their assigned role
   */
  async getUserPermissions(userId: number): Promise<UserPermission | null> {
    try {
      // First, get user's role assignment
      const userRoleQuery = `
        SELECT
          URA.Roles_Id,
          R.Role_Name
        FROM T_USER_ROLES_ASSIGN URA
        INNER JOIN T_ROLES R ON URA.Roles_Id = R.Id
        WHERE URA.User_Id = @userId
          AND URA.Is_Active = 1
          AND R.Is_Active = 1
      `;

      const userRoleResult = await this.db.query(userRoleQuery, { userId });

      if (
        !userRoleResult.recordset ||
        userRoleResult.recordset.length === 0
      ) {
        return null;
      }

      const userRole = userRoleResult.recordset[0] as Record<string, unknown>;
      const roleId = Number(
        getCaseInsensitiveValue<number>(userRole, 'Roles_Id') || 0,
      );
      const roleName =
        getCaseInsensitiveValue<string>(userRole, 'Role_Name') || '';

      // Get screens for this role with action-level permissions
      const screens = await this.getRolePermissions(roleId);

      return {
        userId,
        roleId,
        roleName,
        screens: screens.map((perm) => ({
          id: perm.screenId,
          screenName: perm.screenName,
          url: perm.url,
          isActive: perm.isActive,
          canCreate: perm.canCreate,
          canView: perm.canView,
          canUpdate: perm.canUpdate,
          canDelete: perm.canDelete,
        })),
      };
    } catch (error) {
      this.logger.error('Error fetching user permissions', error);
      throw new BadRequestException('Failed to fetch user permissions');
    }
  }

  /**
   * Check if user has permission to access a specific screen
   */
  async hasScreenPermission(
    userId: number,
    screenUrl: string,
  ): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM T_USER_ROLES_ASSIGN URA
        INNER JOIN T_ROLES_PRIVILEGE RP ON URA.Roles_Id = RP.Roles_Id
        INNER JOIN T_SCREENS S ON RP.Screens_Id = S.Id
        WHERE URA.User_Id = @userId
          AND S.URL = @screenUrl
          AND URA.Is_Active = 1
          AND RP.Is_Active = 1
          AND S.Is_Active = 1
          AND (S.Is_Deleted = 0 OR S.Is_Deleted IS NULL)
      `;

      const result = await this.db.query<{ count: number }>(query, {
        userId,
        screenUrl,
      });

      return (result.recordset?.[0]?.count || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking screen permission', error);
      return false;
    }
  }

  /**
   * Update permissions for a role with action-level permissions
   */
  async updateRolePermissions(
    roleId: number,
    permissions: Array<{
      screenId: number;
      canCreate: boolean;
      canView: boolean;
      canUpdate: boolean;
      canDelete: boolean;
    }>,
  ): Promise<void> {
    try {
      // First, delete all existing permissions for this role
      const deleteQuery = `
        DELETE FROM T_ROLES_PRIVILEGE
        WHERE Roles_Id = @roleId
      `;
      await this.db.query(deleteQuery, { roleId });

      // Then, insert new permissions with action flags
      if (permissions.length > 0) {
        for (const perm of permissions) {
          // Ensure at least one action is enabled (BRD requirement)
          if (
            !perm.canCreate &&
            !perm.canView &&
            !perm.canUpdate &&
            !perm.canDelete
          ) {
            this.logger.warn(
              `Skipping permission for screen ${perm.screenId} - at least one action must be enabled`,
            );
            continue;
          }

          const insertQuery = `
            INSERT INTO T_ROLES_PRIVILEGE (
              Roles_Id,
              Screens_Id,
              Can_Create,
              Can_View,
              Can_Update,
              Can_Delete,
              Is_Active
            )
            VALUES (
              @roleId,
              @screenId,
              @canCreate,
              @canView,
              @canUpdate,
              @canDelete,
              1
            )
          `;
          await this.db.query(insertQuery, {
            roleId,
            screenId: perm.screenId,
            canCreate: perm.canCreate ? 1 : 0,
            canView: perm.canView ? 1 : 0,
            canUpdate: perm.canUpdate ? 1 : 0,
            canDelete: perm.canDelete ? 1 : 0,
          });
        }
      }
    } catch (error) {
      this.logger.error('Error updating role permissions', error);
      throw new BadRequestException('Failed to update role permissions');
    }
  }

  /**
   * Check if user has permission for a specific action on a screen
   */
  async hasActionPermission(
    userId: number,
    screenUrl: string,
    action: 'create' | 'view' | 'update' | 'delete',
  ): Promise<boolean> {
    try {
      // Use CASE statement to check the appropriate action column (safe - no string interpolation)
      const query = `
        SELECT COUNT(*) as count
        FROM T_USER_ROLES_ASSIGN URA
        INNER JOIN T_ROLES_PRIVILEGE RP ON URA.Roles_Id = RP.Roles_Id
        INNER JOIN T_SCREENS S ON RP.Screens_Id = S.Id
        WHERE URA.User_Id = @userId
          AND S.URL = @screenUrl
          AND (
            (@action = 'create' AND RP.Can_Create = 1) OR
            (@action = 'view' AND RP.Can_View = 1) OR
            (@action = 'update' AND RP.Can_Update = 1) OR
            (@action = 'delete' AND RP.Can_Delete = 1)
          )
          AND URA.Is_Active = 1
          AND RP.Is_Active = 1
          AND S.Is_Active = 1
          AND (S.Is_Deleted = 0 OR S.Is_Deleted IS NULL)
      `;

      const result = await this.db.query<{ count: number }>(query, {
        userId,
        screenUrl,
        action,
      });

      return (result.recordset?.[0]?.count || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking action permission', error);
      return false;
    }
  }

  /**
   * Get role with its permissions
   */
  async getRoleWithPermissions(roleId: number) {
    try {
      const roleQuery = `
        SELECT
          Id,
          Role_Name,
          User_Type,
          Is_Active
        FROM T_ROLES
        WHERE Id = @roleId
      `;

      const roleResult = await this.db.query(roleQuery, { roleId });

      if (!roleResult.recordset || roleResult.recordset.length === 0) {
        throw new BadRequestException('Role not found');
      }

      const role = roleResult.recordset[0] as Record<string, unknown>;
      const permissions = await this.getRolePermissions(roleId);

      return {
        id: Number(getCaseInsensitiveValue<number>(role, 'Id') || 0),
        roleName: getCaseInsensitiveValue<string>(role, 'Role_Name') || '',
        userType: getCaseInsensitiveValue<string>(role, 'User_Type') || '',
        isActive:
          Number(getCaseInsensitiveValue<number>(role, 'Is_Active') || 0) === 1,
        permissions,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error fetching role with permissions', error);
      throw new BadRequestException('Failed to fetch role with permissions');
    }
  }
}

