import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface GetApplicationsFilter {
  mainCategory?: string;
  key?: string;
  selectedStatusText?: string;
  fromDate?: string;
  toDate?: string;
  acyearId?: number;
}

export interface ApplicationRecord {
  Application_Id: string;
  Applicant_Name: string;
  Student_ID?: string;
  Aadhaar_ID?: string;
  Pan_ID?: string;
  Mobile_Number?: string;
  Email?: string;
  Status: string;
  Scholarship_No?: string;
  [key: string]: unknown;
}

@Injectable()
export class AdminPanelService {
  private readonly logger = new Logger(AdminPanelService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get applications for Overview module
   * Matches GetAdminPanelLoadApprove from AjaxAdminPanelHome.aspx.cs
   */
  async getOverviewApplications(filter: GetApplicationsFilter) {
    const {
      mainCategory = '',
      key = '',
      selectedStatusText = '',
      fromDate = '',
      toDate = '',
      acyearId = 0,
    } = filter;

    let query = `
      SELECT
        R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
        R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID, R.Pan_ID,
        R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
        R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
        R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
        R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
        R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
        R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
        R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
        R.IFSC_Code,
        P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Update_Date, P.Scholar_Reject,
        P.Scholarship_No, P.Scholarship_Id,
        UP.User_Name as Prepared_By,
        UV.User_Name as Verified_By,
        US.User_Name as Suggested_By,
        CASE P.Status
          WHEN 'Completed' THEN 'True'
          WHEN 'Registered' THEN 'False'
          WHEN 'Waiting' THEN 'False'
          WHEN 'Approved' THEN 'False'
          WHEN 'Rejected' THEN 'False'
          ELSE 'False'
        END as PrintLinkEnable,
        CASE P.Status
          WHEN 'Completed' THEN 'False'
          WHEN 'Registered' THEN 'True'
          WHEN 'Waiting' THEN 'True'
          WHEN 'Approved' THEN 'True'
          WHEN 'Rejected' THEN 'True'
          ELSE 'False'
        END as lblNotCompleted,
        CASE P.Scholar_Reject
          WHEN 'Rejected' THEN 'true'
          ELSE 'false'
        END as lblSCReject,
        CASE P.Status
          WHEN 'Registered' THEN '1'
          WHEN 'Approved' THEN '3'
          WHEN 'Waiting' THEN '2'
          WHEN '  ' THEN '4'
          ELSE ''
        END as statuspriority
      FROM t_Registration R
      JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id
      LEFT OUTER JOIN TBL_USERMASTER UP ON P.Prepared_By = UP.Id
      LEFT OUTER JOIN TBL_USERMASTER UV ON P.Verified_By = UV.Id
      LEFT OUTER JOIN TBL_USERMASTER US ON P.Suggested_By = US.Id,
      T_Scholarship_Year SY
      WHERE 1=1
    `;

    const params: Record<string, unknown> = {};

    if (acyearId !== 0) {
      query += ` AND SY.ScholarshipYear_Id = R.Scholarship_Year_Id AND R.Scholarship_Year_Id = @acyearId`;
      params.acyearId = acyearId;
    }

    // Build WHERE clause based on mainCategory
    if (mainCategory === 'Application No') {
      query += ` AND R.Application_Id LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Student Id') {
      query += ` AND R.Student_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Aadhaar ID') {
      query += ` AND R.Aadhaar_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Name') {
      query += ` AND R.Applicant_Name LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Mobile No') {
      query += ` AND R.Mobile_Number LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Scholarship No') {
      query += ` AND P.Scholarship_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Status') {
      query += ` AND P.Status = @selectedStatusText`;
      params.selectedStatusText = selectedStatusText;
    } else if (mainCategory === 'Action Date') {
      if (selectedStatusText === 'Registered') {
        query += ` AND P.Data_Date >= @fromDate AND P.Data_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Approved') {
        query += ` AND P.Approved_Date >= @fromDate AND P.Approved_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Waiting') {
        query += ` AND P.Suggesred_Date >= @fromDate AND P.Suggesred_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Completed') {
        query += ` AND P.Donated_Date >= @fromDate AND P.Donated_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Rejected') {
        query += ` AND P.Update_Date >= @fromDate AND P.Update_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      }
    }

    query += ` ORDER BY R.Application_Id, statuspriority ASC`;

    try {
      const result = await this.db.execute<ApplicationRecord>('sp_ExecuteSql', {
        Statement: query,
      });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching overview applications', error);
      throw new BadRequestException('Failed to fetch applications');
    }
  }

  /**
   * Get applications for Process/Documents module
   * Matches GetAdminPanelLoadProcess from AjaxAdminPanelProcess.aspx.cs
   */
  async getProcessApplications(filter: GetApplicationsFilter) {
    const { mainCategory = '', key = '', acyearId = 0 } = filter;

    let query = `
      SELECT
        R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
        R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID, R.Pan_ID,
        R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
        R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
        R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
        R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
        R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
        R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
        R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
        R.IFSC_Code,
        P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Update_Date, P.Scholarship_Id,
        P.Suggesred_Date, P.Scholar_Reject, P.DDCheque_No,
        CASE P.Status
          WHEN 'Registered' THEN P.Scholarship_Id
          ELSE (SELECT MAX(Scholarship_Id) + 1 as Id FROM t_Registration_Process WHERE Application_Id = R.Application_Id)
        END as SuggestScholarshipId,
        CASE P.Status
          WHEN 'Registered' THEN CONCAT('Suggest-', P.Scholarship_Id)
          ELSE CONCAT('Suggest-', (SELECT MAX(Scholarship_Id) + 1 as Id FROM t_Registration_Process WHERE Application_Id = R.Application_Id))
        END as SuggestText,
        CASE P.Status
          WHEN 'Registered' THEN 'True'
          WHEN 'Waiting' THEN 'False'
          WHEN 'Rejected' THEN 'False'
          ELSE 'True'
        END as SuggestLinkEnable,
        CASE P.Status
          WHEN 'Waiting' THEN 'False'
          WHEN 'Registered' THEN 'False'
          WHEN 'Rejected' THEN 'False'
          ELSE 'False'
        END as lblSuggested,
        CASE P.Scholar_Reject
          WHEN 'Waiting' THEN 'False'
          WHEN 'Registered' THEN 'False'
          WHEN 'Rejected' THEN 'True'
          ELSE 'False'
        END as lblReject,
        CASE P.Status
          WHEN 'Completed' THEN 'True'
          WHEN 'Waiting' THEN 'True'
          WHEN 'Registered' THEN 'False'
          WHEN 'Rejected' THEN 'False'
          ELSE 'False'
        END as lblCompleted
      FROM t_Registration R
      JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id,
      T_Scholarship_Year SY
      WHERE 1=1
    `;

    const params: Record<string, unknown> = {};

    if (mainCategory === 'Scholarship No') {
      query += ` AND P.Scholarship_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Cheque No') {
      query += ` AND P.DDCheque_No LIKE @key`;
      params.key = `%${key}%`;
    } else {
      query += ` AND P.IsUpload_Status = '0' AND P.IsVerify = '0'`;

      if (mainCategory === 'Application No') {
        query += ` AND R.Application_Id LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Name') {
        query += ` AND R.Applicant_Name LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Mobile No') {
        query += ` AND R.Mobile_Number LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Student Id') {
        query += ` AND R.Student_ID LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Aadhaar ID') {
        query += ` AND R.Aadhaar_ID LIKE @key`;
        params.key = `%${key}%`;
      }
    }

    if (acyearId !== 0) {
      query += ` AND SY.ScholarshipYear_Id = R.Scholarship_Year_Id AND R.Scholarship_Year_Id = @acyearId`;
      params.acyearId = acyearId;
    }

    query += ` ORDER BY SuggestLinkEnable DESC`;

    try {
      const result = await this.db.execute<ApplicationRecord>('sp_ExecuteSql', {
        Statement: query,
      });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching process applications', error);
      throw new BadRequestException('Failed to fetch process applications');
    }
  }

  /**
   * Get applications for Suggest module
   * Matches GetAdminPanelLoadApprove from AjaxSuggestHome.aspx.cs
   */
  async getSuggestApplications(filter: GetApplicationsFilter) {
    const {
      mainCategory = '',
      key = '',
      selectedStatusText = '',
      fromDate = '',
      toDate = '',
      acyearId = 0,
    } = filter;

    let query = `
      SELECT
        R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
        R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID, R.Pan_ID,
        R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
        R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
        R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
        R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
        R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
        R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
        R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
        R.IFSC_Code,
        P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Scholarship_No, P.Update_Date,
        P.DDCheque_No, P.Scholarship_Approved_Amount, P.DDCheque_In_Favor, P.Donated_Date,
        P.Scholar_Reject, P.Scholarship_Id,
        CASE P.Status
          WHEN 'Registered' THEN '1'
          WHEN 'Approved' THEN '3'
          WHEN 'Waiting' THEN '2'
          WHEN '  ' THEN '4'
          ELSE ''
        END as statuspriority
      FROM t_Registration R
      JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id
      JOIN T_Scholarship_Year SY ON R.Scholarship_Year_Id = SY.ScholarshipYear_Id
      WHERE 1=1
    `;

    const params: Record<string, unknown> = {};

    if (acyearId !== 0) {
      query += ` AND R.Scholarship_Year_Id = @acyearId`;
      params.acyearId = acyearId;
    }

    if (mainCategory === 'Application No') {
      query += ` AND R.Application_Id LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Name') {
      query += ` AND R.Applicant_Name LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Mobile No') {
      query += ` AND R.Mobile_Number LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Scholarship No') {
      query += ` AND P.Scholarship_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Student Id') {
      query += ` AND R.Student_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Aadhaar ID') {
      query += ` AND R.Aadhaar_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Cheque No') {
      query += ` AND P.DDCheque_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Status') {
      query += ` AND P.Status = @selectedStatusText`;
      params.selectedStatusText = selectedStatusText;
    } else if (mainCategory === 'Action Date') {
      if (selectedStatusText === 'Registered') {
        query += ` AND P.Data_Date >= @fromDate AND P.Data_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Approved') {
        query += ` AND P.Approved_Date >= @fromDate AND P.Approved_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Waiting') {
        query += ` AND P.Suggesred_Date >= @fromDate AND P.Suggesred_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Completed') {
        query += ` AND P.Donated_Date >= @fromDate AND P.Donated_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      } else if (selectedStatusText === 'Rejected') {
        query += ` AND P.Update_Date >= @fromDate AND P.Update_Date <= @toDate AND P.Status = @selectedStatusText`;
        params.fromDate = fromDate;
        params.toDate = toDate;
        params.selectedStatusText = selectedStatusText;
      }
    }

    query += ` ORDER BY Application_Id ASC`;

    try {
      const result = await this.db.execute<ApplicationRecord>('sp_ExecuteSql', {
        Statement: query,
      });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching suggest applications', error);
      throw new BadRequestException('Failed to fetch suggest applications');
    }
  }

  /**
   * Get applications for Verify module
   * Matches GetAdminPanelLoadProcess from AjaxDocumentVerification.aspx.cs
   */
  async getVerifyApplications(filter: GetApplicationsFilter) {
    const { mainCategory = '', key = '', acyearId = 0 } = filter;

    let query = `
      SELECT
        R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
        R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID, R.Pan_ID,
        R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
        R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
        R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
        R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
        R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
        R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
        R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
        R.IFSC_Code,
        P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Update_Date, P.Scholarship_Id,
        P.Suggesred_Date, P.Verifed_Date,
        CASE P.IsVerify
          WHEN '0' THEN 'False'
          WHEN '1' THEN 'True'
          WHEN '2' THEN 'False'
          ELSE 'False'
        END as ReVerifyLinkEnable,
        CASE P.IsVerify
          WHEN '0' THEN 'False'
          WHEN '1' THEN 'False'
          WHEN '2' THEN 'True'
          ELSE 'False'
        END as VerifyLinkEnable,
        CASE P.IsVerify
          WHEN '0' THEN 'True'
          WHEN '1' THEN 'False'
          WHEN '2' THEN 'False'
          ELSE 'False'
        END as lblVerified
      FROM t_Registration R
      JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id,
      T_Scholarship_Year SY
      WHERE P.Status IN ('Registered') AND (P.IsUpload_Status = '0' OR P.IsUpload_Status = '1')
    `;

    const params: Record<string, unknown> = {};

    if (mainCategory === 'Application No') {
      query += ` AND R.Application_Id LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Name') {
      query += ` AND R.Applicant_Name LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Mobile No') {
      query += ` AND R.Mobile_Number LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Cheque No') {
      query += ` AND P.DDCheque_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Student Id') {
      query += ` AND R.Student_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Aadhaar ID') {
      query += ` AND R.Aadhaar_ID LIKE @key`;
      params.key = `%${key}%`;
    }

    if (acyearId !== 0) {
      query += ` AND SY.ScholarshipYear_Id = R.Scholarship_Year_Id AND R.Scholarship_Year_Id = @acyearId`;
      params.acyearId = acyearId;
    }

    query += ` ORDER BY VerifyLinkEnable DESC`;

    try {
      const result = await this.db.execute<ApplicationRecord>('sp_ExecuteSql', {
        Statement: query,
      });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching verify applications', error);
      throw new BadRequestException('Failed to fetch verify applications');
    }
  }

  /**
   * Get applications for Approve module
   * Matches GetAdminPanelLoadProcess from AjaxAdminPanelApprove.aspx.cs
   */
  async getApproveApplications(filter: GetApplicationsFilter, roleId: number) {
    const { mainCategory = '', key = '', acyearId = 0 } = filter;

    let query = `
      SELECT
        R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
        R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID, R.Pan_ID,
        R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
        R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
        R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
        R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
        R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
        R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
        R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
        R.IFSC_Code,
        P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Update_Date, P.Scholar_Reject, P.Scholarship_Id,
        CONCAT('Approve-', P.Scholarship_Id) as ApproveText,
        CASE P.Status
          WHEN 'Registered' THEN 'false'
          WHEN 'Approved' THEN 'false'
          WHEN 'Waiting' THEN 'true'
          ELSE 'false'
        END as ProcessLinkText
    `;

    if (roleId === 7) {
      query += `,
        CASE P.Status WHEN 'Rejected' THEN 'true' ELSE 'false' END as RejectApprovalLinkText,
        CASE P.Status WHEN 'Rejected' THEN 'False' ELSE 'false' END as lblRejected,
        CASE P.Status
          WHEN 'Registered' THEN 'false'
          WHEN 'Approved' THEN 'true'
          WHEN 'Waiting' THEN 'false'
          WHEN 'Completed' THEN 'false'
          ELSE 'false'
        END as ApprovedOverrideLinkText,
        CASE P.Status
          WHEN 'Registered' THEN 'false'
          WHEN 'Approved' THEN 'False'
          WHEN 'Waiting' THEN 'false'
          WHEN 'Completed' THEN 'false'
          ELSE 'false'
        END as lblApproved
      `;
    } else {
      query += `,
        CASE P.Status WHEN 'Rejected' THEN 'false' ELSE 'false' END as RejectApprovalLinkText,
        CASE P.Status WHEN 'Rejected' THEN 'true' ELSE 'false' END as lblRejected,
        CASE P.Status WHEN 'Registered' THEN 'false' ELSE 'false' END as ApprovedOverrideLinkText,
        CASE P.Status
          WHEN 'Registered' THEN 'false'
          WHEN 'Approved' THEN 'true'
          WHEN 'Waiting' THEN 'false'
          WHEN 'Completed' THEN 'false'
          ELSE 'false'
        END as lblApproved
      `;
    }

    query += `
      FROM t_Registration R
      JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id,
      T_Scholarship_Year SY
      WHERE P.Status IN ('Waiting', 'Approved', 'Rejected')
    `;

    const params: Record<string, unknown> = {};

    if (mainCategory === 'Application No') {
      query += ` AND R.Application_Id LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Name') {
      query += ` AND R.Applicant_Name LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Mobile No') {
      query += ` AND R.Mobile_Number LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Cheque No') {
      query += ` AND P.DDCheque_No LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Student Id') {
      query += ` AND R.Student_ID LIKE @key`;
      params.key = `%${key}%`;
    } else if (mainCategory === 'Aadhaar ID') {
      query += ` AND R.Aadhaar_ID LIKE @key`;
      params.key = `%${key}%`;
    }

    if (acyearId !== 0) {
      query += ` AND SY.ScholarshipYear_Id = R.Scholarship_Year_Id AND R.Scholarship_Year_Id = @acyearId`;
      params.acyearId = acyearId;
    }

    query += ` ORDER BY ProcessLinkText DESC`;

    try {
      const result = await this.db.execute<ApplicationRecord>('sp_ExecuteSql', {
        Statement: query,
      });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching approve applications', error);
      throw new BadRequestException('Failed to fetch approve applications');
    }
  }

  /**
   * Verify document - Update IsVerify status
   */
  async verifyDocument(
    applicationId: string,
    scholarshipId: number,
    isVerify: string,
    verifiedBy: number,
    _remarks?: string,
  ) {
    try {
      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          IsVerify = @isVerify,
          Verifed_Date = GETDATE(),
          Verified_By = @verifiedBy,
          Update_Date = GETDATE()
        WHERE Application_Id = @applicationId AND Scholarship_Id = @scholarshipId
      `;

      await this.db.query(updateQuery, {
        isVerify,
        verifiedBy,
        applicationId,
        scholarshipId,
      });

      return { message: 'Document verified successfully' };
    } catch (error) {
      this.logger.error('Error verifying document', error);
      throw new BadRequestException('Failed to verify document');
    }
  }

  /**
   * Suggest amount - Update suggested amount
   */
  async suggestAmount(
    applicationId: string,
    scholarshipId: number,
    suggestedAmount: number,
    suggestedBy: number,
    _remarks?: string,
  ) {
    try {
      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Scholarship_Suggest_Amount = @suggestedAmount,
          Suggesred_Date = GETDATE(),
          Suggested_By = @suggestedBy,
          Status = 'Waiting',
          Update_Date = GETDATE()
        WHERE Application_Id = @applicationId AND Scholarship_Id = @scholarshipId
      `;

      await this.db.query(updateQuery, {
        suggestedAmount,
        suggestedBy,
        applicationId,
        scholarshipId,
      });

      return { message: 'Amount suggested successfully' };
    } catch (error) {
      this.logger.error('Error suggesting amount', error);
      throw new BadRequestException('Failed to suggest amount');
    }
  }

  /**
   * Approve application - Update approved amount and status
   */
  async approveApplication(
    applicationId: string,
    scholarshipId: number,
    approvedAmount: number,
    _approvedBy: number,
    _remarks?: string,
  ) {
    try {
      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Scholarship_Approved_Amount = @approvedAmount,
          Approved_Date = GETDATE(),
          Status = 'Approved',
          Update_Date = GETDATE()
        WHERE Application_Id = @applicationId AND Scholarship_Id = @scholarshipId
      `;

      await this.db.query(updateQuery, {
        approvedAmount,
        applicationId,
        scholarshipId,
      });

      return { message: 'Application approved successfully' };
    } catch (error) {
      this.logger.error('Error approving application', error);
      throw new BadRequestException('Failed to approve application');
    }
  }

  /**
   * Reject application
   */
  async rejectApplication(
    applicationId: string,
    scholarshipId: number,
    _rejectedBy: number,
    _remarks: string,
  ) {
    try {
      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Scholar_Reject = 'Rejected',
          Status = 'Rejected',
          Update_Date = GETDATE()
        WHERE Application_Id = @applicationId AND Scholarship_Id = @scholarshipId
      `;

      await this.db.query(updateQuery, {
        applicationId,
        scholarshipId,
      });

      return { message: 'Application rejected successfully' };
    } catch (error) {
      this.logger.error('Error rejecting application', error);
      throw new BadRequestException('Failed to reject application');
    }
  }

  /**
   * Issue amount - Final disbursement
   */
  async issueAmount(
    applicationId: string,
    scholarshipId: number,
    paymentMode: string,
    ddChequeNo?: string,
    ddChequeDate?: string,
    ddChequeInFavor?: string,
    _issuedBy?: number,
    _comments?: string,
  ) {
    try {
      const updateQuery = `
        UPDATE t_Registration_Process
        SET
          Payment_Mode = @paymentMode,
          DDCheque_No = @ddChequeNo,
          DDCheque_Date = @ddChequeDate,
          DDCheque_In_Favor = @ddChequeInFavor,
          Donated_Date = GETDATE(),
          Status = 'Completed',
          Update_Date = GETDATE()
        WHERE Application_Id = @applicationId AND Scholarship_Id = @scholarshipId
      `;

      await this.db.query(updateQuery, {
        paymentMode,
        ddChequeNo: ddChequeNo || null,
        ddChequeDate: ddChequeDate || null,
        ddChequeInFavor: ddChequeInFavor || null,
        applicationId,
        scholarshipId,
      });

      return { message: 'Amount issued successfully' };
    } catch (error) {
      this.logger.error('Error issuing amount', error);
      throw new BadRequestException('Failed to issue amount');
    }
  }

  /**
   * Get previous scholarship details by Aadhaar ID and PAN ID
   * Matches fncBindIssuedAmount from clsCommon.cs
   */
  async getPreviousScholarshipDetails(aadhaarId: string, panId: string) {
    try {
      const result = await this.db.execute(
        'GetPreviousIssuedAmountDetails_ByAadhaarId',
        {
          AadhaarID: aadhaarId || '0',
          Pan_ID: panId || '0',
        },
      );

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching previous scholarship details', error);
      throw new BadRequestException(
        'Failed to fetch previous scholarship details',
      );
    }
  }
}
