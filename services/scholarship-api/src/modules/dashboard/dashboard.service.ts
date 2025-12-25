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
          SUM(CASE WHEN P.Status = 'Completed' THEN TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT) ELSE 0 END) as Total_Amount_Spent,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'School' THEN TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT) ELSE 0 END) as School_Students_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'College' THEN TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT) ELSE 0 END) as College_Students_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'Research' THEN TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT) ELSE 0 END) as Research_Scholars_Amount,
          SUM(CASE WHEN P.Status = 'Completed' AND R.Scholarship_For = 'Medical' THEN TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT) ELSE 0 END) as Medical_Assistance_Amount
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

      return (
        result.recordset[0] || {
        Total_Amount_Spent: 0,
        School_Students_Amount: 0,
        College_Students_Amount: 0,
        Research_Scholars_Amount: 0,
        Medical_Assistance_Amount: 0,
        }
      );
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

      return (
        result.recordset[0] || {
        Total_Applications: 0,
        Submitted: 0,
        Approved: 0,
        Under_Review: 0,
        }
      );
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
          SUM(TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT)) as Total_Amount
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

  /**
   * Get application status breakdown by month
   */
  async getApplicationStatusByMonth(month?: string, academicYearId?: number) {
    try {
      let query = `
        SELECT
          SUM(CASE WHEN P.Status = 'Registered' OR P.Status IS NULL THEN 1 ELSE 0 END) as Pending,
          SUM(CASE WHEN P.Status IN ('Waiting', 'Verified') THEN 1 ELSE 0 END) as In_Review,
          SUM(CASE WHEN P.Status = 'Rejected' THEN 1 ELSE 0 END) as Rejected,
          SUM(CASE WHEN P.Status IN ('Approved', 'Completed') THEN 1 ELSE 0 END) as Approved
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE 1=1
      `;

      const params: Record<string, unknown> = {};

      if (month) {
        // Format: "October 2025" -> "2025-10"
        const monthMap: Record<string, string> = {
          January: '01',
          February: '02',
          March: '03',
          April: '04',
          May: '05',
          June: '06',
          July: '07',
          August: '08',
          September: '09',
          October: '10',
          November: '11',
          December: '12',
        };
        const parts = month.split(' ');
        if (parts.length === 2) {
          const monthName = parts[0];
          const year = parts[1];
          const monthNum = monthMap[monthName];
          if (monthNum) {
            query += ` AND FORMAT(P.Data_Date, 'yyyy-MM') = @monthFilter`;
            params.monthFilter = `${year}-${monthNum}`;
          }
        }
      }

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      const result = await this.db.query(query, params);

      return (
        result.recordset[0] || {
          Pending: 0,
          In_Review: 0,
          Rejected: 0,
          Approved: 0,
        }
      );
    } catch (error) {
      this.logger.error('Error fetching application status', error);
      throw new BadRequestException('Failed to fetch application status');
    }
  }

  /**
   * Get recent activities from history table
   */
  async getRecentActivities(limit: number = 5) {
    try {
      const query = `
        SELECT TOP (@limit)
          H.ID,
          H.Application_Id,
          H.Process as Action,
          H.Action as ProcessUndergone,
          H.Data_Date,
          COALESCE(U.User_Name, H.User_ID, R.Applicant_Name) as User_Name,
          R.Applicant_Name as ApplicantName,
          P.Status,
          P.Scholarship_No
        FROM TBL_HISTORY H
        LEFT JOIN TBL_USERMASTER U ON H.User_ID = U.User_ID
        LEFT JOIN t_Registration R ON H.Application_Id = R.Application_Id
        LEFT JOIN t_Registration_Process P ON H.Application_Id = P.Application_Id
        ORDER BY H.Data_Date DESC, H.ID DESC
      `;

      const params: Record<string, unknown> = { limit };

      const result = await this.db.query(query, params);

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching recent activities', error);
      throw new BadRequestException('Failed to fetch recent activities');
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(academicYearId?: number) {
    try {
      // Calculate average processing time (in days)
      let avgProcessingTimeQuery = `
        SELECT AVG(DATEDIFF(day, P.Data_Date, COALESCE(P.Approved_Date, P.Donated_Date, GETDATE()))) as AvgProcessingDays
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status IN ('Approved', 'Completed') AND P.Data_Date IS NOT NULL
      `;

      // Calculate budget utilization (percentage)
      let budgetUtilizationQuery = `
        SELECT 
          (SUM(TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT)) / NULLIF(SUM(TRY_CAST(P.Scholarship_Suggest_Amount AS FLOAT)), 0)) * 100 as BudgetUtilization
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status = 'Completed'
      `;

      const params: Record<string, unknown> = {};

      if (academicYearId) {
        avgProcessingTimeQuery += ` AND R.Scholarship_Year_Id = @academicYearId`;
        budgetUtilizationQuery += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      const [avgTimeResult, budgetResult] = await Promise.all([
        this.db.query(avgProcessingTimeQuery, params),
        this.db.query(budgetUtilizationQuery, params),
      ]);

      const avgProcessingDays = Math.round(
        (avgTimeResult.recordset[0] as { AvgProcessingDays?: number })
          ?.AvgProcessingDays || 0,
      );
      const budgetUtilization = Math.round(
        (budgetResult.recordset[0] as { BudgetUtilization?: number })
          ?.BudgetUtilization || 0,
      );

      // For now, return mock data for satisfaction and retention (these would come from surveys/analytics)
      return {
        averageProcessingTime: {
          value: `${avgProcessingDays} ${avgProcessingDays === 1 ? 'day' : 'days'}`,
          percentage: Math.min(100, Math.max(0, 100 - avgProcessingDays * 5)), // Inverse: lower days = higher percentage
        },
        satisfactionScore: {
          value: '4.7/5.0',
          percentage: 94,
        },
        studentRetentionRate: {
          value: '78%',
          percentage: 78,
        },
        budgetUtilization: {
          value: `${budgetUtilization}%`,
          percentage: Math.min(100, budgetUtilization),
        },
      };
    } catch (error) {
      this.logger.error('Error fetching performance metrics', error);
      throw new BadRequestException('Failed to fetch performance metrics');
    }
  }

  /**
   * Get fund spending data by month for different years
   */
  async getFundSpending(yearRange?: string, academicYearId?: number) {
    try {
      // Parse year range like "2024 - 2025" to get start and end years
      let startYear = new Date().getFullYear() - 1;
      let endYear = new Date().getFullYear();

      if (yearRange) {
        const parts = yearRange.split(' - ');
        if (parts.length === 2) {
          startYear = parseInt(parts[0], 10);
          endYear = parseInt(parts[1], 10);
        }
      }

      const query = `
        SELECT
          FORMAT(P.Donated_Date, 'MMM') as Month,
          FORMAT(P.Donated_Date, 'yyyy') as Year,
          SUM(TRY_CAST(P.Scholarship_Approved_Amount AS FLOAT)) as Total_Amount
        FROM t_Registration R
        INNER JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        WHERE P.Status = 'Completed' 
          AND P.Donated_Date IS NOT NULL
          AND YEAR(P.Donated_Date) IN (@startYear, @endYear)
        GROUP BY FORMAT(P.Donated_Date, 'MMM'), FORMAT(P.Donated_Date, 'yyyy'), YEAR(P.Donated_Date), MONTH(P.Donated_Date)
        ORDER BY FORMAT(P.Donated_Date, 'yyyy'), MONTH(P.Donated_Date)
      `;

      const params: Record<string, unknown> = {
        startYear,
        endYear,
      };

      if (academicYearId) {
        params.academicYearId = academicYearId;
        // Note: We'll filter by academic year if needed, but year range takes precedence
      }

      const result = await this.db.query(query, params);

      // Group by month and year
      const monthMap: Record<
        string,
        { month: string; budget2024: number; budget2025: number }
      > = {};

      const monthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      monthOrder.forEach((month) => {
        monthMap[month] = {
          month,
          budget2024: 0,
          budget2025: 0,
        };
      });

      result.recordset.forEach((row: any) => {
        const month = row.Month || '';
        const year = parseInt(row.Year || '0', 10);
        const amount = Number(row.Total_Amount || 0);

        if (monthMap[month]) {
          if (year === startYear) {
            monthMap[month].budget2024 += amount;
          } else if (year === endYear) {
            monthMap[month].budget2025 += amount;
          }
        }
      });

      return monthOrder.map((month) => monthMap[month]);
    } catch (error) {
      this.logger.error('Error fetching fund spending', error);
      throw new BadRequestException('Failed to fetch fund spending');
    }
  }

  /**
   * Get schedule calendar events (meetings, deadlines, activities)
   */
  async getCalendarEvents(month?: string, academicYearId?: number) {
    try {
      // For now, we'll create events based on important dates from the database
      // This could be extended to use a dedicated calendar/events table
      let query = `
        SELECT DISTINCT
          FORMAT(P.Approved_Date, 'yyyy-MM-dd') as Event_Date,
          'Application Review Meeting' as Event_Title,
          'meeting' as Event_Type,
          P.Approved_Date
        FROM t_Registration_Process P
        INNER JOIN t_Registration R ON P.Application_Id = R.Application_Id
        WHERE P.Approved_Date IS NOT NULL
          AND P.Approved_Date >= DATEADD(day, -30, GETDATE())
          AND P.Approved_Date <= DATEADD(day, 60, GETDATE())
      `;

      const params: Record<string, unknown> = {};

      if (month) {
        // Format: "October 2025" -> "2025-10"
        const monthMap: Record<string, string> = {
          January: '01',
          February: '02',
          March: '03',
          April: '04',
          May: '05',
          June: '06',
          July: '07',
          August: '08',
          September: '09',
          October: '10',
          November: '11',
          December: '12',
        };
        const parts = month.split(' ');
        if (parts.length === 2) {
          const monthName = parts[0];
          const year = parts[1];
          const monthNum = monthMap[monthName];
          if (monthNum) {
            query += ` AND FORMAT(P.Approved_Date, 'yyyy-MM') = @monthFilter`;
            params.monthFilter = `${year}-${monthNum}`;
          }
        }
      }

      if (academicYearId) {
        query += ` AND R.Scholarship_Year_Id = @academicYearId`;
        params.academicYearId = academicYearId;
      }

      query += ` ORDER BY FORMAT(P.Approved_Date, 'yyyy-MM-dd') ASC`;

      const result = await this.db.query(query, params);

      // Map to calendar events format
      const events = result.recordset.map((row: any) => ({
        date: row.Event_Date || '',
        title: row.Event_Title || 'Event',
        type: (row.Event_Type || 'activity') as
          | 'meeting'
          | 'deadline'
          | 'activity',
      }));

      // Add some default events if none found
      if (events.length === 0) {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        events.push({
          date: `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`,
          title: 'Application Review Meeting',
          type: 'meeting' as const,
        });
      }

      return events;
    } catch (error) {
      this.logger.error('Error fetching calendar events', error);
      throw new BadRequestException('Failed to fetch calendar events');
    }
  }
}
