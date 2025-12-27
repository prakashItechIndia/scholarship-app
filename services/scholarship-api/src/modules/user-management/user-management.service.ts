import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ScholarshipAuthService } from '../scholarship-auth/scholarship-auth.service';
import { EmailService } from '../email/email.service';

interface UserData {
  userType: number;
  name: string;
  userName: string;
  password: string;
  mobileNumber: string;
  email: string;
  isActive: number;
}

@Injectable()
export class UserManagementService {
  private readonly logger = new Logger(UserManagementService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly authService: ScholarshipAuthService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Get all users - matches BingGrid from UserCreation.aspx.cs
   * Excludes users with "Student" role as they are for user flow, not admin flow
   * Supports sorting, pagination, and search
   */
  async getAllUsers(params?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
  }) {
    try {
      let query = `
        SELECT
          U.ID,
          U.User_ID,
          U.Password,
          R.Role_Name,
          U.User_Name,
          U.Mobile_Number,
          U.EMail_Id,
          U.Role_Id,
          U.IsActive,
          CASE U.IsActive
            WHEN '0' THEN 'InActive'
            WHEN '1' THEN 'Active'
            ELSE 'false'
          END as ActiveStatus
        FROM TBL_USERMASTER U
        LEFT OUTER JOIN T_ROLES R ON U.Role_Id = R.Id
        WHERE R.Is_Active = 1 
          AND U.IsDeleted = 0
          AND LOWER(R.Role_Name) != 'student'
      `;

      const queryParams: Record<string, unknown> = {};

      // Add search filter
      if (params?.search) {
        query += ` AND (
          LOWER(U.User_Name) LIKE LOWER(@search) OR
          LOWER(U.User_ID) LIKE LOWER(@search) OR
          LOWER(R.Role_Name) LIKE LOWER(@search) OR
          LOWER(U.Mobile_Number) LIKE LOWER(@search) OR
          LOWER(U.EMail_Id) LIKE LOWER(@search) OR
          LOWER(CASE U.IsActive WHEN '0' THEN 'InActive' WHEN '1' THEN 'Active' ELSE 'false' END) LIKE LOWER(@search)
        )`;
        queryParams.search = `%${params.search}%`;
      }

      // Add sorting
      const sortBy = params?.sortBy || 'User_Name';
      const sortOrder = params?.sortOrder || 'asc';
      const validSortFields: Record<string, string> = {
        name: 'U.User_Name',
        userRole: 'R.Role_Name',
        userType: 'R.Role_Name', // Using Role_Name as proxy for userType
        mobileNumber: 'U.Mobile_Number',
        emailId: 'U.EMail_Id',
        status: 'ActiveStatus',
      };
      const sortField = validSortFields[sortBy] || 'U.User_Name';
      query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;

      // Execute query
      const result = await this.db.query(query, queryParams);
      const allUsers = Array.from(result.recordset || []);
      const total = allUsers.length;

      // Apply pagination if requested
      let users = allUsers;
      if (params?.page && params?.pageSize) {
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        users = allUsers.slice(startIndex, endIndex);
      }

      // Return paginated response if pagination is requested, otherwise return array (backward compatible)
      if (params?.page && params?.pageSize) {
        return {
          data: users,
          total,
          page: params.page,
          pageSize: params.pageSize,
        };
      }

      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw new BadRequestException('Failed to fetch users');
    }
  }

  /**
   * Get user types/roles
   */
  async getUserTypes() {
    try {
      const query = `
        SELECT Id, Role_Name
        FROM T_ROLES
        WHERE Is_Active = 1
        ORDER BY Role_Name
      `;

      const result = await this.db.query(query);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching user types', error);
      throw new BadRequestException('Failed to fetch user types');
    }
  }

  /**
   * Check if user ID exists
   */
  async checkUserId(userId: string): Promise<boolean> {
    try {
      const query = `
        SELECT User_ID
        FROM TBL_USERMASTER
        WHERE User_ID = @userId
      `;

      const result = await this.db.query(query, { userId });

      return (result.recordset?.length || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking user ID', error);
      throw new BadRequestException('Failed to check user ID');
    }
  }

  /**
   * Create user - matches USP_SAVE_USER_Master stored procedure
   * USR-002: New user accounts shall receive temporary password via email
   */
  async createUser(userData: UserData) {
    try {
      // Check if user already exists
      const exists = await this.checkUserId(userData.userName);
      if (exists) {
        throw new BadRequestException('Username already exists');
      }

      // Encrypt password
      const encryptedPassword = this.authService.encryptPassword(
        userData.password,
      );

      // Call stored procedure
      await this.db.execute('USP_SAVE_USER_Master', {
        UserType: userData.userType,
        Name: userData.name,
        UserName: userData.userName,
        Password: encryptedPassword,
        MobileNumber: userData.mobileNumber,
        EMail: userData.email,
        IsActive: userData.isActive,
      });

      // USR-002: Send temporary password via email
      try {
        const emailSent = await this.sendTemporaryPasswordEmail(
          userData.email,
          userData.name,
          userData.password,
        );
        if (!emailSent) {
          this.logger.warn(
            `User created but failed to send temporary password email to ${userData.email}`,
          );
        }
      } catch (emailError) {
        // Log error but don't fail user creation
        this.logger.error(
          `Failed to send temporary password email to ${userData.email}`,
          emailError,
        );
      }

      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating user', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  /**
   * Send temporary password email to new user
   * USR-002: New user accounts shall receive temporary password via email
   */
  private async sendTemporaryPasswordEmail(
    email: string,
    name: string,
    temporaryPassword: string,
  ): Promise<boolean> {
    try {
      const firstName = name.split(' ')[0] || name;
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Account Credentials</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2453C3; margin-top: 0;">Welcome to Scholarship Management System</h2>
            <p>Dear ${firstName},</p>
            <p>Your account has been created successfully. Please use the following credentials to log in:</p>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; border-left: 4px solid #2453C3; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${temporaryPassword}</code></p>
            </div>
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            <p style="margin-top: 30px;">Best regards,<br>Scholarship Management Team</p>
          </div>
          <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
        </html>
      `;

      const text = `
Welcome to Scholarship Management System

Dear ${firstName},

Your account has been created successfully. Please use the following credentials to log in:

Email: ${email}
Temporary Password: ${temporaryPassword}

Important: Please change your password after your first login for security purposes.

Best regards,
Scholarship Management Team

This is an automated message. Please do not reply to this email.
      `;

      return await this.emailService.sendEmail({
        to: email,
        subject: 'Your Account Credentials - Scholarship Management System',
        html,
        text,
      });
    } catch (error) {
      this.logger.error('Error sending temporary password email', error);
      return false;
    }
  }

  /**
   * Update user - matches USP_Update_USER_Master stored procedure
   */
  async updateUser(userData: UserData) {
    try {
      // Encrypt password
      const encryptedPassword = this.authService.encryptPassword(
        userData.password,
      );

      // Call stored procedure
      await this.db.execute('USP_Update_USER_Master', {
        UserType: userData.userType,
        Name: userData.name,
        UserName: userData.userName,
        Password: encryptedPassword,
        MobileNumber: userData.mobileNumber,
        EMail: userData.email,
        IsActive: userData.isActive,
      });

      return { message: 'User updated successfully' };
    } catch (error) {
      this.logger.error('Error updating user', error);
      throw new BadRequestException('Failed to update user');
    }
  }

  /**
   * Delete user - matches USP_Deleted_USER_Master stored procedure
   */
  async deleteUser(userId: string) {
    try {
      await this.db.execute('USP_Deleted_USER_Master', {
        UserId: userId,
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting user', error);
      throw new BadRequestException('Failed to delete user');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    try {
      const query = `
        SELECT
          U.ID,
          U.User_ID,
          U.User_Name,
          U.Mobile_Number,
          U.EMail_Id,
          U.Role_Id,
          U.IsActive
        FROM TBL_USERMASTER U
        WHERE U.User_ID = @userId AND U.IsDeleted = 0
      `;

      const result = await this.db.query(query, { userId });

      if (!result.recordset || result.recordset.length === 0) {
        throw new BadRequestException('User not found');
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error fetching user', error);
      throw new BadRequestException('Failed to fetch user');
    }
  }

  /**
   * Export users to Excel or Word
   */
  async exportUsers(
    format: 'excel' | 'word',
    params?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    },
  ): Promise<Buffer> {
    try {
      // Get all users (no pagination for export)
      const users = await this.getAllUsers({
        ...params,
        page: undefined,
        pageSize: undefined,
      });

      const data = Array.isArray(users) ? users : users.data || [];

      if (format === 'excel') {
        return this.exportToExcel(data);
      } else {
        return this.exportToWord(data);
      }
    } catch (error) {
      this.logger.error('Error exporting users', error);
      throw new BadRequestException('Failed to export users');
    }
  }

  /**
   * Export users to Excel
   */
  private async exportToExcel(users: unknown[]): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    if (users.length === 0) {
      worksheet.addRow(['No data available']);
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    }

    // Headers
    const headers = ['Name', 'User Role', 'User Type', 'Mobile Number', 'Email Id', 'Status'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F6CBD' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Helper function to map role to user type
    const getUserTypeFromRole = (roleName: string): string => {
      const adminRoles = ['CEO', 'Super Admin', 'Supreme Admin', 'Document Super Admin'];
      const managerRoles = ['Scholarship Admin', 'Document Admin'];
      
      if (adminRoles.some(adminRole => roleName?.toLowerCase().includes(adminRole.toLowerCase()))) {
        return 'Administrator';
      }
      if (managerRoles.some(managerRole => roleName?.toLowerCase().includes(managerRole.toLowerCase()))) {
        return 'Manager';
      }
      return 'Standard User';
    };

    // Data rows
    users.forEach((user: any) => {
      worksheet.addRow([
        user.User_Name || user.User_ID || '',
        user.Role_Name || '',
        getUserTypeFromRole(user.Role_Name || ''),
        user.Mobile_Number || '',
        user.EMail_Id || user.User_ID || '',
        user.ActiveStatus || '',
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
   * Export users to Word
   */
  private async exportToWord(users: unknown[]): Promise<Buffer> {
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

    // Helper function to map role to user type
    const getUserTypeFromRole = (roleName: string): string => {
      const adminRoles = ['CEO', 'Super Admin', 'Supreme Admin', 'Document Super Admin'];
      const managerRoles = ['Scholarship Admin', 'Document Admin'];
      
      if (adminRoles.some(adminRole => roleName?.toLowerCase().includes(adminRole.toLowerCase()))) {
        return 'Administrator';
      }
      if (managerRoles.some(managerRole => roleName?.toLowerCase().includes(managerRole.toLowerCase()))) {
        return 'Manager';
      }
      return 'Standard User';
    };

    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        text: 'Users Export',
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
        text: `Total Records: ${users.length}`,
      }),
    );
    children.push(new Paragraph({ text: '' })); // Empty line

    if (users.length === 0) {
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
              text: 'Name',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'User Role',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'User Type',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'Mobile Number',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'Email Id',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'Status',
              children: [new TextRun({ bold: true })],
            }),
          ],
          width: { size: 16.67, type: WidthType.PERCENTAGE },
        }),
      ];
      tableRows.push(new TableRow({ children: headerCells }));

      // Data rows
      users.forEach((user: any) => {
        const cells = [
          new TableCell({
            children: [new Paragraph({ text: String(user.User_Name || user.User_ID || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(user.Role_Name || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: getUserTypeFromRole(user.Role_Name || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(user.Mobile_Number || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(user.EMail_Id || user.User_ID || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(user.ActiveStatus || '') })],
            width: { size: 16.67, type: WidthType.PERCENTAGE },
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
