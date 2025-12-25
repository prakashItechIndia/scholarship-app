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

/**
 * Helper function to get a value from a database record case-insensitively
 * SQL Server can return column names in different cases (ISACTIVE, IsActive, etc.)
 */
function getCaseInsensitiveValue<T = unknown>(
  record: Record<string, unknown>,
  fieldName: string,
): T | undefined {
  // Try exact match first
  if (fieldName in record) {
    return record[fieldName] as T;
  }

  // Try case-insensitive match
  const lowerFieldName = fieldName.toLowerCase();
  for (const key in record) {
    if (key.toLowerCase() === lowerFieldName) {
      return record[key] as T;
    }
  }

  return undefined;
}

/**
 * Helper function to convert a value to boolean, handling various formats
 * (true, 1, '1', 'true', etc.)
 */
function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    String(value) === '1' ||
    String(value).toLowerCase() === 'true'
  );
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
      // Handle case-insensitive field access (ISACTIVE vs IsActive)
      const isActiveValue: unknown = getCaseInsensitiveValue(userRecord, 'IsActive');
      const isActive = toBoolean(isActiveValue);

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
            // Handle case-insensitive field access (ISACTIVE vs IsActive)
            const retryIsActiveValue: unknown = getCaseInsensitiveValue(retryUser, 'IsActive');
            const retryIsActive = toBoolean(retryIsActiveValue);

            if (retryIsActive) {
              // User is now active, proceed with login
              return {
                id: getCaseInsensitiveValue<number>(retryUser, 'ID') ?? 0,
                userId: getCaseInsensitiveValue<string>(retryUser, 'User_ID') ?? '',
                userName: getCaseInsensitiveValue<string>(retryUser, 'User_Name') ?? '',
                roleId: getCaseInsensitiveValue<number>(retryUser, 'Role_Id') ?? 0,
                password: String(getCaseInsensitiveValue(retryUser, 'Password') ?? ''),
                passwordChange: toBoolean(getCaseInsensitiveValue(retryUser, 'Password_Change')),
                userType: String(getCaseInsensitiveValue(retryUser, 'User_Type') ?? ''),
                isActive: retryIsActive,
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
      // Handle case-insensitive field access for all fields
      const passwordChangeValue = getCaseInsensitiveValue(userRecord, 'Password_Change');
      return {
        id: getCaseInsensitiveValue<number>(userRecord, 'ID') ?? 0,
        userId: getCaseInsensitiveValue<string>(userRecord, 'User_ID') ?? '',
        userName: getCaseInsensitiveValue<string>(userRecord, 'User_Name') ?? '',
        roleId: getCaseInsensitiveValue<number>(userRecord, 'Role_Id') ?? 0,
        password: String(getCaseInsensitiveValue(userRecord, 'Password') ?? ''),
        passwordChange: toBoolean(passwordChangeValue),
        userType: String(getCaseInsensitiveValue(userRecord, 'User_Type') ?? ''),
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
   * For admin login - only allows admin users (not Student role users)
   */
  async login(loginDto: LoginDto) {
    // Encrypt password as ASP.NET does
    const encryptedPassword = this.encryptPassword(loginDto.password);

    // Validate user
    const user = await this.validateUserLogin(
      loginDto.username,
      encryptedPassword,
    );

    // Check if user is a Student role user - reject admin login for Student users
    // Student users should use the user login flow, not admin login
    try {
      const studentRoleQuery = `
        SELECT Id
        FROM T_ROLES
        WHERE Role_Name = 'Student' AND Is_Active = 1
      `;
      const studentRoleResult = await this.db.query<{ Id: number }>(studentRoleQuery);
      
      if (studentRoleResult.recordset && studentRoleResult.recordset.length > 0) {
        const studentRoleId = studentRoleResult.recordset[0].Id;
        
        // If user has Student role, reject admin login
        if (user.roleId === studentRoleId) {
          throw new UnauthorizedException('Student users cannot access admin portal. Please use the user login.');
        }
      }
    } catch (error) {
      // If error is UnauthorizedException, re-throw it
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // If Student role doesn't exist or query fails, continue (backward compatibility)
      this.logger.warn('Could not verify Student role, allowing login to proceed', error);
    }

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

    const record = result.recordset[0];
    // Return with case-insensitive field access
    return {
      ID: getCaseInsensitiveValue<number>(record, 'ID') ?? 0,
      User_ID: getCaseInsensitiveValue<string>(record, 'User_ID') ?? '',
      Password: getCaseInsensitiveValue<string>(record, 'Password') ?? '',
      Password_Change: toBoolean(getCaseInsensitiveValue(record, 'Password_Change')),
      User_Type: getCaseInsensitiveValue<string>(record, 'User_Type') ?? '',
      IsActive: toBoolean(getCaseInsensitiveValue(record, 'IsActive')),
    };
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

    // Use stored procedure USP_ChangePassword (following old app pattern)
    try {
      await this.db.execute('USP_ChangePassword', {
        ConfirmPassword: encryptedNewPassword,
        UserId: username,
      });
    } catch (error) {
      // Fallback to direct SQL if stored procedure doesn't exist
      this.logger.warn(
        'USP_ChangePassword stored procedure not found, using direct SQL update',
      );
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
    }

    return { message: 'Password changed successfully' };
  }
}
