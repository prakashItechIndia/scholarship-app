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
   */
  async getAllUsers() {
    try {
      const query = `
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
        WHERE R.Is_Active = 1 AND U.IsDeleted = 0
      `;

      const result = await this.db.query(query);

      return result.recordset || [];
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
}
