import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { EnvVars } from '../../config/env.validation';
import { ScholarshipAuthService } from '../scholarship-auth/scholarship-auth.service';

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
  fatherOccupationOther?: string;
  fatherDesignation?: string;
  fatherOfficeName?: string;
  motherName: string;
  motherOccupation?: string;
  motherOccupationOther?: string;
  motherDesignation?: string;
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
  guardianOccupation?: string;
  guardianOccupationOther?: string;
  guardianDesignation?: string;
  guardianAnnualIncome?: string;
  guardianOfficeName?: string;
  motherAnnualIncome?: string;
  // Medical fields
  abhaId?: string;
  medicalReason?: string;
  medicalDocuments?: File[];
  lastDateForAmount?: string;
}

@Injectable()
export class ScholarshipApplicationService {
  private readonly logger = new Logger(ScholarshipApplicationService.name);

  /**
   * Get or find Student role ID from T_ROLES table
   * Returns the Role_Id for Student role, or null if not found
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
        const roleId = result.recordset[0].Id;
        this.logger.log(`Found Student role ID: ${roleId}`);
        return roleId;
      }
      this.logger.warn('Student role not found in T_ROLES table');
      return null;
    } catch (error) {
      this.logger.error('Error fetching Student role ID', error);
      return null;
    }
  }

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
  async saveRegistration(data: RegistrationData | Record<string, unknown>) {
    try {
      // Validate data exists
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Invalid registration data provided');
      }

      // Helper function to safely get value from data
      const getValue = <T>(
        camelKey: keyof RegistrationData,
        dbKey: string,
        altKey?: string,
        defaultValue: T | '' = '',
      ): T | '' => {
        const record = data as Record<string, unknown>;
        return (
          ((data as RegistrationData)[camelKey] as T | undefined) ??
          (record[dbKey] as T | undefined) ??
          (altKey ? (record[altKey] as T | undefined) : undefined) ??
          defaultValue
        );
      };

      // Handle both camelCase (RegistrationData) and database column name formats
      // Map incoming data to expected format
      const normalizedData: RegistrationData = {
        schYearId: (getValue<number>('schYearId', 'Scholarship_Year_Id', 'scholarshipYearId', 0) as number) || 0,
        schYear: getValue<string>('schYear', 'Sch_Year', 'schYear', '') as string,
        scholarshipFor: getValue<string>('scholarshipFor', 'Scholarship_For', 'scholarshipFor', '') as string,
        applicationId: getValue<string | undefined>('applicationId', 'Application_Id', 'applicationId') as string | undefined,
        applicantType: getValue<string | undefined>('applicantType', 'Applicant_Type', 'applicantType') as string | undefined,
        studentId: getValue<string | undefined>('studentId', 'Student_ID', 'studentId') as string | undefined,
        applicantName: getValue<string>('applicantName', 'Applicant_Name', 'fullName', '') as string,
        fatherName: getValue<string>('fatherName', 'Father_Name', 'fatherName', '') as string,
        fatherOccupation: getValue<string | undefined>('fatherOccupation', 'Father_Occupation', 'fatherOccupation') as string | undefined,
        fatherOccupationOther: getValue<string | undefined>('fatherOccupationOther', 'Father_Occupation_Other', 'fatherOccupationOther') as string | undefined,
        fatherDesignation: getValue<string | undefined>('fatherDesignation', 'Father_Designation', 'fatherDesignation') as string | undefined,
        fatherOfficeName: getValue<string | undefined>('fatherOfficeName', 'Father_OfficeName', 'fatherOfficeName') as string | undefined,
        motherName: getValue<string>('motherName', 'Mother_Name', 'motherName', '') as string,
        motherOccupation: getValue<string | undefined>('motherOccupation', 'Mother_Occupation', 'motherOccupation') as string | undefined,
        motherOccupationOther: getValue<string | undefined>('motherOccupationOther', 'Mother_Occupation_Other', 'motherOccupationOther') as string | undefined,
        motherDesignation: getValue<string | undefined>('motherDesignation', 'Mother_Designation', 'motherDesignation') as string | undefined,
        motherOfficeName: getValue<string | undefined>('motherOfficeName', 'Mother_OfficeName', 'motherOfficeName') as string | undefined,
        addressLine1: getValue<string | undefined>('addressLine1', 'Address_Line1', 'addressLine1') as string | undefined,
        addressLine2: getValue<string | undefined>('addressLine2', 'Address_Line2', 'addressLine2') as string | undefined,
        city: getValue<string | undefined>('city', 'City', 'city') as string | undefined,
        pinCode: getValue<string | undefined>('pinCode', 'PinCode', 'pincode') as string | undefined,
        state: getValue<string | undefined>('state', 'State', 'state') as string | undefined,
        district: getValue<string | undefined>('district', 'District', 'district') as string | undefined,
        country: getValue<string | undefined>('country', 'Country', 'country') as string | undefined,
        aadhaarId: getValue<string>('aadhaarId', 'Aadhaar_ID', 'aadhaarId', '') as string,
        panId: getValue<string | undefined>('panId', 'Pan_ID', 'panId') as string | undefined,
        mobileNumber: getValue<string>('mobileNumber', 'Mobile_Number', 'mobile', '') as string,
        email: getValue<string>('email', 'Email', 'email', '') as string,
        dateOfBirth: getValue<string>('dateOfBirth', 'Date_Of_Birth', 'dateOfBirth', '') as string,
        gender: getValue<string>('gender', 'Gender', 'gender', '') as string,
        community: getValue<string | undefined>('community', 'Community', 'community') as string | undefined,
        caste: getValue<string | undefined>('caste', 'Caste', 'caste') as string | undefined,
        classStudying: getValue<string | undefined>('classStudying', 'Class_Studying', 'classStudying') as string | undefined,
        boardOfStudying: getValue<string | undefined>('boardOfStudying', 'Board_Of_Studying', 'boardOfStudying') as string | undefined,
        typeOfInstitution: getValue<string | undefined>('typeOfInstitution', 'Type_Of_Institution', 'typeOfInstitution') as string | undefined,
        courceOfStudying: getValue<string | undefined>('courceOfStudying', 'Cource_Of_Studying', 'courseOfStudying') as string | undefined,
        degreeType: getValue<string | undefined>('degreeType', 'Degree_Type', 'degreeType') as string | undefined,
        degree: getValue<string | undefined>('degree', 'Degree', 'degree') as string | undefined,
        otherDegree: getValue<string | undefined>('otherDegree', 'Other_Degree', 'otherDegree') as string | undefined,
        phD: getValue<string | undefined>('phD', 'Ph_D', 'phD') as string | undefined,
        specialization: getValue<string | undefined>('specialization', 'Specialization', 'specialization') as string | undefined,
        institutionName: getValue<string | undefined>('institutionName', 'Institution_Name', 'institutionName') as string | undefined,
        university: getValue<string | undefined>('university', 'University', 'university') as string | undefined,
        currentYear: getValue<string | undefined>('currentYear', 'Current_Year', 'currentYear') as string | undefined,
        currentSemester: getValue<string | undefined>('currentSemester', 'Current_Semester', 'currentSemester') as string | undefined,
        fatherAnnualIncome: getValue<string | undefined>('fatherAnnualIncome', 'Father_AnnualIncome', 'annualIncome') as string | undefined,
        bankAccountNumber: getValue<string | undefined>('bankAccountNumber', 'Bank_Account_Number', 'accountNumber') as string | undefined,
        bankName: getValue<string | undefined>('bankName', 'Bank_Name', 'bankName') as string | undefined,
        bankBranch: getValue<string | undefined>('bankBranch', 'Bank_Branch', 'bankBranch') as string | undefined,
        ifscCode: getValue<string | undefined>('ifscCode', 'IFSC_Code', 'ifscCode') as string | undefined,
        requestAmount: getValue<number | undefined>('requestAmount', 'RequestAmount', 'requestAmount') as number | undefined,
        photo: getValue<string | undefined>('photo', 'Photo', 'photo') as string | undefined,
        appliedOtherScholarship: getValue<string | undefined>('appliedOtherScholarship', 'AppliedOtherScholarship', 'appliedOtherScholarship') as string | undefined,
        guardianName: getValue<string | undefined>('guardianName', 'Guardian_Name', 'guardianName') as string | undefined,
        guardianOccupation: getValue<string | undefined>('guardianOccupation', 'Guardian_Occupation', 'guardianOccupation') as string | undefined,
        guardianOccupationOther: getValue<string | undefined>('guardianOccupationOther', 'Guardian_Occupation_Other', 'guardianOccupationOther') as string | undefined,
        guardianDesignation: getValue<string | undefined>('guardianDesignation', 'Guardian_Designation', 'guardianDesignation') as string | undefined,
        guardianAnnualIncome: getValue<string | undefined>('guardianAnnualIncome', 'GuardianAnnulIncome', 'guardianAnnualIncome') as string | undefined,
        guardianOfficeName: getValue<string | undefined>('guardianOfficeName', 'Guardian_OfficeName', 'guardianOfficeName') as string | undefined,
        motherAnnualIncome: getValue<string | undefined>('motherAnnualIncome', 'Mother_AnnualIncome', 'motherAnnualIncome') as string | undefined,
        // Medical fields
        abhaId: getValue<string | undefined>('abhaId', 'ABHA_ID', 'abhaId') as string | undefined,
        medicalReason: getValue<string | undefined>('medicalReason', 'Medical_Reason', 'medicalReason') as string | undefined,
        lastDateForAmount: getValue<string | undefined>('lastDateForAmount', 'Last_Date_For_Amount', 'lastDateForAmount') as string | undefined,
      };

      // If schYearId is provided but schYear is missing, fetch it from database
      if (normalizedData.schYearId && !normalizedData.schYear) {
        try {
          const yearData = await this.getActiveScholarshipYear();
          if (Array.isArray(yearData) && yearData.length > 0) {
            const yearRecord = yearData[0] as Record<string, unknown>;
            normalizedData.schYear =
              (getCaseInsensitiveValue<string>(
                yearRecord,
                'ScholarshipYear_Code',
              ) ??
                getCaseInsensitiveValue<string>(
                  yearRecord,
                  'ScholarshipYear_Name',
                )) ??
              '';
          }
        } catch (error) {
          this.logger.warn(
            'Failed to fetch scholarship year, using provided data',
            error,
          );
        }
      }

      // Validate required fields
      if (!normalizedData.schYearId || !normalizedData.schYear) {
        throw new BadRequestException('Scholarship year information is required');
      }

      // Generate application ID if not provided
      let applicationId = normalizedData.applicationId;
      if (!applicationId) {
        applicationId = await this.generateApplicationId(normalizedData.schYear);
      }

      // Call stored procedure
      await this.db.execute('USP_SAVESCHOLERSHIP', {
        Sch_YearId: normalizedData.schYearId,
        Sch_Year: normalizedData.schYear,
        Scholarship_For: normalizedData.scholarshipFor || '',
        Application_Id: applicationId,
        Applicant_Type: normalizedData.applicantType || '',
        Student_ID: normalizedData.studentId || '',
        Applicant_Name: normalizedData.applicantName.toUpperCase(),
        Father_Name: normalizedData.fatherName.toUpperCase(),
        Father_Occupation: normalizedData.fatherOccupation || '',
        Father_Occupation_Other: normalizedData.fatherOccupationOther || '',
        Father_Designation: normalizedData.fatherDesignation || '',
        Father_OfficeName: normalizedData.fatherOfficeName || '',
        Mother_Name: normalizedData.motherName.toUpperCase(),
        Mother_Occupation: normalizedData.motherOccupation || '',
        Mother_Occupation_Other: normalizedData.motherOccupationOther || '',
        Mother_Designation: normalizedData.motherDesignation || '',
        Mother_OfficeName: normalizedData.motherOfficeName || '',
        Address_Line1: normalizedData.addressLine1 || '',
        Address_Line2: normalizedData.addressLine2 || '',
        City: normalizedData.city || '',
        PinCode: normalizedData.pinCode || '',
        State: normalizedData.state || '',
        District: normalizedData.district || '',
        Country: normalizedData.country || '',
        Aadhaar_ID: normalizedData.aadhaarId,
        Pan_ID: normalizedData.panId || '',
        Mobile_Number: normalizedData.mobileNumber,
        Email: normalizedData.email,
        Date_Of_Birth: normalizedData.dateOfBirth,
        Gender: normalizedData.gender,
        Community: normalizedData.community || '',
        Caste: normalizedData.caste || '',
        Class_Studying: normalizedData.classStudying || '',
        Board_Of_Studying: normalizedData.boardOfStudying || '',
        Type_Of_Institution: normalizedData.typeOfInstitution || '',
        Cource_Of_Studying: normalizedData.courceOfStudying || '',
        Degree_Type: normalizedData.degreeType || '',
        Degree: normalizedData.degree || '',
        Other_Degree: normalizedData.otherDegree || '',
        Ph_D: normalizedData.phD || '',
        Specialization: normalizedData.specialization || '',
        Institution_Name: normalizedData.institutionName || '',
        University: normalizedData.university || '',
        Current_Year: normalizedData.currentYear || '',
        Current_Semester: normalizedData.currentSemester || '',
        Father_AnnualIncome: normalizedData.fatherAnnualIncome || '',
        Bank_Account_Number: normalizedData.bankAccountNumber || '',
        Bank_Name: normalizedData.bankName || '',
        Bank_Branch: normalizedData.bankBranch || '',
        IFSC_Code: normalizedData.ifscCode || '',
        RequestAmount: normalizedData.requestAmount || 0,
        Photo: normalizedData.photo || '',
        AppliedOtherScholarship: normalizedData.appliedOtherScholarship || '',
        Guardian_Name: normalizedData.guardianName || '',
        Guardian_Occupation: normalizedData.guardianOccupation || '',
        Guardian_Occupation_Other: normalizedData.guardianOccupationOther || '',
        Guardian_Designation: normalizedData.guardianDesignation || '',
        GuardianAnnulIncome: normalizedData.guardianAnnualIncome || '',
        Guardian_OfficeName: normalizedData.guardianOfficeName || '',
        Mother_AnnualIncome: normalizedData.motherAnnualIncome || '',
        Scholarship_Status: '',
        Scholarship_No: '',
        Payment_Mode: '',
        Payment_Date: '',
        NetBanking_RefNo: '',
        DDCheque_No: '',
        DDCheque_Date: '',
        User_ID: '',
      });

      // Update Tbl_UserMaster with personal details for Student users (first-time registration completion)
      // This updates User_Name from Applicant_Name for Student role users
      try {
        const studentRoleId = await this.getStudentRoleId();
        if (studentRoleId) {
          const updateUserQuery = `
            UPDATE Tbl_UserMaster
            SET 
              User_Name = @applicantName,
              Modified_Date = GETDATE(),
              Modified_By = @email
            WHERE User_ID = @email
            AND Role_Id = @studentRoleId
            AND (User_Name IS NULL OR User_Name = '' OR User_Name = User_ID)
          `;
          await this.db.query(updateUserQuery, {
            applicantName: normalizedData.applicantName.toUpperCase(),
            email: normalizedData.email,
            studentRoleId,
          });
          this.logger.log(`Updated User_Name in Tbl_UserMaster for Student user: ${normalizedData.email}`);
        } else {
          this.logger.warn('Student role not found, skipping User_Name update');
        }
      } catch (updateError) {
        // Log error but don't fail registration if user update fails
        this.logger.warn('Failed to update Tbl_UserMaster with personal details', updateError);
      }

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
          P.Scholarship_Suggest_Amount,
          P.Data_Date,
          UP.User_Name as Prepared_By
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        LEFT JOIN TBL_USERMASTER UP ON P.Prepared_By = UP.Id
        WHERE R.Email = @email
        ORDER BY R.Application_Id DESC
      `;

      const result = await this.db.query(query, { email });

      // Map results with case-insensitive field access
      const mappedResults = (result.recordset || []).map((row: Record<string, unknown>) => {
        const rowRecord = row as Record<string, unknown>;
        return {
          ...row,
          Applicant_Name: getCaseInsensitiveValue<string>(rowRecord, 'Applicant_Name') || '',
          Institution_Name: getCaseInsensitiveValue<string>(rowRecord, 'Institution_Name') || '',
          Data_Date: getCaseInsensitiveValue<Date | string>(rowRecord, 'Data_Date'),
          Prepared_By: getCaseInsensitiveValue<string>(rowRecord, 'Prepared_By') || '',
          Scholarship_No: getCaseInsensitiveValue<string>(rowRecord, 'Scholarship_No') || '',
          Status: getCaseInsensitiveValue<string>(rowRecord, 'Status') || 'Registered',
        };
      });

      return mappedResults;
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
      // Check for both admin users and Student users (identified by Role_Id)
      // IsActive and IsDeleted are bit type (1/0)
      const studentRoleId = await this.getStudentRoleId();
      let userQuery = `
        SELECT COUNT(*) as count
        FROM Tbl_UserMaster
        WHERE User_ID = @email
        AND Password IS NOT NULL
        AND Password != ''
        AND IsActive = 1
        AND (IsDeleted = 0 OR IsDeleted IS NULL)
      `;
      
      // If Student role exists, check for Student role OR users without role (admin users)
      // If Student role doesn't exist, check all users (backward compatibility)
      const params: { email: string; studentRoleId?: number } = { email };
      if (studentRoleId !== null) {
        userQuery += ` AND (Role_Id = @studentRoleId OR Role_Id IS NULL OR Role_Id = 0)`;
        params.studentRoleId = studentRoleId;
      }
      
      const userResult = await this.db.query<{ count: number }>(userQuery, params);
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
        // Create new user with Student role for user flow
        // Based on actual schema: IsActive, IsDeleted, Password_change are bit type (1/0)
        // Set IsActive = 1 to ensure user can login immediately
        // Role_Id identifies users from applicant (user flow) application
        const studentRoleId = await this.getStudentRoleId();
        
        if (studentRoleId === null) {
          this.logger.warn('Student role not found in T_ROLES. Creating user without role assignment.');
        }
        
        const insertQuery = studentRoleId !== null
          ? `
            INSERT INTO Tbl_UserMaster (
              User_ID,
              Password,
              Password_change,
              IsActive,
              IsDeleted,
              Role_Id,
              Created_Date,
              Created_By
            ) VALUES (
              @email,
              @password,
              1,
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
        
        const insertParams: { email: string; password: string; studentRoleId?: number } = {
          email,
          password: encryptedPassword,
        };
        
        if (studentRoleId !== null) {
          insertParams.studentRoleId = studentRoleId;
        }
        
        await this.db.query(insertQuery, insertParams);
        this.logger.log(`New Student user created and activated for: ${email}${studentRoleId !== null ? ` with Role_Id: ${studentRoleId}` : ' (without role assignment)'}`);
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
        // Handle case-insensitive field access (ISACTIVE vs IsActive, ISDELETED vs IsDeleted)
        const userUserId = getCaseInsensitiveValue<string>(user, 'User_ID') ?? '';
        const userIsActive = getCaseInsensitiveValue(user, 'IsActive');
        const userIsDeleted = getCaseInsensitiveValue(user, 'IsDeleted');
        const userPassword = getCaseInsensitiveValue<string>(user, 'Password') ?? '';
        const userRoleId = getCaseInsensitiveValue<number | null>(user, 'Role_Id') ?? null;

        this.logger.log(
          `User verification - Email: ${userUserId}, IsActive: ${String(userIsActive)} (type: ${typeof userIsActive}), IsDeleted: ${String(userIsDeleted)}, HasPassword: ${!!userPassword}, Role_Id: ${String(userRoleId)}`,
        );

        // Double-check: If IsActive is not 1, force update it
        const isActiveNumeric = toBoolean(userIsActive);

        if (!isActiveNumeric) {
          this.logger.warn(
            `IsActive is not set correctly for ${email}. Current value: ${String(userIsActive)}. Forcing update...`,
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
