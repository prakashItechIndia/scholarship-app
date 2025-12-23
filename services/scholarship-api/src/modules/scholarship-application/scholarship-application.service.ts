import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { EnvVars } from '../../config/env.validation';
import { ScholarshipAuthService } from '../scholarship-auth/scholarship-auth.service';

interface RegistrationData {
  schYearId: number;
  schYear: string;
  scholarshipFor: string;
  applicationId?: string;
  applicantType?: string;
  studentId?: string;
  applicantName: string;
  fatherName: string;
  fatherOccupation?: string;
  fatherOfficeName?: string;
  motherName: string;
  motherOccupation?: string;
  motherOfficeName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  country?: string;
  aadhaarId: string;
  panId?: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  community?: string;
  caste?: string;
  classStudying?: string;
  boardOfStudying?: string;
  typeOfInstitution?: string;
  courceOfStudying?: string;
  degreeType?: string;
  degree?: string;
  otherDegree?: string;
  phD?: string;
  specialization?: string;
  institutionName?: string;
  university?: string;
  currentYear?: string;
  currentSemester?: string;
  fatherAnnualIncome?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  requestAmount?: number;
  photo?: string;
  appliedOtherScholarship?: string;
  guardianName?: string;
}

@Injectable()
export class ScholarshipApplicationService {
  private readonly logger = new Logger(ScholarshipApplicationService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly authService: ScholarshipAuthService,
  ) {}

  /**
   * Generate Application ID - matches ASP.NET GenerateApplicationID
   * Format: AF[YY][XXXXXX] - Example: AF25000123
   */
  async generateApplicationId(schYear: string): Promise<string> {
    try {
      // Get year component (last 2 digits)
      const year = schYear.substring(2, 4);

      // Get next sequence number
      const query = `
        SELECT ISNULL(MAX(CAST(SUBSTRING(Application_Id, 5, LEN(Application_Id)) AS INT)), 0) + 1 as NextSeq
        FROM t_Registration
        WHERE Application_Id LIKE 'AF${year}%'
      `;

      const result = await this.db.query<{ NextSeq: number }>(query);
      const nextSeq = result.recordset[0]?.NextSeq || 1;

      // Format: AF + YY + 6-digit sequence (zero-padded)
      const sequence = nextSeq.toString().padStart(6, '0');
      return `AF${year}${sequence}`;
    } catch (error) {
      this.logger.error('Error generating application ID', error);
      throw new BadRequestException('Failed to generate application ID');
    }
  }

  /**
   * Check if Aadhaar ID already exists
   */
  async checkAadhaarId(
    aadhaarId: string,
    scholarshipYearId: number,
  ): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as Count
        FROM t_Registration
        WHERE Aadhaar_ID = @aadhaarId AND Scholarship_Year_Id = @scholarshipYearId
      `;

      const result = await this.db.query<{ Count: number }>(query, {
        aadhaarId,
        scholarshipYearId,
      });

      return result.recordset[0]?.Count || 0;
    } catch (error) {
      this.logger.error('Error checking Aadhaar ID', error);
      throw new BadRequestException('Failed to check Aadhaar ID');
    }
  }

  /**
   * Check if PAN ID already exists
   */
  async checkPanId(panId: string, scholarshipYearId: number): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as Count
        FROM t_Registration
        WHERE Pan_ID = @panId AND Scholarship_Year_Id = @scholarshipYearId AND Pan_ID IS NOT NULL AND Pan_ID != ''
      `;

      const result = await this.db.query<{ Count: number }>(query, {
        panId,
        scholarshipYearId,
      });

      return result.recordset[0]?.Count || 0;
    } catch (error) {
      this.logger.error('Error checking PAN ID', error);
      throw new BadRequestException('Failed to check PAN ID');
    }
  }

  /**
   * Save scholarship registration - matches USP_SAVESCHOLERSHIP stored procedure
   */
  async saveRegistration(data: RegistrationData) {
    try {
      // Generate application ID if not provided
      let applicationId = data.applicationId;
      if (!applicationId) {
        applicationId = await this.generateApplicationId(data.schYear);
      }

      // Call stored procedure
      await this.db.execute('USP_SAVESCHOLERSHIP', {
        Sch_YearId: data.schYearId,
        Sch_Year: data.schYear,
        Scholarship_For: data.scholarshipFor,
        Application_Id: applicationId,
        Applicant_Type: data.applicantType || '',
        Student_ID: data.studentId || '',
        Applicant_Name: data.applicantName.toUpperCase(),
        Father_Name: data.fatherName.toUpperCase(),
        Father_Occupation: data.fatherOccupation || '',
        Father_OfficeName: data.fatherOfficeName || '',
        Mother_Name: data.motherName.toUpperCase(),
        Mother_Occupation: data.motherOccupation || '',
        Mother_OfficeName: data.motherOfficeName || '',
        Address_Line1: data.addressLine1 || '',
        Address_Line2: data.addressLine2 || '',
        City: data.city || '',
        PinCode: data.pinCode || '',
        State: data.state || '',
        District: data.district || '',
        Country: data.country || '',
        Aadhaar_ID: data.aadhaarId,
        Pan_ID: data.panId || '',
        Mobile_Number: data.mobileNumber,
        Email: data.email,
        Date_Of_Birth: data.dateOfBirth,
        Gender: data.gender,
        Community: data.community || '',
        Caste: data.caste || '',
        Class_Studying: data.classStudying || '',
        Board_Of_Studying: data.boardOfStudying || '',
        Type_Of_Institution: data.typeOfInstitution || '',
        Cource_Of_Studying: data.courceOfStudying || '',
        Degree_Type: data.degreeType || '',
        Degree: data.degree || '',
        Other_Degree: data.otherDegree || '',
        Ph_D: data.phD || '',
        Specialization: data.specialization || '',
        Institution_Name: data.institutionName || '',
        University: data.university || '',
        Current_Year: data.currentYear || '',
        Current_Semester: data.currentSemester || '',
        Father_AnnualIncome: data.fatherAnnualIncome || '',
        Bank_Account_Number: data.bankAccountNumber || '',
        Bank_Name: data.bankName || '',
        Bank_Branch: data.bankBranch || '',
        IFSC_Code: data.ifscCode || '',
        RequestAmount: data.requestAmount || 0,
        Photo: data.photo || '',
        AppliedOtherScholarship: data.appliedOtherScholarship || '',
        Guardian_Name: data.guardianName || '',
        Scholarship_Status: '',
        Scholarship_No: '',
        Payment_Mode: '',
        Payment_Date: '',
        NetBanking_RefNo: '',
        DDCheque_No: '',
        DDCheque_Date: '',
        User_ID: '',
      });

      return {
        applicationId,
        message: 'Registration saved successfully',
      };
    } catch (error) {
      this.logger.error('Error saving registration', error);
      throw new BadRequestException('Failed to save registration');
    }
  }

  /**
   * Get application by application ID using stored procedure
   * Matches USP_GET_DATA_BY_APPLICATION_NO
   */
  async getApplicationByApplicationId(
    applicationId: string,
    processType?: string,
    scholarshipId?: number,
  ) {
    try {
      const result = await this.db.execute('USP_GET_DATA_BY_APPLICATION_NO', {
        Application_Id: applicationId,
        Process_Type: processType || 'Registered',
        Scholarship_Id: scholarshipId || 1,
      });

      if (!result.recordset || result.recordset.length === 0) {
        throw new BadRequestException('Application not found');
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error fetching application', error);
      throw new BadRequestException('Failed to fetch application');
    }
  }

  /**
   * Get applications by user email
   */
  async getApplicationsByEmail(email: string) {
    try {
      const query = `
        SELECT
          R.*,
          P.Status,
          P.Scholarship_No,
          P.Scholarship_Approved_Amount,
          P.Scholarship_Suggest_Amount
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE R.Email = @email
        ORDER BY R.Application_Id DESC
      `;

      const result = await this.db.query(query, { email });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching applications', error);
      throw new BadRequestException('Failed to fetch applications');
    }
  }

  /**
   * Check if email exists in the system
   * Used for login flow to determine if user is registered
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM t_Registration
        WHERE Email = @email
      `;

      const result = await this.db.query<{ count: number }>(query, { email });

      return (result.recordset?.[0]?.count || 0) > 0;
    } catch (error) {
      this.logger.error('Error checking email existence', error);
      return false;
    }
  }

  /**
   * Check if user can login (has password set in Tbl_UserMaster)
   * Returns detailed status for login flow
   *
   * Logic:
   * - If user has password in Tbl_UserMaster → canLogin = true (regardless of registration)
   * - If email exists in registration but no password → needsOnboarding = true
   * - If neither → new user flow
   */
  async checkUserLoginStatus(email: string): Promise<{
    emailExists: boolean;
    hasPassword: boolean;
    canLogin: boolean;
    needsOnboarding: boolean;
  }> {
    try {
      // Check if email exists in registration table
      const registrationQuery = `
        SELECT COUNT(*) as count
        FROM t_Registration
        WHERE Email = @email
      `;
      const regResult = await this.db.query<{ count: number }>(
        registrationQuery,
        { email },
      );
      const emailExists = (regResult.recordset?.[0]?.count || 0) > 0;

      // Check if user has password set in Tbl_UserMaster
      // IsActive and IsDeleted are bit type (1/0)
      const userQuery = `
        SELECT COUNT(*) as count
        FROM Tbl_UserMaster
        WHERE User_ID = @email
        AND Password IS NOT NULL
        AND Password != ''
        AND IsActive = 1
        AND (IsDeleted = 0 OR IsDeleted IS NULL)
      `;
      const userResult = await this.db.query<{ count: number }>(userQuery, {
        email,
      });
      const hasPassword = (userResult.recordset?.[0]?.count || 0) > 0;

      // If user has password set, they can login (regardless of registration status)
      // This handles the case where user sets password but hasn't registered yet
      const canLogin = hasPassword;

      // Needs onboarding if email exists in registration but no password set
      const needsOnboarding = emailExists && !hasPassword;

      return {
        emailExists,
        hasPassword,
        canLogin,
        needsOnboarding,
      };
    } catch (error) {
      this.logger.error('Error checking user login status', error);
      return {
        emailExists: false,
        hasPassword: false,
        canLogin: false,
        needsOnboarding: false,
      };
    }
  }

  /**
   * Get active scholarship year settings
   */
  async getActiveScholarshipYear() {
    try {
      const query = `
        SELECT
          ScholarshipYear_Id,
          ScholarshipYear_Code,
          ScholarshipYear_Name,
          Scholarship_MailId,
          Scholarship_ReplyTo_MailId,
          Scholarship_CC_MailId,
          Scholarship_BCC_MailId,
          Scholarship_Mail_Subject,
          Status
        FROM T_Scholarship_Year
        WHERE Status = 'true'
      `;

      const result = await this.db.query(query);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching scholarship year', error);
      throw new BadRequestException('Failed to fetch scholarship year');
    }
  }

  /**
   * Update application
   */
  async updateApplication(
    applicationId: string,
    data: Partial<RegistrationData>,
  ) {
    try {
      // Build dynamic update query based on provided fields
      const updateFields: string[] = [];
      const params: Record<string, unknown> = { applicationId };

      if (data.applicantName) {
        updateFields.push('Applicant_Name = @applicantName');
        params.applicantName = data.applicantName.toUpperCase();
      }
      if (data.fatherName) {
        updateFields.push('Father_Name = @fatherName');
        params.fatherName = data.fatherName.toUpperCase();
      }
      if (data.motherName) {
        updateFields.push('Mother_Name = @motherName');
        params.motherName = data.motherName.toUpperCase();
      }
      if (data.mobileNumber) {
        updateFields.push('Mobile_Number = @mobileNumber');
        params.mobileNumber = data.mobileNumber;
      }
      if (data.email) {
        updateFields.push('Email = @email');
        params.email = data.email;
      }
      // Add more fields as needed

      if (updateFields.length === 0) {
        throw new BadRequestException('No fields to update');
      }

      const query = `
        UPDATE t_Registration
        SET ${updateFields.join(', ')}
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(query, params);

      return { message: 'Application updated successfully' };
    } catch (error) {
      this.logger.error('Error updating application', error);
      throw new BadRequestException('Failed to update application');
    }
  }

  /**
   * Send verification email for new user onboarding
   * Generates a verification token and sends email with onboarding link
   */
  async sendVerificationEmail(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if email already exists
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        return {
          success: false,
          message: 'This email is already registered. Please log in.',
        };
      }

      // Generate verification token (32 bytes = 64 hex characters)
      const verificationToken = randomBytes(32).toString('hex');

      // Calculate expiration time (30 minutes per BRD Section 5.3.1)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      // Store verification token in database
      // Using a simple approach: create a temporary table or use existing structure
      // For now, we'll store it in a simple way that can be validated later
      const insertQuery = `
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'T_EmailVerification')
        BEGIN
          CREATE TABLE T_EmailVerification (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            Email NVARCHAR(255) NOT NULL,
            VerificationToken NVARCHAR(255) NOT NULL,
            ExpiresAt DATETIME NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UsedAt DATETIME NULL,
            CONSTRAINT UQ_EmailVerification_Token UNIQUE (VerificationToken)
          )
        END
        
        INSERT INTO T_EmailVerification (Email, VerificationToken, ExpiresAt)
        VALUES (@email, @token, @expiresAt)
      `;

      await this.db.query(insertQuery, {
        email,
        token: verificationToken,
        expiresAt: expiresAt.toISOString(),
      });

      // Get frontend app URL for verification link
      const appUrl =
        this.configService.get('SSO_APP_URL', { infer: true }) ||
        this.configService.get('EXPERIENCE_APP_URL', { infer: true }) ||
        'http://localhost:5173';

      // Create verification URL - redirects to email-verification page with token
      const verificationUrl = `${appUrl}/email-verification?token=${verificationToken}&email=${encodeURIComponent(email)}`;

      // Send verification email
      const emailSent = await this.emailService.sendEmail({
        to: email,
        subject: 'Verify Your Email - Leo Muthu Scholarship',
        html: this.getVerificationEmailTemplate(email, verificationUrl),
        text: this.getVerificationEmailText(email, verificationUrl),
      });

      if (emailSent) {
        return {
          success: true,
          message:
            'Verification email sent successfully. Please check your inbox.',
        };
      } else {
        return {
          success: false,
          message: 'Failed to send verification email. Please try again later.',
        };
      }
    } catch (error) {
      this.logger.error('Error sending verification email', error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  /**
   * Verify email token and return validity
   */
  async verifyEmailToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string; message: string }> {
    try {
      const query = `
        SELECT Email, ExpiresAt, UsedAt
        FROM T_EmailVerification
        WHERE VerificationToken = @token
      `;

      const result = await this.db.query<{
        Email: string;
        ExpiresAt: Date;
        UsedAt: Date | null;
      }>(query, { token });

      if (!result.recordset || result.recordset.length === 0) {
        return {
          valid: false,
          message: 'Invalid verification token.',
        };
      }

      const record = result.recordset[0];

      // Check if token is already used
      if (record.UsedAt) {
        return {
          valid: false,
          message: 'This verification link has already been used.',
        };
      }

      // Check if token is expired
      const expiresAt = new Date(record.ExpiresAt);
      if (expiresAt < new Date()) {
        return {
          valid: false,
          message:
            'This verification link has expired. Please request a new one.',
        };
      }

      return {
        valid: true,
        email: record.Email,
        message: 'Token is valid.',
      };
    } catch (error) {
      this.logger.error('Error verifying email token', error);
      return {
        valid: false,
        message: 'Failed to verify token.',
      };
    }
  }

  /**
   * Mark verification token as used
   */
  async markTokenAsUsed(token: string): Promise<void> {
    try {
      const query = `
        UPDATE T_EmailVerification
        SET UsedAt = GETDATE()
        WHERE VerificationToken = @token
      `;

      await this.db.query(query, { token });
    } catch (error) {
      this.logger.error('Error marking token as used', error);
    }
  }

  /**
   * Set password for new user (onboarding completion)
   * Creates user in Tbl_UserMaster if doesn't exist, or updates password if exists
   */
  async setNewPassword(
    email: string,
    password: string,
    token?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // If token is provided, verify it first
      if (token) {
        const tokenVerification = await this.verifyEmailToken(token);
        if (!tokenVerification.valid) {
          return {
            success: false,
            message:
              tokenVerification.message ||
              'Invalid or expired verification token.',
          };
        }
        // Ensure the token email matches the provided email
        if (tokenVerification.email && tokenVerification.email !== email) {
          return {
            success: false,
            message: 'Email does not match verification token.',
          };
        }
        // Mark token as used
        await this.markTokenAsUsed(token);
      } else {
        // If no token, check if email exists in registration (for existing users updating password)
        const emailExists = await this.checkEmailExists(email);
        if (!emailExists) {
          return {
            success: false,
            message:
              'Verification token is required for new user registration.',
          };
        }
      }

      // Encrypt password using the same method as login
      const encryptedPassword = this.authService.encryptPassword(password);

      // Check if user already exists in Tbl_UserMaster
      const checkUserQuery = `
        SELECT COUNT(*) as count
        FROM Tbl_UserMaster
        WHERE User_ID = @email
      `;
      const userCheck = await this.db.query<{ count: number }>(checkUserQuery, {
        email,
      });
      const userExists = (userCheck.recordset?.[0]?.count || 0) > 0;

      if (userExists) {
        // Update existing user password
        // IsActive, IsDeleted, Password_change are bit type (1/0)
        // Ensure IsActive is set to 1 (active) when password is set
        const updateQuery = `
          UPDATE Tbl_UserMaster
          SET 
            Password = @password,
            Password_change = 0,
            IsActive = 1,
            IsDeleted = 0,
            Modified_Date = GETDATE(),
            Modified_By = @email
          WHERE User_ID = @email
        `;
        await this.db.query(updateQuery, {
          password: encryptedPassword,
          email,
        });
        this.logger.log(`Password updated and user activated for: ${email}`);
      } else {
        // Create new user (even if not in t_Registration yet - they can register later)
        // Based on actual schema: IsActive, IsDeleted, Password_change are bit type (1/0)
        // User_Type column doesn't exist in the schema
        // Set IsActive = 1 to ensure user can login immediately
        const insertQuery = `
          INSERT INTO Tbl_UserMaster (
            User_ID,
            Password,
            Password_change,
            IsActive,
            IsDeleted,
            Created_Date,
            Created_By
          ) VALUES (
            @email,
            @password,
            1,
            1,
            0,
            GETDATE(),
            @email
          )
        `;
        await this.db.query(insertQuery, {
          email,
          password: encryptedPassword,
        });
        this.logger.log(`New user created and activated for: ${email}`);
      }

      // Verify the user was created/updated correctly and ensure IsActive is set
      const verifyQuery = `
        SELECT User_ID, IsActive, IsDeleted, Password, Role_Id
        FROM Tbl_UserMaster
        WHERE User_ID = @email
      `;
      const verifyResult = await this.db.query<{
        User_ID: string;
        IsActive: number | boolean;
        IsDeleted: number | boolean;
        Password: string;
        Role_Id: number | null;
      }>(verifyQuery, { email });

      if (verifyResult.recordset && verifyResult.recordset.length > 0) {
        const user = verifyResult.recordset[0];
        this.logger.log(
          `User verification - Email: ${user.User_ID}, IsActive: ${user.IsActive} (type: ${typeof user.IsActive}), IsDeleted: ${user.IsDeleted}, HasPassword: ${!!user.Password}, Role_Id: ${user.Role_Id}`,
        );

        // Double-check: If IsActive is not 1, force update it
        const isActiveValue = user.IsActive;
        const isActiveNumeric =
          isActiveValue === 1 ||
          isActiveValue === true ||
          String(isActiveValue) === '1' ||
          String(isActiveValue).toLowerCase() === 'true';

        if (!isActiveNumeric) {
          this.logger.warn(
            `IsActive is not set correctly for ${email}. Current value: ${isActiveValue}. Forcing update...`,
          );
          const forceUpdateQuery = `
            UPDATE Tbl_UserMaster
            SET IsActive = 1, IsDeleted = 0
            WHERE User_ID = @email
          `;
          await this.db.query(forceUpdateQuery, { email });
          this.logger.log(`Forced IsActive = 1 for user: ${email}`);
        }
      } else {
        this.logger.error(
          `User verification failed - User not found: ${email}`,
        );
      }

      return {
        success: true,
        message: 'Password set successfully. You can now log in.',
      };
    } catch (error) {
      this.logger.error('Error setting password', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to set password';
      this.logger.error('Detailed error:', errorMessage);
      throw new BadRequestException(`Failed to set password: ${errorMessage}`);
    }
  }

  /**
   * Get verification email HTML template
   */
  private getVerificationEmailTemplate(
    email: string,
    verificationUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Leo Muthu Scholarship</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #2453C3 0%, #0078D4 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Leo Muthu Scholarship</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Verify your email to get started</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hello,</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        Thank you for your interest in the Leo Muthu Scholarship program. To complete your registration, please verify your email address by clicking the button below.
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #2453C3; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(36, 83, 195, 0.3);">
          Verify Email Address
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 6px; margin: 10px 0;">
        ${verificationUrl}
      </p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
        <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">⏰ Important</p>
        <p style="font-size: 13px; color: #78350f; margin: 8px 0 0 0; line-height: 1.6;">
          This verification link will expire in 30 minutes. If you didn't request this email, please ignore it.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} ARAM Foundation. All rights reserved.<br>
        Contact: admission@aram.in | +91 12345 67890
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get verification email text template
   */
  private getVerificationEmailText(
    email: string,
    verificationUrl: string,
  ): string {
    return `
Leo Muthu Scholarship - Email Verification

Hello,

Thank you for your interest in the Leo Muthu Scholarship program. To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 30 minutes. If you didn't request this email, please ignore it.

© ${new Date().getFullYear()} ARAM Foundation. All rights reserved.
Contact: admission@aram.in | +91 12345 67890
    `.trim();
  }
}
