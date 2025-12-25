import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { getCaseInsensitiveValue } from '../../utils/case-insensitive';

interface RoleData {
  roleName: string;
  userType: string; // Administrator / Manager / Users
  isActive: number; // 1 for Active, 0 for Inactive
  permissions?: unknown; // Permissions matrix (optional for now)
}

@Injectable()
export class RoleManagementService {
  private readonly logger = new Logger(RoleManagementService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all roles - matches T_ROLES table structure
   */
  async getAllRoles() {
    try {
      const query = `
        SELECT
          Id,
          Role_Name,
          Is_Active,
          CASE Is_Active
            WHEN 0 THEN 'Inactive'
            WHEN 1 THEN 'Active'
            ELSE 'Inactive'
          END as Status
        FROM T_ROLES
        ORDER BY Role_Name
      `;

      const result = await this.db.query(query);
      const roles = (result.recordset || []).map((row: Record<string, unknown>) => {
        const rowRecord = row as Record<string, unknown>;
        return {
          id: getCaseInsensitiveValue<string>(rowRecord, 'Id') || '',
          roleName: getCaseInsensitiveValue<string>(rowRecord, 'Role_Name') || '',
          userType: '', // User_Type column doesn't exist in T_ROLES table
          status: getCaseInsensitiveValue<string>(rowRecord, 'Status') || 'Inactive',
          isActive: getCaseInsensitiveValue<number>(rowRecord, 'Is_Active') || 0,
        };
      });

      return roles;
    } catch (error) {
      this.logger.error('Error fetching roles', error);
      throw new BadRequestException('Failed to fetch roles');
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: number) {
    try {
      const query = `
        SELECT
          Id,
          Role_Name,
          Is_Active
        FROM T_ROLES
        WHERE Id = @roleId
      `;

      const result = await this.db.query(query, { roleId });

      if (!result.recordset || result.recordset.length === 0) {
        throw new BadRequestException('Role not found');
      }

      const row = result.recordset[0] as Record<string, unknown>;
      return {
        id: getCaseInsensitiveValue<string>(row, 'Id') || '',
        roleName: getCaseInsensitiveValue<string>(row, 'Role_Name') || '',
        userType: '', // User_Type column doesn't exist in T_ROLES table
        isActive: getCaseInsensitiveValue<number>(row, 'Is_Active') || 0,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error fetching role', error);
      throw new BadRequestException('Failed to fetch role');
    }
  }

  /**
   * Check if role name exists (for uniqueness validation)
   */
  async checkRoleName(roleName: string, excludeId?: number): Promise<boolean> {
    try {
      let query = `
        SELECT COUNT(*) as count
        FROM T_ROLES
        WHERE LOWER(Role_Name) = LOWER(@roleName)
      `;
      const params: { roleName: string; excludeId?: number } = { roleName };

      if (excludeId !== undefined) {
        query += ' AND Id != @excludeId';
        params.excludeId = excludeId;
      }

      const result = await this.db.query<{ count: number }>(query, params);
      return (result.recordset?.[0]?.count || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking role name', error);
      throw new BadRequestException('Failed to check role name');
    }
  }

  /**
   * Check if role has assigned users (prevent deletion)
   */
  async checkRoleHasUsers(roleId: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM TBL_USERMASTER
        WHERE Role_Id = @roleId
        AND IsDeleted = 0
      `;

      const result = await this.db.query<{ count: number }>(query, { roleId });
      return (result.recordset?.[0]?.count || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking role users', error);
      throw new BadRequestException('Failed to check role users');
    }
  }

  /**
   * Create role - inserts into T_ROLES table
   */
  async createRole(roleData: RoleData) {
    try {
      // ROL-001: Role name shall be unique across the system
      const exists = await this.checkRoleName(roleData.roleName);
      if (exists) {
        throw new BadRequestException('Role name must be unique. This role name already exists.');
      }

      // Insert role
      // Note: User_Type column doesn't exist in T_ROLES table, so it's not included in the INSERT
      const query = `
        INSERT INTO T_ROLES (Role_Name, Is_Active, Created_Date, Created_By)
        VALUES (@roleName, @isActive, GETDATE(), 'System')
      `;

      await this.db.query(query, {
        roleName: roleData.roleName,
        isActive: roleData.isActive,
      });

      return { message: 'Role created successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating role', error);
      throw new BadRequestException('Failed to create role');
    }
  }

  /**
   * Update role - updates T_ROLES table
   */
  async updateRole(roleId: number, roleData: RoleData) {
    try {
      // Check if role exists
      await this.getRoleById(roleId);

      // ROL-001: Role name shall be unique across the system
      const exists = await this.checkRoleName(roleData.roleName, roleId);
      if (exists) {
        throw new BadRequestException('Role name must be unique. This role name already exists.');
      }

      // Update role
      // Note: User_Type column doesn't exist in T_ROLES table, so it's not included in the UPDATE
      const query = `
        UPDATE T_ROLES
        SET
          Role_Name = @roleName,
          Is_Active = @isActive,
          Modified_Date = GETDATE(),
          Modified_By = 'System'
        WHERE Id = @roleId
      `;

      await this.db.query(query, {
        roleId,
        roleName: roleData.roleName,
        isActive: roleData.isActive,
      });

      return { message: 'Role updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error updating role', error);
      throw new BadRequestException('Failed to update role');
    }
  }

  /**
   * Delete role - soft delete or hard delete based on requirements
   * ROL-004: Role deletion shall be prevented if users are currently assigned
   */
  async deleteRole(roleId: number) {
    try {
      // Check if role exists
      await this.getRoleById(roleId);

      // ROL-004: Check if role has assigned users
      const hasUsers = await this.checkRoleHasUsers(roleId);
      if (hasUsers) {
        throw new BadRequestException('Cannot delete role. Users are currently assigned to this role.');
      }

      // Delete role (hard delete or set Is_Active = 0 based on requirements)
      // For now, setting Is_Active = 0 (soft delete)
      const query = `
        UPDATE T_ROLES
        SET
          Is_Active = 0,
          Modified_Date = GETDATE(),
          Modified_By = 'System'
        WHERE Id = @roleId
      `;

      await this.db.query(query, { roleId });

      return { message: 'Role deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error deleting role', error);
      throw new BadRequestException('Failed to delete role');
    }
  }
}

