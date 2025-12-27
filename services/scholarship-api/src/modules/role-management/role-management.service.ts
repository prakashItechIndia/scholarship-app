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
   * Excludes "Student" role as it's for user flow, not admin flow
   * Supports sorting, pagination, and search
   */
  async getAllRoles(params?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
  }) {
    try {
      let query = `
        SELECT
          Id,
          Role_Name,
          User_Type,
          Is_Active,
          CASE Is_Active
            WHEN 0 THEN 'Inactive'
            WHEN 1 THEN 'Active'
            ELSE 'Inactive'
          END as Status
        FROM T_ROLES
        WHERE LOWER(Role_Name) != 'student'
      `;

      const queryParams: Record<string, unknown> = {};

      // Add search filter
      if (params?.search) {
        query += ` AND (
          LOWER(Role_Name) LIKE LOWER(@search) OR
          LOWER(User_Type) LIKE LOWER(@search) OR
          LOWER(CASE Is_Active WHEN 0 THEN 'Inactive' WHEN 1 THEN 'Active' ELSE 'Inactive' END) LIKE LOWER(@search)
        )`;
        queryParams.search = `%${params.search}%`;
      }

      // Add sorting
      const sortBy = params?.sortBy || 'Role_Name';
      const sortOrder = params?.sortOrder || 'asc';
      const validSortFields: Record<string, string> = {
        roleName: 'Role_Name',
        roleType: 'User_Type',
        status: 'Status',
      };
      const sortField = validSortFields[sortBy] || 'Role_Name';
      query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;

      // Execute query
      const result = await this.db.query(query, queryParams);
      let roles = (result.recordset || []).map((row: Record<string, unknown>) => {
        const rowRecord = row as Record<string, unknown>;
        return {
          id: getCaseInsensitiveValue<string>(rowRecord, 'Id') || '',
          roleName: getCaseInsensitiveValue<string>(rowRecord, 'Role_Name') || '',
          userType: getCaseInsensitiveValue<string>(rowRecord, 'User_Type') || '',
          status: getCaseInsensitiveValue<string>(rowRecord, 'Status') || 'Inactive',
          isActive: getCaseInsensitiveValue<number>(rowRecord, 'Is_Active') || 0,
        };
      });

      const total = roles.length;

      // Apply pagination if requested
      if (params?.page && params?.pageSize) {
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        roles = roles.slice(startIndex, endIndex);
      }

      // Return paginated response if pagination is requested, otherwise return array (backward compatible)
      if (params?.page && params?.pageSize) {
        return {
          data: roles,
          total,
          page: params.page,
          pageSize: params.pageSize,
        };
      }

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
          User_Type,
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
        userType: getCaseInsensitiveValue<string>(row, 'User_Type') || '',
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

      // Insert role with User_Type
      const query = `
        INSERT INTO T_ROLES (Role_Name, User_Type, Is_Active)
        VALUES (@roleName, @userType, @isActive)
      `;

      await this.db.query(query, {
        roleName: roleData.roleName,
        userType: roleData.userType || null,
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

      // Update role with User_Type
      const query = `
        UPDATE T_ROLES
        SET
          Role_Name = @roleName,
          User_Type = @userType,
          Is_Active = @isActive
        WHERE Id = @roleId
      `;

      await this.db.query(query, {
        roleId,
        roleName: roleData.roleName,
        userType: roleData.userType || null,
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

  /**
   * Export roles to Excel or Word
   */
  async exportRoles(
    format: 'excel' | 'word',
    params?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    },
  ): Promise<Buffer> {
    try {
      // Get all roles (no pagination for export)
      const roles = await this.getAllRoles({
        ...params,
        page: undefined,
        pageSize: undefined,
      });

      const data = Array.isArray(roles) ? roles : roles.data || [];

      if (format === 'excel') {
        return this.exportToExcel(data);
      } else {
        return this.exportToWord(data);
      }
    } catch (error) {
      this.logger.error('Error exporting roles', error);
      throw new BadRequestException('Failed to export roles');
    }
  }

  /**
   * Export roles to Excel
   */
  private async exportToExcel(roles: unknown[]): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Roles');

    if (roles.length === 0) {
      worksheet.addRow(['No data available']);
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    }

    // Headers
    const headers = ['Role Name', 'User Type', 'Status'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F6CBD' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Data rows
    roles.forEach((role: any) => {
      worksheet.addRow([
        role.roleName || '',
        role.userType || '',
        role.status || '',
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      if (column.header) {
        column.width = 20;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Export roles to Word
   */
  private async exportToWord(roles: unknown[]): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const {
      Document,
      Packer,
      Paragraph,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      TextRun,
    } = require('docx');

    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        text: 'Roles Export',
        heading: 'Heading1',
        alignment: AlignmentType.CENTER,
      }),
    );

    // Metadata
    children.push(
      new Paragraph({
        text: `Generated on: ${new Date().toLocaleString()}`,
      }),
    );
    children.push(
      new Paragraph({
        text: `Total Records: ${roles.length}`,
      }),
    );
    children.push(new Paragraph({ text: '' })); // Empty line

    if (roles.length === 0) {
      children.push(
        new Paragraph({
          text: 'No data available',
          alignment: AlignmentType.CENTER,
        }),
      );
    } else {
      // Create table
      const tableRows: any[] = [];

      // Header row
      const headerCells = [
        new TableCell({
          children: [
            new Paragraph({
              text: 'Role Name',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 33.33, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'User Type',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 33.33, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'Status',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 33.33, type: WidthType.PERCENTAGE },
        }),
      ];
      tableRows.push(new TableRow({ children: headerCells }));

      // Data rows
      roles.forEach((role: any) => {
        const cells = [
          new TableCell({
            children: [new Paragraph({ text: String(role.roleName || '') })],
            width: { size: 33.33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(role.userType || '') })],
            width: { size: 33.33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(role.status || '') })],
            width: { size: 33.33, type: WidthType.PERCENTAGE },
          }),
        ];
        tableRows.push(new TableRow({ children: cells }));
      });

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      );
    }

    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}

