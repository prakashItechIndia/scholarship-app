import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ScholarshipAuthService } from '../scholarship-auth/scholarship-auth.service';

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

