import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface ReportFilter {
  academicYear?: number;
  appliedDate?: string;
  gender?: string;
  status?: string;
  keyword?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get categories wise report
   * Matches report generation from Report.aspx
   */
  async getCategoriesWiseReport(filter: ReportFilter) {
    try {
      let query = `
        SELECT
          R.Scholarship_For,
          COUNT(*) as Total_Applications,
          SUM(CASE WHEN P.Status = 'Completed' THEN 1 ELSE 0 END) as Completed_Count,
          SUM(CASE WHEN P.Status = 'Approved' THEN 1 ELSE 0 END) as Approved_Count,
          SUM(CASE WHEN P.Status = 'Waiting' THEN 1 ELSE 0 END) as Waiting_Count,
          SUM(CASE WHEN P.Status = 'Rejected' THEN 1 ELSE 0 END) as Rejected_Count,
          SUM(CASE WHEN P.Status = 'Completed' THEN P.Scholarship_Approved_Amount ELSE 0 END) as Total_Amount_Issued
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE 1=1
      `;

      const params: Record<string, unknown> = {};

      if (filter.academicYear) {
        query += ` AND R.Scholarship_Year_Id = @academicYear`;
        params.academicYear = filter.academicYear;
      }

      if (filter.gender && filter.gender !== 'All') {
        query += ` AND R.Gender = @gender`;
        params.gender = filter.gender;
      }

      if (filter.status && filter.status !== 'All') {
        query += ` AND P.Status = @status`;
        params.status = filter.status;
      }

      if (filter.keyword) {
        query += ` AND (
          R.Application_Id LIKE @keyword OR
          R.Applicant_Name LIKE @keyword OR
          R.Mobile_Number LIKE @keyword OR
          R.Email LIKE @keyword
        )`;
        params.keyword = `%${filter.keyword}%`;
      }

      if (filter.appliedDate) {
        query += ` AND CAST(P.Data_Date AS DATE) = @appliedDate`;
        params.appliedDate = filter.appliedDate;
      }

      query += ` GROUP BY R.Scholarship_For ORDER BY R.Scholarship_For`;

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error generating categories report', error);
      throw new BadRequestException('Failed to generate categories report');
    }
  }

  /**
   * Get scholarship issued report
   * Matches SubReportForScholarshipIssued.aspx
   */
  async getScholarshipIssuedReport(filter: ReportFilter) {
    try {
      let query = `
        SELECT
          R.Application_Id,
          R.Applicant_Name,
          R.Father_Name,
          R.Scholarship_For,
          R.Class_Studying,
          R.Degree_Type,
          R.Degree,
          R.Institution_Name,
          P.Scholarship_No,
          P.Scholarship_Approved_Amount,
          P.Donated_Date,
          P.Payment_Mode,
          P.DDCheque_No,
          P.DDCheque_Date
        FROM t_Registration R
        INNER JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status = 'Completed'
      `;

      const params: Record<string, unknown> = {};

      if (filter.academicYear) {
        query += ` AND R.Scholarship_Year_Id = @academicYear`;
        params.academicYear = filter.academicYear;
      }

      if (filter.gender && filter.gender !== 'All') {
        query += ` AND R.Gender = @gender`;
        params.gender = filter.gender;
      }

      if (filter.keyword) {
        query += ` AND (
          R.Application_Id LIKE @keyword OR
          R.Applicant_Name LIKE @keyword OR
          P.Scholarship_No LIKE @keyword
        )`;
        params.keyword = `%${filter.keyword}%`;
      }

      if (filter.appliedDate) {
        query += ` AND CAST(P.Donated_Date AS DATE) = @appliedDate`;
        params.appliedDate = filter.appliedDate;
      }

      query += ` ORDER BY P.Donated_Date DESC, R.Application_Id`;

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error generating scholarship issued report', error);
      throw new BadRequestException('Failed to generate scholarship issued report');
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

