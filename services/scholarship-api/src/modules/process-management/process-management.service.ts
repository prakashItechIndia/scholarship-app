import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface ProcessQueryParams {
  mainCategory?: string;
  key?: string;
  selectedStatusText?: string;
  fromDate?: string;
  toDate?: string;
  academicYearId?: number;
  tab?: string; // overview, documents, verify, suggest, approve, issue-amount
  page?: number;
  pageSize?: number;
}

interface VerifyApplicationData {
  applicationId: string;
  status: 'Verified' | 'Recheck' | 'Reject';
  remarks?: string;
  verifiedBy?: number;
}

interface SuggestApplicationData {
  applicationId: string;
  suggestedAmount: number;
  remarks?: string;
  suggestedBy?: number;
}

interface ApproveApplicationData {
  applicationId: string;
  approvedAmount: number;
  status: 'Approved' | 'Rejected';
  remarks?: string;
  approvedBy?: number;
}

interface IssueAmountData {
  applicationId: string;
  paymentMode: string; // DD, NEFT/RTGS, Cheque, UPI
  comments?: string;
  ddChequeNo?: string;
  ddChequeInFavor?: string;
  ddChequeDate?: string;
  issuedBy?: number;
}

/**
 * Helper function to convert 1/0 or '1'/'0' to boolean
 */
function toBoolean(value: unknown): boolean {
  return value === 1 || value === '1' || value === true || String(value).toLowerCase() === 'true';
}

/**
 * Helper function to map boolean fields in query results
 */
function mapBooleanFields(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const booleanFields = [
    'SuggestLinkEnable',
    'lblSuggested',
    'lblReject',
    'lblCompleted',
    'PrintLinkEnable',
    'lblNotCompleted',
    'lblSCReject',
    'ReVerifyLinkEnable',
    'VerifyLinkEnable',
    'lblVerified',
  ];

  return rows.map((row) => {
    const mappedRow = { ...row };
    booleanFields.forEach((field) => {
      if (field in mappedRow) {
        mappedRow[field] = toBoolean(mappedRow[field]);
      }
    });
    return mappedRow;
  });
}

@Injectable()
export class ProcessManagementService {
  private readonly logger = new Logger(ProcessManagementService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get applications for Overview tab
   * Matches GetAdminPanelLoadApprove from AjaxAdminPanelHome.aspx.cs
   */
  async getOverviewApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        selectedStatusText = '',
        fromDate = '',
        toDate = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Sch_Year,
          R.Scholarship_For,
          R.Application_Id,
          R.Applicant_Type,
          R.Student_ID,
          R.Applicant_Name,
          R.Guardian_Name,
          R.Father_Name,
          R.Aadhaar_ID,
          R.Pan_ID,
          R.Father_Occupation,
          R.Father_OfficeName,
          R.Mother_Name,
          R.Mother_Occupation,
          R.Mother_OfficeName,
          R.Address_Line1,
          R.Address_Line2,
          R.City,
          R.PinCode,
          R.State,
          R.District,
          R.Country,
          R.Mobile_Number,
          R.Email,
          R.Date_Of_Birth,
          R.Gender,
          R.Community,
          R.Caste,
          R.Class_Studying,
          R.Board_Of_Studying,
          R.Type_Of_Institution,
          R.Cource_Of_Studying,
          R.Degree_Type,
          R.Degree,
          R.Other_Degree,
          R.Ph_D,
          R.Specialization,
          R.Institution_Name,
          R.University,
          R.Current_Year,
          R.Current_Semester,
          R.Father_AnnualIncome,
          R.Bank_Account_Number,
          R.Bank_Name,
          R.Bank_Branch,
          R.IFSC_Code,
          P.Scholarship_Issued_AccNo,
          P.User_ID,
          P.Status,
          P.Scholarship_No,
          P.Update_Date,
          P.Scholarship_Approved_Amount,
          P.Scholarship_Suggest_Amount,
          P.Data_Date,
          UP.User_Name as Prepared_By,
          UV.User_Name as Verified_By,
          US.User_Name as Suggested_By,
          CASE P.Status
            WHEN 'Completed' THEN 1
            WHEN 'Registered' THEN 0
            WHEN 'Waiting' THEN 0
            WHEN 'Approved' THEN 0
            WHEN 'Rejected' THEN 0
            ELSE 0
          END as PrintLinkEnable,
          CASE P.Status
            WHEN 'Completed' THEN 0
            WHEN 'Registered' THEN 1
            WHEN 'Waiting' THEN 1
            WHEN 'Approved' THEN 1
            WHEN 'Rejected' THEN 1
            ELSE 0
          END as lblNotCompleted,
          CASE P.Scholar_Reject
            WHEN 'Rejected' THEN 1
            ELSE 0
          END as lblSCReject,
          CASE P.Status
            WHEN 'Registered' THEN '1'
            WHEN 'Approved' THEN '3'
            WHEN 'Waiting' THEN '2'
            ELSE '4'
          END as statuspriority
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        LEFT OUTER JOIN TBL_USERMASTER UP ON P.Prepared_By = UP.Id
        LEFT OUTER JOIN TBL_USERMASTER UV ON P.Verified_By = UV.Id
        LEFT OUTER JOIN TBL_USERMASTER US ON P.Suggested_By = US.Id
        WHERE 1=1
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      // Apply filters based on mainCategory
      if (mainCategory === 'Application No' && key) {
        query += ' AND R.Application_Id LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Student Id' && key) {
        query += ' AND R.Student_ID LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Aadhaar ID' && key) {
        query += ' AND R.Aadhaar_ID LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Name' && key) {
        query += ' AND R.Applicant_Name LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Mobile No' && key) {
        query += ' AND R.Mobile_Number LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Scholarship No' && key) {
        query += ' AND P.Scholarship_No LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Status' && selectedStatusText) {
        query += ' AND P.Status = @selectedStatusText';
        queryParams.selectedStatusText = selectedStatusText;
      } else if (mainCategory === 'Action Date' && fromDate && toDate && selectedStatusText) {
        if (selectedStatusText === 'Registered') {
          query += ' AND P.Data_Date >= @fromDate AND P.Data_Date <= @toDate AND P.Status = @selectedStatusText';
        } else if (selectedStatusText === 'Approved') {
          query += ' AND P.Approved_Date >= @fromDate AND P.Approved_Date <= @toDate AND P.Status = @selectedStatusText';
        } else if (selectedStatusText === 'Waiting') {
          query += ' AND P.Suggesred_Date >= @fromDate AND P.Suggesred_Date <= @toDate AND P.Status = @selectedStatusText';
        } else if (selectedStatusText === 'Completed') {
          query += ' AND P.Donated_Date >= @fromDate AND P.Donated_Date <= @toDate AND P.Status = @selectedStatusText';
        } else if (selectedStatusText === 'Rejected') {
          query += ' AND P.Update_Date >= @fromDate AND P.Update_Date <= @toDate AND P.Status = @selectedStatusText';
        }
        queryParams.fromDate = fromDate;
        queryParams.toDate = toDate;
        queryParams.selectedStatusText = selectedStatusText;
      }

      // Get total count - wrap the query in a subquery to count all rows
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id, statuspriority ASC';
      
      // Validate and sanitize pagination parameters
      const page = Math.max(1, Math.floor(Number(params.page) || 1));
      const pageSize = Math.max(1, Math.min(100, Math.floor(Number(params.pageSize) || 10))); // Max 100 items per page
      const offset = (page - 1) * pageSize;
      
      // Use validated integers for pagination (safe from SQL injection since they're validated numbers)
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      const mappedData = mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching overview applications', error);
      throw new BadRequestException('Failed to fetch applications');
    }
  }

  /**
   * Get applications for Documents tab
   * Shows applications with Registered status that need document upload
   */
  async getDocumentsApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Application_Id,
          R.Applicant_Name,
          R.Class_Studying,
          R.Institution_Name,
          R.Father_AnnualIncome,
          R.Mobile_Number,
          R.Father_Occupation,
          P.Scholarship_No,
          CASE 
            WHEN P.IsUpload_Status = '0' OR P.IsUpload_Status = '1' THEN 'Document Submitted'
            ELSE P.Status
          END as Status,
          P.IsUpload_Status
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status = 'Registered'
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      if (mainCategory === 'Application No' && key) {
        query += ' AND R.Application_Id LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Name' && key) {
        query += ' AND R.Applicant_Name LIKE @key';
        queryParams.key = `%${key}%`;
      } else if (mainCategory === 'Mobile No' && key) {
        query += ' AND R.Mobile_Number LIKE @key';
        queryParams.key = `%${key}%`;
      }

      // Get total count before adding ORDER BY
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id DESC';
      
      // Validate and sanitize pagination parameters
      const page = Math.max(1, Math.floor(Number(params.page) || 1));
      const pageSize = Math.max(1, Math.min(100, Math.floor(Number(params.pageSize) || 10))); // Max 100 items per page
      const offset = (page - 1) * pageSize;
      
      // Use validated integers for pagination (safe from SQL injection since they're validated numbers)
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      const mappedData = mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching documents applications', error);
      throw new BadRequestException('Failed to fetch documents applications');
    }
  }

  /**
   * Get applications for Verify tab
   * Matches AjaxDocumentVerification.aspx.cs - shows Registered applications ready for verification
   */
  async getVerifyApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Sch_Year,
          R.Scholarship_For,
          R.Application_Id,
          R.Applicant_Type,
          R.Student_ID,
          R.Applicant_Name,
          R.Guardian_Name,
          R.Father_Name,
          R.Aadhaar_ID,
          R.Pan_ID,
          R.Father_Occupation,
          R.Father_OfficeName,
          R.Mother_Name,
          R.Mother_Occupation,
          R.Mother_OfficeName,
          R.Address_Line1,
          R.Address_Line2,
          R.City,
          R.PinCode,
          R.State,
          R.District,
          R.Country,
          R.Mobile_Number,
          R.Email,
          R.Date_Of_Birth,
          R.Gender,
          R.Community,
          R.Caste,
          R.Class_Studying,
          R.Board_Of_Studying,
          R.Type_Of_Institution,
          R.Cource_Of_Studying,
          R.Degree_Type,
          R.Degree,
          R.Other_Degree,
          R.Ph_D,
          R.Specialization,
          R.Institution_Name,
          R.University,
          R.Current_Year,
          R.Current_Semester,
          R.Father_AnnualIncome,
          R.Bank_Account_Number,
          R.Bank_Name,
          R.Bank_Branch,
          R.IFSC_Code,
          P.Scholarship_Issued_AccNo,
          P.User_ID,
          CASE 
            WHEN P.IsVerify = '0' THEN 'Verified'
            WHEN P.IsVerify = '1' THEN 'Verified'
            WHEN P.IsVerify = '2' THEN 'Verify'
            ELSE P.Status
          END as Status,
          P.Update_Date,
          P.Scholarship_Id,
          P.Suggesred_Date,
          P.Verifed_Date,
          P.Scholarship_No,
          P.IsVerify,
          P.IsUpload_Status,
          CASE P.IsVerify
            WHEN '0' THEN 1
            WHEN '1' THEN 0
            WHEN '2' THEN 0
            ELSE 0
          END as ReVerifyLinkEnable,
          CASE P.IsVerify
            WHEN '0' THEN 0
            WHEN '1' THEN 0
            WHEN '2' THEN 1
            ELSE 0
          END as VerifyLinkEnable,
          CASE P.IsVerify
            WHEN '0' THEN 1
            WHEN '1' THEN 0
            WHEN '2' THEN 0
            ELSE 0
          END as lblVerified
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status IN ('Registered')
          AND (P.IsUpload_Status = '0' OR P.IsUpload_Status = '1')
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      if (key) {
        if (mainCategory === 'Application No') {
          query += ' AND R.Application_Id LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Name') {
          query += ' AND R.Applicant_Name LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Mobile No') {
          query += ' AND R.Mobile_Number LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Student Id') {
          query += ' AND R.Student_ID LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Aadhaar ID') {
          query += ' AND R.Aadhaar_ID LIKE @key';
          queryParams.key = `%${key}%`;
        }
      }

      // Get total count before adding ORDER BY
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id DESC';
      
      // Validate and sanitize pagination parameters
      const page = Math.max(1, Math.floor(Number(params.page) || 1));
      const pageSize = Math.max(1, Math.min(100, Math.floor(Number(params.pageSize) || 10))); // Max 100 items per page
      const offset = (page - 1) * pageSize;
      
      // Use validated integers for pagination (safe from SQL injection since they're validated numbers)
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      const mappedData = mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching verify applications', error);
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch verify applications: ${error.message}`,
        );
      }
      throw new BadRequestException('Failed to fetch verify applications');
    }
  }

  /**
   * Get applications for Suggest tab
   * Matches AjaxSuggestHome.aspx.cs - shows all applications (filtered by status if needed)
   * Applications ready for suggestion are those with Status='Registered' and IsVerify='1'
   */
  async getSuggestApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Sch_Year,
          R.Scholarship_For,
          R.Application_Id,
          R.Applicant_Type,
          R.Student_ID,
          R.Applicant_Name,
          R.Guardian_Name,
          R.Father_Name,
          R.Aadhaar_ID,
          R.Pan_ID,
          R.Father_Occupation,
          R.Father_OfficeName,
          R.Mother_Name,
          R.Mother_Occupation,
          R.Mother_OfficeName,
          R.Address_Line1,
          R.Address_Line2,
          R.City,
          R.PinCode,
          R.State,
          R.District,
          R.Country,
          R.Mobile_Number,
          R.Email,
          R.Date_Of_Birth,
          R.Gender,
          R.Community,
          R.Caste,
          R.Class_Studying,
          R.Board_Of_Studying,
          R.Type_Of_Institution,
          R.Cource_Of_Studying,
          R.Degree_Type,
          R.Degree,
          R.Other_Degree,
          R.Ph_D,
          R.Specialization,
          R.Institution_Name,
          R.University,
          R.Current_Year,
          R.Current_Semester,
          R.Father_AnnualIncome,
          R.Bank_Account_Number,
          R.Bank_Name,
          R.Bank_Branch,
          R.IFSC_Code,
          P.Scholarship_Issued_AccNo,
          P.User_ID,
          P.Status,
          P.Scholarship_No,
          P.Update_Date,
          P.DDCheque_No,
          P.Scholarship_Approved_Amount,
          P.DDCheque_In_Favor,
          P.Donated_Date,
          P.Scholar_Reject,
          P.Scholarship_Id,
          P.Scholarship_Suggest_Amount,
          P.Request_Amount as RequestAmount,
          CASE P.Status
            WHEN 'Registered' THEN '1'
            WHEN 'Approved' THEN '3'
            WHEN 'Waiting' THEN '2'
            ELSE '4'
          END as statuspriority,
          CASE P.Status
            WHEN 'Registered' THEN CONCAT('Suggest ', P.Scholarship_Id)
            ELSE CONCAT('Suggest ', (SELECT ISNULL(MAX(Scholarship_Id), 0) + 1 FROM t_Registration_Process WHERE Application_Id = R.Application_Id))
          END as SuggestText,
          CASE P.Status
            WHEN 'Registered' THEN P.Scholarship_Id
            ELSE (SELECT ISNULL(MAX(Scholarship_Id), 0) + 1 FROM t_Registration_Process WHERE Application_Id = R.Application_Id)
          END as SuggestScholarshipId,
          CASE P.Status
            WHEN 'Registered' THEN 1
            WHEN 'Waiting' THEN 0
            WHEN 'Rejected' THEN 0
            ELSE 1
          END as SuggestLinkEnable,
          CASE P.Status
            WHEN 'Waiting' THEN 0
            WHEN 'Registered' THEN 0
            WHEN 'Rejected' THEN 0
            ELSE 0
          END as lblSuggested,
          CASE P.Scholar_Reject
            WHEN 'Waiting' THEN 0
            WHEN 'Registered' THEN 0
            WHEN 'Rejected' THEN 1
            ELSE 0
          END as lblReject,
          CASE P.Status
            WHEN 'Completed' THEN 1
            WHEN 'Waiting' THEN 1
            WHEN 'Registered' THEN 0
            WHEN 'Rejected' THEN 0
            ELSE 0
          END as lblCompleted
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        JOIN T_Scholarship_Year SY ON R.Scholarship_Year_Id = SY.ScholarshipYear_Id
        WHERE 1=1
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      // Apply filters based on mainCategory
      if (key) {
        if (mainCategory === 'Application No') {
          query += ' AND R.Application_Id LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Name') {
          query += ' AND R.Applicant_Name LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Mobile No') {
          query += ' AND R.Mobile_Number LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Scholarship No') {
          query += ' AND P.Scholarship_No LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Student Id') {
          query += ' AND R.Student_ID LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Aadhaar ID') {
          query += ' AND R.Aadhaar_ID LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Cheque No') {
          query += ' AND P.DDCheque_No LIKE @key';
          queryParams.key = `%${key}%`;
        }
      }

      // Get total count before adding ORDER BY
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id ASC';
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const offset = (page - 1) * pageSize;
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      
      // Map boolean fields from 1/0 to true/false
      const mappedData = (result.recordset || []).map((row: Record<string, unknown>) => {
        const mappedRow = { ...row };
        // Convert 1/0 to boolean for suggest-related fields
        if ('SuggestLinkEnable' in mappedRow) {
          mappedRow.SuggestLinkEnable = Boolean(mappedRow.SuggestLinkEnable === 1 || mappedRow.SuggestLinkEnable === '1');
        }
        if ('lblSuggested' in mappedRow) {
          mappedRow.lblSuggested = Boolean(mappedRow.lblSuggested === 1 || mappedRow.lblSuggested === '1');
        }
        if ('lblReject' in mappedRow) {
          mappedRow.lblReject = Boolean(mappedRow.lblReject === 1 || mappedRow.lblReject === '1');
        }
        if ('lblCompleted' in mappedRow) {
          mappedRow.lblCompleted = Boolean(mappedRow.lblCompleted === 1 || mappedRow.lblCompleted === '1');
        }
        return mappedRow;
      });
      
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching suggest applications', error);
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch suggest applications: ${error.message}`,
        );
      }
      throw new BadRequestException('Failed to fetch suggest applications');
    }
  }

  /**
   * Get applications for Approve tab
   * Shows applications with Waiting, Approved, or Rejected status
   */
  async getApproveApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Application_Id,
          R.Applicant_Name,
          R.Class_Studying,
          R.Institution_Name,
          R.Father_AnnualIncome,
          R.Mobile_Number,
          R.Father_Occupation,
          R.Bank_Account_Number,
          P.Request_Amount as RequestAmount,
          P.Scholarship_No,
          P.Status,
          P.Scholarship_Suggest_Amount,
          P.Scholarship_Approved_Amount
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status IN ('Waiting', 'Approved', 'Rejected')
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      // Apply filters based on mainCategory
      if (key) {
        if (mainCategory === 'Application No') {
          query += ' AND R.Application_Id LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Name') {
          query += ' AND R.Applicant_Name LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Mobile No') {
          query += ' AND R.Mobile_Number LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Cheque No') {
          query += ' AND P.DDCheque_No LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Student Id') {
          query += ' AND R.Student_ID LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Aadhaar ID') {
          query += ' AND R.Aadhaar_ID LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Scholarship No') {
          query += ' AND P.Scholarship_No LIKE @key';
          queryParams.key = `%${key}%`;
        }
      }

      // Get total count before adding ORDER BY
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id DESC';
      
      // Validate and sanitize pagination parameters
      const page = Math.max(1, Math.floor(Number(params.page) || 1));
      const pageSize = Math.max(1, Math.min(100, Math.floor(Number(params.pageSize) || 10))); // Max 100 items per page
      const offset = (page - 1) * pageSize;
      
      // Use validated integers for pagination (safe from SQL injection since they're validated numbers)
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      const mappedData = mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching approve applications', error);
      throw new BadRequestException('Failed to fetch approve applications');
    }
  }

  /**
   * Get applications for Issue Amount tab
   * Shows applications with Approved status
   */
  async getIssueAmountApplications(params: ProcessQueryParams) {
    try {
      const {
        mainCategory = '',
        key = '',
        academicYearId = 0,
      } = params;

      let query = `
        SELECT
          R.Sch_Year,
          R.Scholarship_For,
          R.Application_Id,
          R.Applicant_Type,
          R.Student_ID,
          R.Applicant_Name,
          R.Guardian_Name,
          R.Father_Name,
          R.Aadhaar_ID,
          R.Pan_ID,
          R.Father_Occupation,
          R.Father_OfficeName,
          R.Mother_Name,
          R.Mother_Occupation,
          R.Mother_OfficeName,
          R.Address_Line1,
          R.Address_Line2,
          R.City,
          R.PinCode,
          R.State,
          R.District,
          R.Country,
          R.Mobile_Number,
          R.Email,
          R.Date_Of_Birth,
          R.Gender,
          R.Community,
          R.Caste,
          R.Class_Studying,
          R.Board_Of_Studying,
          R.Type_Of_Institution,
          R.Cource_Of_Studying,
          R.Degree_Type,
          R.Degree,
          R.Other_Degree,
          R.Ph_D,
          R.Specialization,
          R.Institution_Name,
          R.University,
          R.Current_Year,
          R.Current_Semester,
          R.Father_AnnualIncome,
          R.Bank_Account_Number,
          R.Bank_Name,
          R.Bank_Branch,
          R.IFSC_Code,
          P.Scholarship_Issued_AccNo,
          P.User_ID,
          P.Status,
          P.Scholarship_No,
          P.Update_Date,
          P.Scholarship_Id,
          P.Suggesred_Date,
          P.Scholar_Reject,
          P.DDCheque_No,
          P.Scholarship_Suggest_Amount,
          P.Scholarship_Approved_Amount,
          P.Request_Amount as RequestAmount
        FROM t_Registration R
        JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        JOIN T_Scholarship_Year SY ON R.Scholarship_Year_Id = SY.ScholarshipYear_Id
        WHERE P.Status = 'Approved'
      `;

      const queryParams: Record<string, unknown> = {};

      if (academicYearId && academicYearId > 0) {
        query += ' AND R.Scholarship_Year_Id = @academicYearId';
        queryParams.academicYearId = academicYearId;
      }

      if (key) {
        if (mainCategory === 'Application No') {
          query += ' AND R.Application_Id LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Name') {
          query += ' AND R.Applicant_Name LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Mobile No') {
          query += ' AND R.Mobile_Number LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Scholarship No') {
          query += ' AND P.Scholarship_No LIKE @key';
          queryParams.key = `%${key}%`;
        } else if (mainCategory === 'Cheque No') {
          query += ' AND P.DDCheque_No LIKE @key';
          queryParams.key = `%${key}%`;
        }
      }

      // Get total count before adding ORDER BY
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countSubquery`;
      const countResult = await this.db.query(countQuery, queryParams);
      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Apply ORDER BY and pagination
      query += ' ORDER BY R.Application_Id DESC';
      
      // Validate and sanitize pagination parameters
      const page = Math.max(1, Math.floor(Number(params.page) || 1));
      const pageSize = Math.max(1, Math.min(100, Math.floor(Number(params.pageSize) || 10))); // Max 100 items per page
      const offset = (page - 1) * pageSize;
      
      // Use validated integers for pagination (safe from SQL injection since they're validated numbers)
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

      const result = await this.db.query(query, queryParams);
      const mappedData = mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
      return {
        data: mappedData,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching issue amount applications', error);
      throw new BadRequestException('Failed to fetch issue amount applications');
    }
  }

  /**
   * Verify application - updates status to Verified/Recheck/Reject
   * Matches Verify.aspx.cs logic
   */
  async verifyApplication(data: VerifyApplicationData) {
    try {
      const { applicationId, status, remarks = '', verifiedBy } = data;

      if (status === 'Recheck' && !remarks.trim()) {
        throw new BadRequestException('Remarks are required for Recheck status');
      }

      if (status === 'Reject' && !remarks.trim()) {
        throw new BadRequestException('Remarks are required for Reject status');
      }

      let updateQuery = '';
      const updateParams: Record<string, unknown> = { applicationId };

      if (status === 'Verified') {
        updateQuery = `
          UPDATE t_Registration_Process
          SET
            Status = 'Registered',
            IsVerify = 1,
            IsUpload_Status = 1,
            Verified_By = @verifiedBy,
            Update_Date = GETDATE()
          WHERE Application_Id = @applicationId
        `;
        updateParams.verifiedBy = verifiedBy;
      } else if (status === 'Recheck') {
        updateQuery = `
          UPDATE t_Registration_Process
          SET
            Status = 'Registered',
            IsVerify = 0,
            IsUpload_Status = 0,
            Verified_By = @verifiedBy,
            Update_Date = GETDATE()
          WHERE Application_Id = @applicationId
        `;
        updateParams.verifiedBy = verifiedBy;
        // Store remarks in a separate table or field if available
      } else if (status === 'Reject') {
        updateQuery = `
          UPDATE t_Registration_Process
          SET
            Status = 'Rejected',
            Scholar_Reject = 'Rejected',
            Verified_By = @verifiedBy,
            Update_Date = GETDATE()
          WHERE Application_Id = @applicationId
        `;
        updateParams.verifiedBy = verifiedBy;
        // Store remarks in a separate table or field if available
      }

      await this.db.query(updateQuery, updateParams);

      return { message: `Application ${status.toLowerCase()} successfully` };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error verifying application', error);
      throw new BadRequestException('Failed to verify application');
    }
  }

  /**
   * Suggest amount - updates status to Waiting with suggested amount
   * Matches AjaxSuggestHome.aspx.cs logic
   */
  async suggestAmount(data: SuggestApplicationData) {
    try {
      const { applicationId, suggestedAmount, remarks = '', suggestedBy } = data;

      // Get current scholarship ID or create new one
      const getScholarshipIdQuery = `
        SELECT
          CASE Status
            WHEN 'Registered' THEN Scholarship_Id
            ELSE (SELECT MAX(Scholarship_Id) + 1 FROM t_Registration_Process WHERE Application_Id = @applicationId)
          END as SuggestScholarshipId
        FROM t_Registration_Process
        WHERE Application_Id = @applicationId
      `;
      const scholarshipResult = await this.db.query<{ SuggestScholarshipId: number }>(
        getScholarshipIdQuery,
        { applicationId },
      );
      const scholarshipId = scholarshipResult.recordset?.[0]?.SuggestScholarshipId || 1;

      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Status = 'Waiting',
          Scholarship_Suggest_Amount = @suggestedAmount,
          Suggested_By = @suggestedBy,
          Suggesred_Date = GETDATE(),
          Update_Date = GETDATE(),
          Scholarship_Id = @scholarshipId
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(updateQuery, {
        applicationId,
        suggestedAmount,
        suggestedBy,
        scholarshipId,
      });

      return { message: 'Amount suggested successfully' };
    } catch (error) {
      this.logger.error('Error suggesting amount', error);
      throw new BadRequestException('Failed to suggest amount');
    }
  }

  /**
   * Approve application - updates status to Approved/Rejected
   * Matches AjaxAdminPanelApprove.aspx.cs logic
   */
  async approveApplication(data: ApproveApplicationData) {
    try {
      const { applicationId, approvedAmount, status, remarks = '', approvedBy } = data;

      if (status === 'Rejected' && !remarks.trim()) {
        throw new BadRequestException('Remarks are required for rejection');
      }

      let updateQuery = '';
      const updateParams: Record<string, unknown> = {
        applicationId,
        approvedAmount,
        approvedBy,
      };

      if (status === 'Approved') {
        updateQuery = `
          UPDATE t_Registration_Process
          SET
            Status = 'Approved',
            Scholarship_Approved_Amount = @approvedAmount,
            Approved_By = @approvedBy,
            Approved_Date = GETDATE(),
            Update_Date = GETDATE()
          WHERE Application_Id = @applicationId
        `;
      } else if (status === 'Rejected') {
        updateQuery = `
          UPDATE t_Registration_Process
          SET
            Status = 'Rejected',
            Scholar_Reject = 'Rejected',
            Approved_By = @approvedBy,
            Update_Date = GETDATE()
          WHERE Application_Id = @applicationId
        `;
        // Store remarks in a separate table or field if available
      }

      await this.db.query(updateQuery, updateParams);

      return { message: `Application ${status.toLowerCase()} successfully` };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error approving application', error);
      throw new BadRequestException('Failed to approve application');
    }
  }

  /**
   * Issue amount - updates status to Completed with payment details
   * Matches ScholarshipFinal.aspx.cs logic
   */
  async issueAmount(data: IssueAmountData) {
    try {
      const {
        applicationId,
        paymentMode,
        comments = '',
        ddChequeNo = '',
        ddChequeInFavor = '',
        ddChequeDate = '',
        issuedBy,
      } = data;

      if (!paymentMode) {
        throw new BadRequestException('Payment mode is required');
      }

      // Get approved amount
      const getAmountQuery = `
        SELECT Scholarship_Approved_Amount
        FROM t_Registration_Process
        WHERE Application_Id = @applicationId
      `;
      const amountResult = await this.db.query<{ Scholarship_Approved_Amount: number }>(
        getAmountQuery,
        { applicationId },
      );
      const approvedAmount = amountResult.recordset?.[0]?.Scholarship_Approved_Amount || 0;

      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Status = 'Completed',
          Scholarship_Issued_Amount = @approvedAmount,
          Payment_Mode = @paymentMode,
          DDCheque_No = @ddChequeNo,
          DDCheque_In_Favor = @ddChequeInFavor,
          DDCheque_Date = @ddChequeDate,
          Donated_Date = GETDATE(),
          Update_Date = GETDATE(),
          Issued_By = @issuedBy
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(updateQuery, {
        applicationId,
        approvedAmount,
        paymentMode,
        ddChequeNo,
        ddChequeInFavor,
        ddChequeDate: ddChequeDate || null,
        issuedBy,
      });

      return { message: 'Amount issued successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error issuing amount', error);
      throw new BadRequestException('Failed to issue amount');
    }
  }

  /**
   * Get application history (View History) for a specific application
   * Returns paginated history from TBL_HISTORY table (matching old application)
   */
  async getApplicationHistory(
    applicationId: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    try {
      const validatedPage = Math.max(1, Math.floor(Number(page)));
      const validatedPageSize = Math.max(1, Math.min(100, Math.floor(Number(pageSize))));
      const offset = (validatedPage - 1) * validatedPageSize;

      // Query from TBL_HISTORY table (matching old application structure)
      // TBL_HISTORY columns: ID, Application_Id, Process, Action, Data_Date, User_ID
      // Display: S.No, Action (from Process), Process Undergone (from Action), Handled by (from User_ID/User_Name), Date
      const historyQuery = `
        SELECT
          H.ID,
          H.Application_Id,
          H.Process as Action,
          H.Action as ProcessUndergone,
          H.User_ID,
          FORMAT(H.Data_Date, 'dd/MM/yyyy hh:mm tt') as Date,
          COALESCE(U.User_Name, H.User_ID) as HandledBy
        FROM TBL_HISTORY H
        LEFT JOIN TBL_USERMASTER U ON H.User_ID = U.User_ID
        WHERE H.Application_Id = @applicationId
        ORDER BY H.Data_Date ASC, H.ID ASC
        OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
      `;

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM TBL_HISTORY
        WHERE Application_Id = @applicationId
      `;

      const queryParams = {
        applicationId,
        offset,
        pageSize: validatedPageSize,
      };

      const [historyResult, countResult] = await Promise.all([
        this.db.query(historyQuery, queryParams),
        this.db.query(countQuery, { applicationId }),
      ]);

      const total = (countResult.recordset?.[0] as { total?: number })?.total || 0;

      // Map results to match frontend expectations
      const mappedData = (historyResult.recordset || []).map((row: Record<string, unknown>, index: number) => {
        const rowRecord = row as Record<string, unknown>;
        return {
          id: Number(rowRecord.ID) || offset + index + 1,
          action: String(rowRecord.Action || ''),
          processUndergone: String(rowRecord.ProcessUndergone || ''),
          handledBy: String(rowRecord.HandledBy || rowRecord.User_ID || 'Admin'),
          date: String(rowRecord.Date || ''),
        };
      });

      return {
        data: mappedData,
        total: Number(total),
        page: Number(validatedPage),
        pageSize: Number(validatedPageSize),
      };
    } catch (error) {
      this.logger.error('Error fetching application history', error);
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to fetch application history: ${error.message}`);
      }
      throw new BadRequestException('Failed to fetch application history');
    }
  }

  /**
   * Get scholarship history (Previous Scholarship History) for a student
   * Uses stored procedure GetPreviousIssuedAmountDetails_ByAadhaarId (matching old application)
   */
  async getScholarshipHistory(applicationId: string) {
    try {
      // First, get the current application details to find Aadhaar and Pan
      const currentAppQuery = `
        SELECT 
          R.Aadhaar_Number,
          R.Pan_ID,
          R.Applicant_Name
        FROM t_Registration R
        WHERE R.Application_Id = @applicationId
      `;

      const currentAppResult = await this.db.query(currentAppQuery, { applicationId });
      const currentApp = currentAppResult.recordset?.[0] as {
        Aadhaar_Number?: string;
        Pan_ID?: string;
        Applicant_Name?: string;
      };

      if (!currentApp) {
        throw new BadRequestException('Application not found');
      }

      const aadhaarId = currentApp.Aadhaar_Number || '0';
      const panId = currentApp.Pan_ID || '0';

      // Get issued amount details using stored procedure (matching old app)
      const issuedAmountQuery = `
        EXEC GetPreviousIssuedAmountDetails_ByAadhaarId 
          @AadhaarID = @aadhaarId,
          @Pan_ID = @panId
      `;

      const issuedAmountResult = await this.db.query(issuedAmountQuery, {
        aadhaarId,
        panId,
      });

      // Get already applied list using stored procedure (matching old app)
      const alreadyAppliedQuery = `
        EXEC GetPreviousScholorshipApplied 
          @AadhaarID = @aadhaarId,
          @Pan_ID = @panId
      `;

      const alreadyAppliedResult = await this.db.query(alreadyAppliedQuery, {
        aadhaarId,
        panId,
      });

      // Format already applied list from stored procedure result
      const alreadyAppliedRows = alreadyAppliedResult.recordset || [];
      const alreadyApplied = alreadyAppliedRows
        .filter((row: { ScholarshipYear_Code?: string }) => row.ScholarshipYear_Code !== 'Total')
        .map((row: { ScholarshipYear_Code?: string; Application_Id?: string }) => {
          const year = row.ScholarshipYear_Code || '';
          const appId = row.Application_Id || '';
          // Format: "2018 ( AF1810636 ), 2019 ( AF1910749 )"
          return `${year} ( ${appId} )`;
        })
        .join(', ') || 'No previous applications';

      // Format issued history from stored procedure result
      const issuedHistoryRows = issuedAmountResult.recordset || [];
      const issuedHistory = issuedHistoryRows
        .filter((row: { ScholarshipYear_Code?: string }) => row.ScholarshipYear_Code !== 'Total')
        .map((row: {
          ScholarshipYear_Code?: string;
          Scholarship_No?: string;
          Scholarship_Issued_Amount?: number;
        }) => ({
          year: `${row.ScholarshipYear_Code || ''} ( ${row.Scholarship_No || ''} )`,
          amount: String(row.Scholarship_Issued_Amount || '0'),
        }));

      return {
        applicationNo: applicationId,
        studentName: currentApp.Applicant_Name || '',
        alreadyApplied,
        issuedHistory,
      };
    } catch (error) {
      this.logger.error('Error fetching scholarship history', error);
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to fetch scholarship history: ${error.message}`);
      }
      throw new BadRequestException('Failed to fetch scholarship history');
    }
  }
}

