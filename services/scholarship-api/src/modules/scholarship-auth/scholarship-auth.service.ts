import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EnvVars } from '../../config/env.validation';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

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

  constructor(
    private readonly db: DatabaseService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly emailService: EmailService,
  ) {}

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

    // Fetch User_Type from T_ROLES table if not provided by stored procedure
    let userType = user.userType;
    if (!userType || userType === '') {
      try {
        const roleQuery = `
          SELECT User_Type
          FROM T_ROLES
          WHERE Id = @roleId
        `;
        const roleResult = await this.db.query<{ User_Type: string }>(roleQuery, {
          roleId: user.roleId,
        });
        if (roleResult.recordset && roleResult.recordset.length > 0) {
          userType = getCaseInsensitiveValue<string>(roleResult.recordset[0], 'User_Type') || '';
        }
      } catch (error) {
        this.logger.warn('Failed to fetch User_Type from T_ROLES', error);
      }
    }

    // Return user info (without password)
    return {
      userId: user.id,
      userName: user.userName,
      roleId: user.roleId,
      userType: userType,
      passwordChange: user.passwordChange,
    };
  }

  /**
   * User login - validates user and returns session info
   * For user login - allows all users including Student role users
   */
  async userLogin(loginDto: LoginDto) {
    // Encrypt password as ASP.NET does
    const encryptedPassword = this.encryptPassword(loginDto.password);

    // Validate user
    const user = await this.validateUserLogin(
      loginDto.username,
      encryptedPassword,
    );

    // Note: Unlike admin login, user login allows Student users
    // No Student role check here - all users can use this endpoint

    // Fetch User_Type from T_ROLES table if not provided by stored procedure
    let userType = user.userType;
    if (!userType || userType === '') {
      try {
        const roleQuery = `
          SELECT User_Type
          FROM T_ROLES
          WHERE Id = @roleId
        `;
        const roleResult = await this.db.query<{ User_Type: string }>(roleQuery, {
          roleId: user.roleId,
        });
        if (roleResult.recordset && roleResult.recordset.length > 0) {
          userType = getCaseInsensitiveValue<string>(roleResult.recordset[0], 'User_Type') || '';
        }
      } catch (error) {
        this.logger.warn('Failed to fetch User_Type from T_ROLES', error);
      }
    }

    // Return user info (without password)
    return {
      userId: user.id,
      userName: user.userName,
      roleId: user.roleId,
      userType: userType,
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

  /**
   * Log login event to T_LoginLog table in SQL Server
   * Follows the same pattern as T_EmailVerification table
   */
  async logLoginEvent(data: {
    userId?: string | null;
    userName?: string | null;
    loginType: 'Manual' | 'Microsoft' | 'Google' | 'Apple';
    status: 'Success' | 'Failed';
    ipAddress?: string | null;
    userAgent?: string | null;
    errorMessage?: string | null;
  }): Promise<void> {
    try {
      // Create table if it doesn't exist (following T_EmailVerification pattern)
      const createTableQuery = `
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'T_LoginLog')
        BEGIN
          CREATE TABLE T_LoginLog (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            User_ID NVARCHAR(250) NULL,
            User_Name NVARCHAR(50) NULL,
            Login_Type NVARCHAR(50) NOT NULL,
            Status NVARCHAR(20) NOT NULL,
            IP_Address NVARCHAR(50) NULL,
            User_Agent NVARCHAR(500) NULL,
            Error_Message NVARCHAR(500) NULL,
            Login_Date DATETIME NOT NULL DEFAULT GETDATE(),
            Created_Date DATETIME NOT NULL DEFAULT GETDATE()
          )
          
          CREATE INDEX IX_T_LoginLog_User_ID ON T_LoginLog (User_ID)
          CREATE INDEX IX_T_LoginLog_Login_Date ON T_LoginLog (Login_Date)
          CREATE INDEX IX_T_LoginLog_Status ON T_LoginLog (Status)
        END
      `;

      await this.db.query(createTableQuery);

      // Insert login log record
      const insertQuery = `
        INSERT INTO T_LoginLog (
          User_ID,
          User_Name,
          Login_Type,
          Status,
          IP_Address,
          User_Agent,
          Error_Message,
          Login_Date,
          Created_Date
        )
        VALUES (
          @userId,
          @userName,
          @loginType,
          @status,
          @ipAddress,
          @userAgent,
          @errorMessage,
          GETDATE(),
          GETDATE()
        )
      `;

      await this.db.query(insertQuery, {
        userId: data.userId ?? null,
        userName: data.userName ?? null,
        loginType: data.loginType,
        status: data.status,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        errorMessage: data.errorMessage ?? null,
      });

      this.logger.debug(`Login event logged: ${data.status} for ${data.userId || 'unknown'}`);
    } catch (error) {
      // Log error but don't throw - login logging should not break the login flow
      this.logger.warn(
        `Failed to log login event to T_LoginLog: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  /**
   * Get Student role ID (helper method for social login)
   */
  private async getStudentRoleId(): Promise<number | null> {
    try {
      const query = `
        SELECT Id
        FROM T_ROLES
        WHERE Role_Name = 'Student' AND Is_Active = 1
      `;
      const result = await this.db.query<{ Id: number }>(query);
      if (result.recordset && result.recordset.length > 0) {
        return result.recordset[0].Id;
      }
      return null;
    } catch (error) {
      this.logger.warn('Error fetching Student role ID', error);
      return null;
    }
  }

  /**
   * Social login - follows exact same flow as manual login
   * Only difference: authentication source (OAuth vs password)
   */
  async socialLogin(data: {
    provider: 'microsoft' | 'google' | 'apple';
    code: string;
    redirectUri: string;
  }): Promise<{
    userId: number;
    userName: string;
    roleId: number;
    userType: string;
    passwordChange: boolean;
  }> {
    try {
      // Step 1: Exchange OAuth code for user info
      const userInfo = await this.exchangeOAuthCodeForUserInfo(
        data.provider,
        data.code,
        data.redirectUri,
      );

      if (!userInfo.email) {
        throw new BadRequestException('Email not provided by OAuth provider');
      }

      const email = userInfo.email.toLowerCase().trim();
      const userName = userInfo.name || email.split('@')[0];

      // Step 2: Get or create user in Tbl_UserMaster (same pattern as setNewPassword)
      const user = await this.getOrCreateSocialLoginUser(email, userName);

      // Step 3: Validate user (same checks as manual login)
      // Check if account is active
      if (!user.isActive) {
        // Activate user if inactive (same as manual login)
        await this.db.query(
          `UPDATE Tbl_UserMaster SET IsActive = 1, IsDeleted = 0 WHERE User_ID = @email`,
          { email },
        );
        this.logger.log(`Activated user account for social login: ${email}`);
      }

      // Step 4: Check if user is Student role (same validation as manual login)
      const studentRoleId = await this.getStudentRoleId();
      if (studentRoleId !== null && user.roleId === studentRoleId) {
        // Student users can use social login (unlike admin login which rejects students)
        // This is for user login flow, not admin login
      }

      // Step 5: Fetch User_Type from T_ROLES (same as manual login)
      let userType = user.userType;
      if (!userType || userType === '') {
        try {
          const roleQuery = `
            SELECT User_Type
            FROM T_ROLES
            WHERE Id = @roleId
          `;
          const roleResult = await this.db.query<{ User_Type: string }>(roleQuery, {
            roleId: user.roleId,
          });
          if (roleResult.recordset && roleResult.recordset.length > 0) {
            userType =
              getCaseInsensitiveValue<string>(roleResult.recordset[0], 'User_Type') || '';
          }
        } catch (error) {
          this.logger.warn('Failed to fetch User_Type from T_ROLES', error);
        }
      }

      // Step 6: Return same format as manual login
      // Note: userName in response is actually the email (User_ID) for consistency with manual login
      // Manual login returns: { userId, userName: email, roleId, userType, passwordChange }
      return {
        userId: user.id,
        userName: email, // Use email as userName (same as manual login - email is the User_ID)
        roleId: user.roleId,
        userType: userType,
        passwordChange: false, // Social login users don't have password change requirement
      };
    } catch (error) {
      this.logger.error('Social login error', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException(
        `Social login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Exchange OAuth code for user info from provider
   */
  private async exchangeOAuthCodeForUserInfo(
    provider: 'microsoft' | 'google' | 'apple',
    code: string,
    redirectUri: string,
  ): Promise<{ email: string; name?: string }> {
    const clientId = this.configService.get(
      `${provider.toUpperCase()}_CLIENT_ID` as keyof EnvVars,
      { infer: true },
    ) as string | undefined;

    const clientSecret = this.configService.get(
      `${provider.toUpperCase()}_CLIENT_SECRET` as keyof EnvVars,
      { infer: true },
    ) as string | undefined;

    if (!clientId) {
      throw new BadRequestException(`${provider} OAuth client ID not configured`);
    }

    try {
      let tokenResponse: { access_token: string };
      let userInfoResponse: { email: string; name?: string; displayName?: string };

      switch (provider) {
        case 'microsoft': {
          // Exchange code for token
          const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
          const tokenData = new URLSearchParams({
            client_id: clientId,
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            ...(clientSecret && { client_secret: clientSecret }),
          });

          const tokenRes = await firstValueFrom(
            this.httpService.post<{ access_token: string }>(tokenUrl, tokenData, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );
          tokenResponse = tokenRes.data;

          // Get user info
          const userInfoRes = await firstValueFrom(
            this.httpService.get<{
              mail?: string;
              userPrincipalName?: string;
              displayName?: string;
            }>('https://graph.microsoft.com/v1.0/me', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }),
          );
          const email = userInfoRes.data.mail || userInfoRes.data.userPrincipalName;
          if (!email) {
            throw new BadRequestException('Email not found in Microsoft account');
          }
          userInfoResponse = {
            email,
            name: userInfoRes.data.displayName,
          };
          break;
        }

        case 'google': {
          // Exchange code for token
          const tokenUrl = 'https://oauth2.googleapis.com/token';
          const tokenData = {
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          };

          const tokenRes = await firstValueFrom(
            this.httpService.post<{ access_token: string }>(tokenUrl, tokenData),
          );
          tokenResponse = tokenRes.data;

          // Get user info
          const userInfoRes = await firstValueFrom(
            this.httpService.get<{
              email: string;
              name?: string;
            }>('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }),
          );
          userInfoResponse = {
            email: userInfoRes.data.email,
            name: userInfoRes.data.name,
          };
          break;
        }

        case 'apple': {
          // Apple requires JWT for token exchange
          if (!clientSecret) {
            throw new BadRequestException('Apple client secret is required');
          }
          // For Apple, we'd need to implement JWT signing
          // Simplified version - in production, use proper Apple Sign In SDK
          throw new BadRequestException('Apple login not fully implemented yet');
        }

        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }

      return userInfoResponse;
    } catch (error) {
      this.logger.error(`OAuth token exchange failed for ${provider}`, error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to authenticate with ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get or create user for social login (same pattern as setNewPassword)
   */
  private async getOrCreateSocialLoginUser(
    email: string,
    userName: string,
  ): Promise<{
    id: number;
    userId: string;
    userName: string;
    roleId: number;
    userType: string;
    isActive: boolean;
  }> {
    // Check if user exists
    const checkQuery = `
      SELECT ID, User_ID, User_Name, Role_Id, User_Type, IsActive, IsDeleted
      FROM Tbl_UserMaster
      WHERE User_ID = @email
    `;
    const checkResult = await this.db.query<{
      ID: number;
      User_ID: string;
      User_Name: string;
      Role_Id: number | null;
      User_Type: string;
      IsActive: number | boolean;
      IsDeleted: number | boolean;
    }>(checkQuery, { email });

    if (checkResult.recordset && checkResult.recordset.length > 0) {
      // User exists - update if needed and return
      const existing = checkResult.recordset[0];
      const isActive = toBoolean(getCaseInsensitiveValue(existing, 'IsActive'));
      const isDeleted = toBoolean(getCaseInsensitiveValue(existing, 'IsDeleted'));

      // Update User_Name if empty and activate if needed
      if (
        (!getCaseInsensitiveValue<string>(existing, 'User_Name') ||
          getCaseInsensitiveValue<string>(existing, 'User_Name') ===
            getCaseInsensitiveValue<string>(existing, 'User_ID')) &&
        userName
      ) {
        await this.db.query(
          `UPDATE Tbl_UserMaster 
           SET User_Name = @userName, IsActive = 1, IsDeleted = 0, Modified_Date = GETDATE()
           WHERE User_ID = @email`,
          { userName: userName.toUpperCase(), email },
        );
      } else if (!isActive || isDeleted) {
        await this.db.query(
          `UPDATE Tbl_UserMaster SET IsActive = 1, IsDeleted = 0, Modified_Date = GETDATE() WHERE User_ID = @email`,
          { email },
        );
      }

      return {
        id: getCaseInsensitiveValue<number>(existing, 'ID') ?? 0,
        userId: getCaseInsensitiveValue<string>(existing, 'User_ID') ?? email,
        userName:
          getCaseInsensitiveValue<string>(existing, 'User_Name') || userName.toUpperCase(),
        roleId: getCaseInsensitiveValue<number>(existing, 'Role_Id') ?? 0,
        userType: getCaseInsensitiveValue<string>(existing, 'User_Type') || '',
        isActive: true, // We just activated it
      };
    }

    // User doesn't exist - create new user (same pattern as setNewPassword)
    const studentRoleId = await this.getStudentRoleId();

    const insertQuery = studentRoleId !== null
      ? `
        INSERT INTO Tbl_UserMaster (
          User_ID,
          User_Name,
          Password,
          Password_change,
          IsActive,
          IsDeleted,
          Role_Id,
          Created_Date,
          Created_By
        ) VALUES (
          @email,
          @userName,
          NULL,
          0,
          1,
          0,
          @studentRoleId,
          GETDATE(),
          @email
        )
      `
      : `
        INSERT INTO Tbl_UserMaster (
          User_ID,
          User_Name,
          Password,
          Password_change,
          IsActive,
          IsDeleted,
          Created_Date,
          Created_By
        ) VALUES (
          @email,
          @userName,
          NULL,
          0,
          1,
          0,
          GETDATE(),
          @email
        )
      `;

    const insertParams: { email: string; userName: string; studentRoleId?: number } = {
      email,
      userName: userName.toUpperCase(),
    };

    if (studentRoleId !== null) {
      insertParams.studentRoleId = studentRoleId;
    }

    await this.db.query(insertQuery, insertParams);

    // Get the created user
    const createdResult = await this.db.query<{
      ID: number;
      User_ID: string;
      User_Name: string;
      Role_Id: number | null;
      User_Type: string;
    }>(checkQuery, { email });

    if (!createdResult.recordset || createdResult.recordset.length === 0) {
      throw new BadRequestException('Failed to create user account');
    }

    const created = createdResult.recordset[0];
    this.logger.log(`Created new user for social login: ${email}`);

    return {
      id: getCaseInsensitiveValue<number>(created, 'ID') ?? 0,
      userId: getCaseInsensitiveValue<string>(created, 'User_ID') ?? email,
      userName: getCaseInsensitiveValue<string>(created, 'User_Name') || userName.toUpperCase(),
      roleId: getCaseInsensitiveValue<number>(created, 'Role_Id') ?? 0,
      userType: getCaseInsensitiveValue<string>(created, 'User_Type') || '',
      isActive: true,
    };
  }

  /**
   * Request password reset - sends email with reset link
   * Follows the same pattern as T_EmailVerification table
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      // Check if user exists by email (User_ID in Tbl_UserMaster is the email)
      const userQuery = `
        SELECT ID, User_ID, User_Name, IsActive, IsDeleted
        FROM Tbl_UserMaster
        WHERE User_ID = @email
      `;
      const userResult = await this.db.query<{
        ID: number;
        User_ID: string;
        User_Name: string;
        IsActive: number | boolean;
        IsDeleted: number | boolean;
      }>(userQuery, { email: email.toLowerCase().trim() });

      // Don't reveal if user exists (security best practice)
      if (!userResult.recordset || userResult.recordset.length === 0) {
        return {
          message: 'If the email exists, a password reset link has been sent.',
        };
      }

      const user = userResult.recordset[0];
      const isActive = toBoolean(getCaseInsensitiveValue(user, 'IsActive'));
      const isDeleted = toBoolean(getCaseInsensitiveValue(user, 'IsDeleted'));

      // Check if account is active
      if (!isActive || isDeleted) {
        // Still return success message for security
        return {
          message: 'If the email exists, a password reset link has been sent.',
        };
      }

      // Generate reset token (32 bytes = 64 hex characters)
      const resetToken = randomBytes(32).toString('hex');

      // Calculate expiration time (24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create password reset token table if it doesn't exist (following T_EmailVerification pattern)
      const createTableQuery = `
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'T_PasswordResetToken')
        BEGIN
          CREATE TABLE T_PasswordResetToken (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            User_ID NVARCHAR(255) NOT NULL,
            ResetToken NVARCHAR(255) NOT NULL,
            ExpiresAt DATETIME NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UsedAt DATETIME NULL,
            CONSTRAINT UQ_PasswordResetToken_Token UNIQUE (ResetToken)
          )
          
          CREATE INDEX IX_T_PasswordResetToken_User_ID ON T_PasswordResetToken (User_ID)
          CREATE INDEX IX_T_PasswordResetToken_ExpiresAt ON T_PasswordResetToken (ExpiresAt)
        END
      `;

      await this.db.query(createTableQuery);

      // Store reset token
      const insertQuery = `
        INSERT INTO T_PasswordResetToken (User_ID, ResetToken, ExpiresAt)
        VALUES (@user_id, @token, @expiresAt)
      `;

      await this.db.query(insertQuery, {
        user_id: email.toLowerCase().trim(),
        token: resetToken,
        expiresAt: expiresAt.toISOString(),
      });

      // Get frontend app URL for reset link
      const appUrl =
        this.configService.get('SSO_APP_URL', { infer: true }) ||
        this.configService.get('EXPERIENCE_APP_URL', { infer: true }) ||
        'http://localhost:5173';

      // Create reset URL - redirects to admin reset password page with token
      const resetUrl = `${appUrl}/admin-reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      // Get user name for email
      const userName = getCaseInsensitiveValue<string>(user, 'User_Name') || email.split('@')[0];
      const firstName = userName.split(' ')[0] || userName;

      // Send password reset email
      const emailSent = await this.emailService.sendEmail({
        to: email,
        subject: 'Reset Your Password - Leo Muthu Scholarship',
        html: this.getPasswordResetEmailTemplate(firstName, resetUrl),
        text: this.getPasswordResetEmailText(firstName, resetUrl),
      });

      if (!emailSent) {
        this.logger.warn(`Failed to send password reset email to ${email}`);
      }

      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    } catch (error) {
      this.logger.error('Error requesting password reset', error);
      // Still return success message for security
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Find valid reset token
      const tokenQuery = `
        SELECT Id, User_ID, ResetToken, ExpiresAt, UsedAt
        FROM T_PasswordResetToken
        WHERE ResetToken = @token
        AND User_ID = @email
      `;
      const tokenResult = await this.db.query<{
        Id: number;
        User_ID: string;
        ResetToken: string;
        ExpiresAt: Date;
        UsedAt: Date | null;
      }>(tokenQuery, {
        token,
        email: email.toLowerCase().trim(),
      });

      if (!tokenResult.recordset || tokenResult.recordset.length === 0) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const tokenRecord = tokenResult.recordset[0];
      const expiresAt = new Date(tokenRecord.ExpiresAt);
      const usedAt = tokenRecord.UsedAt ? new Date(tokenRecord.UsedAt) : null;

      // Check if token is expired
      if (expiresAt < new Date()) {
        throw new BadRequestException('Reset token has expired');
      }

      // Check if token has already been used
      if (usedAt) {
        throw new BadRequestException('Reset token has already been used');
      }

      // Encrypt new password
      const encryptedNewPassword = this.encryptPassword(newPassword);

      // Update password in Tbl_UserMaster
      const updatePasswordQuery = `
        UPDATE Tbl_UserMaster
        SET 
          Password = @newPassword,
          Password_change = 'False',
          Modified_Date = GETDATE(),
          Modified_By = @email
        WHERE User_ID = @email
      `;

      await this.db.query(updatePasswordQuery, {
        newPassword: encryptedNewPassword,
        email: email.toLowerCase().trim(),
      });

      // Mark token as used
      const markUsedQuery = `
        UPDATE T_PasswordResetToken
        SET UsedAt = GETDATE()
        WHERE Id = @id
      `;

      await this.db.query(markUsedQuery, {
        id: getCaseInsensitiveValue<number>(tokenRecord, 'Id'),
      });

      return {
        message: 'Password reset successfully. Please log in with your new password.',
      };
    } catch (error) {
      this.logger.error('Error resetting password', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reset password. Please try again.');
    }
  }

  /**
   * Get password reset email HTML template
   */
  private getPasswordResetEmailTemplate(
    firstName: string,
    resetUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Leo Muthu Scholarship</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #2453C3 0%, #0078D4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Leo Muthu Scholarship</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Reset your password</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hello ${firstName},</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        We received a request to reset your password for your Leo Muthu Scholarship admin account. Click the button below to set a new password.
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" 
           style="display: inline-block; background: #2453C3; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(36, 83, 195, 0.3);">
          Reset Password
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 6px; margin: 10px 0;">
        ${resetUrl}
      </p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
        <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">⏰ Important</p>
        <p style="font-size: 13px; color: #78350f; margin: 8px 0 0 0; line-height: 1.6;">
          This reset link will expire in 24 hours. If you did not request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} Leo Muthu Scholarship. All rights reserved.<br>
        An Initiative of ARAM Foundation<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get password reset email text version
   */
  private getPasswordResetEmailText(
    firstName: string,
    resetUrl: string,
  ): string {
    return `
Leo Muthu Scholarship - Reset Your Password

Hello ${firstName},

We received a request to reset your password for your Leo Muthu Scholarship admin account. Click the link below to set a new password.

Reset Password: ${resetUrl}

This reset link will expire in 24 hours. If you did not request a password reset, please ignore this email and your password will remain unchanged.

© ${new Date().getFullYear()} Leo Muthu Scholarship. All rights reserved.
An Initiative of ARAM Foundation
Powered by iTech
    `.trim();
  }
}
