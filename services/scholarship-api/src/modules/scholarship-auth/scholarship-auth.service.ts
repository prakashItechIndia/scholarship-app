import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface LoginDto {
  username: string;
  password: string;
}

interface User {
  id: number;
  userId: string;
  userName: string;
  roleId: number;
  password: string;
  passwordChange: boolean;
  userType: string;
  isActive: boolean;
}

@Injectable()
export class ScholarshipAuthService {
  private readonly logger = new Logger(ScholarshipAuthService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Validate user login - matches ASP.NET ValidateUser stored procedure
   */
  async validateUserLogin(username: string, password: string): Promise<User> {
    try {
      // Call the stored procedure ValidateUser
      // Note: IsActive might be returned as bit (0/1) or boolean, so use unknown type
      const result = await this.db.execute<{
        ID: number;
        User_ID: string;
        User_Name: string;
        Role_Id: number;
        Password: string;
        Password_Change: boolean | number;
        User_Type: string;
        IsActive: boolean | number | string;
      }>('ValidateUser', {
        USER_ID: username,
        PASSWORD: password, // Note: ASP.NET encrypts password before calling stored procedure
      });

      if (!result.recordset || result.recordset.length === 0) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const userRecord = result.recordset[0];

      // Log the full record for debugging
      this.logger.debug(`ValidateUser returned: ${JSON.stringify(userRecord)}`);

      // Check if account is active
      // IsActive might be returned as bit (0/1), boolean, or string, so check all formats
      const isActiveValue: unknown = userRecord.IsActive;
      const isActive =
        isActiveValue === true ||
        isActiveValue === 1 ||
        String(isActiveValue) === '1' ||
        String(isActiveValue).toLowerCase() === 'true';

      if (!isActive) {
        this.logger.warn(
          `Login attempt for inactive account: ${username}, IsActive value: ${String(isActiveValue)} (type: ${typeof isActiveValue}), Full record: ${JSON.stringify(userRecord)}`,
        );

        // If IsActive is false/0, try to activate the user (in case it wasn't set correctly)
        // This handles the case where password was set but IsActive wasn't updated
        try {
          const activateQuery = `
            UPDATE Tbl_UserMaster
            SET IsActive = 1, IsDeleted = 0
            WHERE User_ID = @username
            AND (IsActive = 0 OR IsActive IS NULL)
          `;
          await this.db.query(activateQuery, { username });
          this.logger.log(`Activated user account: ${username}`);

          // Retry the stored procedure call after activation
          const retryResult = await this.db.execute<{
            ID: number;
            User_ID: string;
            User_Name: string;
            Role_Id: number;
            Password: string;
            Password_Change: boolean;
            User_Type: string;
            IsActive: boolean;
          }>('ValidateUser', {
            USER_ID: username,
            PASSWORD: password,
          });

          if (retryResult.recordset && retryResult.recordset.length > 0) {
            const retryUser = retryResult.recordset[0];
            const retryIsActiveValue: unknown = retryUser.IsActive;
            const retryIsActive =
              retryIsActiveValue === true ||
              retryIsActiveValue === 1 ||
              String(retryIsActiveValue) === '1' ||
              String(retryIsActiveValue).toLowerCase() === 'true';

            if (retryIsActive) {
              // User is now active, proceed with login
              return {
                id: retryUser.ID,
                userId: retryUser.User_ID,
                userName: retryUser.User_Name,
                roleId: retryUser.Role_Id,
                password: retryUser.Password,
                passwordChange: retryUser.Password_Change,
                userType: retryUser.User_Type,
                isActive: retryUser.IsActive,
              };
            }
          }
        } catch (activateError) {
          this.logger.error(
            `Failed to activate user account: ${username}`,
            activateError,
          );
        }

        throw new UnauthorizedException('Account is not active');
      }

      // Convert types to match User interface
      const passwordChangeValue = userRecord.Password_Change;
      return {
        id: userRecord.ID,
        userId: userRecord.User_ID,
        userName: userRecord.User_Name,
        roleId: userRecord.Role_Id,
        password: String(userRecord.Password),
        passwordChange:
          passwordChangeValue === true ||
          passwordChangeValue === 1 ||
          String(passwordChangeValue).toLowerCase() === 'true',
        userType: String(userRecord.User_Type),
        isActive: isActive,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Error validating user login', error);
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  /**
   * Encrypt password - matches ASP.NET Encryptdata method (Base64 encoding)
   */
  encryptPassword(password: string): string {
    return Buffer.from(password, 'utf-8').toString('base64');
  }

  /**
   * Decrypt password - matches ASP.NET Decryptdata method
   */
  decryptPassword(encryptedPassword: string): string {
    return Buffer.from(encryptedPassword, 'base64').toString('utf-8');
  }

  /**
   * Login - validates user and returns session info
   */
  async login(loginDto: LoginDto) {
    // Encrypt password as ASP.NET does
    const encryptedPassword = this.encryptPassword(loginDto.password);

    // Validate user
    const user = await this.validateUserLogin(
      loginDto.username,
      encryptedPassword,
    );

    // Return user info (without password)
    return {
      userId: user.id,
      userName: user.userName,
      roleId: user.roleId,
      userType: user.userType,
      passwordChange: user.passwordChange,
    };
  }

  /**
   * Get user details by user ID
   */
  async getUserDetails(userId: string) {
    const query = `
      SELECT 
        ID, User_ID, Password, Password_Change, User_Type, IsActive
      FROM Tbl_UserMaster
      WHERE User_ID = @userId
    `;

    const result = await this.db.query<{
      ID: number;
      User_ID: string;
      Password: string;
      Password_Change: boolean;
      User_Type: string;
      IsActive: boolean;
    }>(query, { userId });

    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  }

  /**
   * Change password
   */
  async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    modifiedBy: string,
  ) {
    // Get current user details
    const userDetails = await this.getUserDetails(username);
    if (!userDetails) {
      throw new UnauthorizedException('User not found');
    }

    // Encrypt current password to compare
    const encryptedCurrentPassword = this.encryptPassword(currentPassword);

    // Verify current password
    if (userDetails.Password !== encryptedCurrentPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Encrypt new password
    const encryptedNewPassword = this.encryptPassword(newPassword);

    // Update password
    const updateQuery = `
      UPDATE Tbl_UserMaster
      SET 
        Password = @newPassword,
        Password_change = 'False',
        Modified_Date = GETDATE(),
        Modified_By = @modifiedBy
      WHERE User_ID = @username
    `;

    await this.db.query(updateQuery, {
      newPassword: encryptedNewPassword,
      modifiedBy,
      username,
    });

    return { message: 'Password changed successfully' };
  }
}
