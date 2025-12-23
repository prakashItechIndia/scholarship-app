import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get dashboard financial summary
   * Matches dashboard metrics from AdminPanelHome
   */
  async getFinancialSummary(academicYearId?: number) {
    try {
      let query = `
        SELECT
          SUM(CASE WHEN P.Status = 'Completed' THEN P.Scholarship_Approved_Amount ELSE 0 END) as Total_Amount_Spent,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'School' THEN P.Scholarship_Approved_Amount ELSE 0 END) as School_Students_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'College' THEN P.Scholarship_Approved_Amount ELSE 0 END) as College_Students_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'Research' THEN P.Scholarship_Approved_Amount ELSE 0 END) as Research_Scholars_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'Medical' THEN P.Scholarship_Approved_Amount ELSE 0 END) as Medical_Assistance_Amount
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE 1=1
      `;

      const params: Record<string, unknown> = {};

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      const result = await this.db.query(query, params);

      return result.recordset[0] || {
        Total_Amount_Spent: 0,
        School_Students_Amount: 0,
        College_Students_Amount: 0,
        Research_Scholars_Amount: 0,
        Medical_Assistance_Amount: 0,
      };
    } catch (error) {
      this.logger.error('Error fetching financial summary', error);
      throw new BadRequestException('Failed to fetch financial summary');
    }
  }

  /**
   * Get application analytics
   */
  async getApplicationAnalytics(academicYearId?: number) {
    try {
      let query = `
        SELECT
          COUNT(*) as Total_Applications,
          SUM(CASE WHEN P.Status = 'Registered' OR P.Status IS NULL THEN 1 ELSE 0 END) as Submitted,
          SUM(CASE WHEN P.Status = 'Approved' OR P.Status = 'Completed' THEN 1 ELSE 0 END) as Approved,
          SUM(CASE WHEN P.Status IN ('Waiting', 'Registered') THEN 1 ELSE 0 END) as Under_Review
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE 1=1
      `;

      const params: Record<string, unknown> = {};

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      const result = await this.db.query(query, params);

      return result.recordset[0] || {
        Total_Applications: 0,
        Submitted: 0,
        Approved: 0,
        Under_Review: 0,
      };
    } catch (error) {
      this.logger.error('Error fetching application analytics', error);
      throw new BadRequestException('Failed to fetch application analytics');
    }
  }

  /**
   * Get recent applications
   */
  async getRecentApplications(limit: number = 10, academicYearId?: number) {
    try {
      let query = `
        SELECT TOP (@limit)
          R.Application_Id,
          R.Applicant_Name,
          R.Class_Studying,
          R.Degree_Type,
          R.Degree,
          R.Institution_Name,
          R.Mobile_Number,
          R.Father_Name,
          P.Status,
          P.Scholarship_No,
          P.Data_Date as Applied_Date,
          UP.User_Name as Prepared_By
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        LEFT JOIN TBL_USERMASTER UP ON P.Prepared_By = UP.Id
        WHERE 1=1
      `;

      const params: Record<string, unknown> = { limit };

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      query += ` ORDER BY P.Data_Date DESC, R.Application_Id DESC`;

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching recent applications', error);
      throw new BadRequestException('Failed to fetch recent applications');
    }
  }

  /**
   * Get application activity by month
   */
  async getApplicationActivityByMonth(academicYearId?: number) {
    try {
      let query = `
        SELECT
          FORMAT(P.Data_Date, 'yyyy-MM') as Month,
          COUNT(*) as Application_Count
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Data_Date IS NOT NULL
      `;

      const params: Record<string, unknown> = {};

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      query += `
        GROUP BY FORMAT(P.Data_Date, 'yyyy-MM')
        ORDER BY FORMAT(P.Data_Date, 'yyyy-MM') DESC
      `;

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching application activity', error);
      throw new BadRequestException('Failed to fetch application activity');
    }
  }

  /**
   * Get scholarship program distribution
   */
  async getScholarshipProgramDistribution(academicYearId?: number) {
    try {
      let query = `
        SELECT
          R.Scholarship_For,
          FORMAT(P.Donated_Date, 'yyyy-MM') as Month,
          SUM(P.Scholarship_Approved_Amount) as Total_Amount
        FROM t_Registration R
        INNER JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status = 'Completed' AND P.Donated_Date IS NOT NULL
      `;

      const params: Record<string, unknown> = {};

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      query += `
        GROUP BY R.Scholarship_For, FORMAT(P.Donated_Date, 'yyyy-MM')
        ORDER BY FORMAT(P.Donated_Date, 'yyyy-MM') DESC, R.Scholarship_For
      `;

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching program distribution', error);
      throw new BadRequestException('Failed to fetch program distribution');
    }
  }
}

