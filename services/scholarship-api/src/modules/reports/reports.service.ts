import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface CategoriesReportFilter {
  academicYear?: number;
  mainCategory?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  amount?: string;
  gender?: string;
  issuedTo?: string;
  sairamCategory?: string;
  institutionName?: string;
  parentOffice?: string;
  favourCategory?: string;
  favourGroup?: string;
  keyword?: string;
}

interface ScholarshipIssuedReportFilter {
  fromDate?: string;
  toDate?: string;
  institutionId?: number;
  strInstitution?: string;
  chequeInFavorType?: string;
  intIssuedBy?: number;
  strIssuedBy?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get categories wise report
   * Matches report generation from SubReportForCategories.aspx
   * Uses stored procedures: USP_GetReportDump, USP_GetReportApproved_Waiting_Status, USP_GetReport_Registered
   */
  async getCategoriesWiseReport(filter: CategoriesReportFilter) {
    try {
      const params: Record<string, unknown> = {};
      let result;

      // Normalize status to handle case-insensitive comparison
      const normalizedStatus = filter.status
        ? filter.status.charAt(0).toUpperCase() +
          filter.status.slice(1).toLowerCase()
        : null;

      // If status is "Approved" or "Waiting", use USP_GetReportApproved_Waiting_Status
      // Note: This stored procedure only accepts Status and ScholarshipYearId parameters
      // Keyword filtering is not supported for this stored procedure
      if (normalizedStatus === 'Approved' || normalizedStatus === 'Waiting') {
        params.Status = normalizedStatus;
        params.ScholarshipYearId = filter.academicYear || null;
        result = await this.db.execute(
          'USP_GetReportApproved_Waiting_Status',
          params,
        );
      }
      // If status is "Registered", use USP_GetReport_Registered
      else if (normalizedStatus === 'Registered') {
        params.Status = normalizedStatus;
        params.ScholarshipYearId = filter.academicYear || null;
        result = await this.db.execute('USP_GetReport_Registered', params);
      }
      // Otherwise, use USP_GetReportDump with all filters
      else {
        params.MainCategory = filter.mainCategory || null;
        params.ScholarshipYearId = filter.academicYear || null;
        params.SairamCategory = filter.sairamCategory || null;
        params.Status = normalizedStatus || null;
        params.FromDate = filter.fromDate || null;
        params.ToDate = filter.toDate || null;
        params.Amount = filter.amount || null;
        params.Gender = filter.gender || null;
        params.IssuedTo = filter.issuedTo || null;
        params.ParentOccupation = filter.parentOffice || null;
        params.FavourCategory = filter.favourCategory || null;
        params.FavourGroup = filter.favourGroup || null;
        params.InstitutionName = filter.institutionName || null;

        result = await this.db.execute('USP_GetReportDump', params);
      }

      return (
        ((result as { recordset: Record<string, unknown>[] }).recordset ||
          []) as Record<string, unknown>[]
      );
    } catch (error) {
      this.logger.error('Error generating categories report', error);
      throw new BadRequestException('Failed to generate categories report');
    }
  }

  /**
   * Convert date from DD/MM/YYYY to MM/DD/YYYY format
   * Matches old app's date conversion logic for stored procedures
   */
  private convertDateFormat(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    try {
      // Parse DD/MM/YYYY format (from frontend)
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        // Return MM/DD/YYYY format (for SQL Server stored procedures)
        return `${month}/${day}/${year}`;
      }
      return dateStr; // Return as-is if format doesn't match
    } catch (error) {
      this.logger.warn(`Failed to convert date format: ${dateStr}`, error);
      return dateStr;
    }
  }

  /**
   * Get scholarship issued report
   * Matches SubReportForScholarshipIssued.aspx
   * Uses raw SQL query instead of stored procedure
   */
  async getScholarshipIssuedReport(filter: ScholarshipIssuedReportFilter) {
    try {
      // Convert dates from DD/MM/YYYY to MM/DD/YYYY format (as per old app)
      const fromDate = this.convertDateFormat(filter.fromDate);
      const toDate = this.convertDateFormat(filter.toDate);

      let query = `
        SELECT
          R.Application_Id,
          R.Aadhaar_ID,
          R.Applicant_Name,
          R.Student_ID,
          R.Class_Studying,
          R.Institution_Name,
          R.Father_Name,
          R.Father_OfficeName,
          R.Mother_Name,
          R.Mother_OfficeName,
          R.Guardian_Name,
          R.Guardian_OfficeName,
          R.Gender,
          P.DDCheque_In_Favor,
          P.Scholarship_Approved_Amount,
          P.Scholarship_Approved_Amount as Issued_Amount,
          P.Scholarship_No,
          P.Scholarship_No as Scholarship,
          P.DDCheque_No,
          P.Donated_Date,
          R.Bank_Name,
          R.Application_Id as Applied_Date,
          SY.ScholarshipYear_Name as Scholarship_Year,
          R.Scholarship_For,
          P.Status
        FROM t_Registration R
        INNER JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        INNER JOIN T_Scholarship_Year SY ON SY.ScholarshipYear_Id = R.Scholarship_Year_Id
        WHERE P.Status IN ('Approved', 'Completed')
          AND P.Donated_Date IS NOT NULL
      `;

      const queryParams: Record<string, unknown> = {};

      // Add date filters if provided
      if (fromDate) {
        query += ` AND CONVERT(DATE, P.Donated_Date) >= CONVERT(DATE, @fromDate, 101)`;
        queryParams.fromDate = fromDate;
      }

      if (toDate) {
        query += ` AND CONVERT(DATE, P.Donated_Date) <= CONVERT(DATE, @toDate, 101)`;
        queryParams.toDate = toDate;
      }

      // Add institution filter
      if (filter.institutionId) {
        query += ` AND R.Institution_Name = (SELECT Institution_Name FROM T_Institution WHERE Institution_Id = @institutionId)`;
        queryParams.institutionId = filter.institutionId;
      } else if (filter.strInstitution) {
        if (filter.strInstitution === 'All') {
          // No filter needed
        } else if (filter.strInstitution === 'Other') {
          query += ` AND R.Institution_Name NOT IN (SELECT Institution_Name FROM T_Institution)`;
        } else {
          query += ` AND R.Institution_Name = @strInstitution`;
          queryParams.strInstitution = filter.strInstitution;
        }
      }

      // Add cheque in favor type filter
      if (filter.chequeInFavorType && filter.chequeInFavorType !== 'All') {
        if (filter.chequeInFavorType === 'Individual') {
          query += ` AND P.DDCheque_In_Favor = R.Applicant_Name`;
        } else {
          query += ` AND P.DDCheque_In_Favor != R.Applicant_Name`;
        }
      }

      // Add issued by filter
      if (filter.intIssuedBy) {
        query += ` AND P.User_ID = @intIssuedBy`;
        queryParams.intIssuedBy = filter.intIssuedBy;
      } else if (filter.strIssuedBy && filter.strIssuedBy !== 'All') {
        query += ` AND P.User_ID = (SELECT User_Id FROM TBL_USERMASTER WHERE User_Name = @strIssuedBy)`;
        queryParams.strIssuedBy = filter.strIssuedBy;
      }

      query += ` ORDER BY P.Donated_Date DESC, R.Application_Id`;

      const result = await this.db.query(query, queryParams);

      return (result.recordset as Record<string, unknown>[]) || [];
    } catch (error) {
      this.logger.error('Error generating scholarship issued report', error);
      throw new BadRequestException(
        'Failed to generate scholarship issued report',
      );
    }
  }

  /**
   * Get all cheque issued by options
   * Matches sp_GetAllChequeIssuedBy
   */
  async getChequeIssuedBy() {
    try {
      const result = await this.db.execute('sp_GetAllChequeIssuedBy');
      return (result.recordset as Record<string, unknown>[]) || [];
    } catch (error) {
      this.logger.error('Error fetching cheque issued by options', error);
      throw new BadRequestException('Failed to fetch cheque issued by options');
    }
  }

  /**
   * Get approval form data
   * Matches PrintApprovalFormDetails.aspx
   */
  async getApprovalFormData(applicationId: string, scholarshipId: number) {
    try {
      const query = `
        SELECT
          R.*,
          P.Scholarship_No,
          P.Scholarship_Approved_Amount,
          P.Scholarship_Suggest_Amount,
          P.Donated_Date,
          P.Payment_Mode,
          P.DDCheque_No,
          P.DDCheque_Date,
          P.DDCheque_In_Favor,
          SY.ScholarshipYear_Name
        FROM t_Registration R
        INNER JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        INNER JOIN T_Scholarship_Year SY ON SY.ScholarshipYear_Id = R.Scholarship_Year_Id
        WHERE R.Application_Id = @applicationId AND P.Scholarship_Id = @scholarshipId
      `;

      const result = await this.db.query(query, {
        applicationId,
        scholarshipId,
      });

      if (!result.recordset || result.recordset.length === 0) {
        throw new BadRequestException('Approval form data not found');
      }

      return result.recordset[0];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error fetching approval form data', error);
      throw new BadRequestException('Failed to fetch approval form data');
    }
  }

  /**
   * Get academic years
   */
  async getAcademicYears() {
    try {
      const result = await this.db.execute('UPS_Get_AcYear');

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching academic years', error);
      throw new BadRequestException('Failed to fetch academic years');
    }
  }
}
