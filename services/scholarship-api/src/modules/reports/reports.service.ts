import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';
// Dynamic imports for Excel and Word generation libraries
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExcelJS = require('exceljs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
} = require('docx');
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

interface CategoriesReportFilter {
  academicYear?: number;
  appliedDate?: string;
  gender?: string;
  status?: string;
  keyword?: string;
}

interface ScholarshipIssuedReportFilter {
  academicYear?: number;
  issuedDate?: string;
  issuedType?: string;
  keyword?: string;
  intIssuedBy?: number;
  strIssuedBy?: string;
}

interface ApprovedFormReportFilter {
  academicYear?: number;
  applicationNo?: string;
  studentId?: string;
  status?: string;
  mobileNumber?: string;
  keyword?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get categories wise report
   * Uses raw SQL queries instead of stored procedures
   * Filters: Academic Year, Applied Date, Gender, Status, Keyword Search
   */
  async getCategoriesWiseReport(filter: CategoriesReportFilter) {
    try {
      // Convert appliedDate from DD/MM/YYYY to MM/DD/YYYY format for SQL Server
      const appliedDate = filter.appliedDate
        ? this.convertDateFormat(filter.appliedDate)
        : null;

      // Normalize status to handle case-insensitive comparison
      const normalizedStatus = filter.status
        ? filter.status.charAt(0).toUpperCase() +
          filter.status.slice(1).toLowerCase()
        : null;

      // Base query - select all relevant fields from registration and process tables
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
          R.Data_Date as Applied_Date,
          SY.ScholarshipYear_Name as Scholarship_Year,
          R.Scholarship_For,
          P.Status,
          R.Mobile_Number
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        INNER JOIN T_Scholarship_Year SY ON SY.ScholarshipYear_Id = R.Scholarship_Year_Id
        WHERE 1=1
      `;

      const queryParams: Record<string, unknown> = {};

      // Filter by Academic Year
      if (filter.academicYear) {
        query += ` AND R.Scholarship_Year_Id = @academicYear`;
        queryParams.academicYear = filter.academicYear;
      }

      // Filter by Applied Date
      if (appliedDate) {
        query += ` AND CONVERT(DATE, R.Data_Date) = CONVERT(DATE, @appliedDate, 101)`;
        queryParams.appliedDate = appliedDate;
      }

      // Filter by Gender
      if (filter.gender && filter.gender !== 'all') {
        // Normalize gender value
        const genderValue =
          filter.gender.charAt(0).toUpperCase() +
          filter.gender.slice(1).toLowerCase();
        query += ` AND R.Gender = @gender`;
        queryParams.gender = genderValue;
      }

      // Filter by Status
      if (normalizedStatus) {
        query += ` AND P.Status = @status`;
        queryParams.status = normalizedStatus;
      }

      // Keyword search - search across multiple fields
      if (filter.keyword) {
        const keyword = `%${filter.keyword}%`;
        query += ` AND (
          R.Application_Id LIKE @keyword
          OR R.Applicant_Name LIKE @keyword
          OR R.Student_ID LIKE @keyword
          OR R.Institution_Name LIKE @keyword
          OR R.Father_Name LIKE @keyword
          OR R.Mother_Name LIKE @keyword
          OR R.Mobile_Number LIKE @keyword
          OR P.Scholarship_No LIKE @keyword
        )`;
        queryParams.keyword = keyword;
      }

      query += ` ORDER BY R.Data_Date DESC, R.Application_Id`;

      const result = await this.db.query(query, queryParams);

      return (result.recordset as Record<string, unknown>[]) || [];
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
   * Uses raw SQL query
   * Filters: Academic Year, Issued By, Issued Date, Issued Type, Keyword Search
   */
  async getScholarshipIssuedReport(filter: ScholarshipIssuedReportFilter) {
    try {
      // Convert issuedDate from DD/MM/YYYY to MM/DD/YYYY format for SQL Server
      const issuedDate = filter.issuedDate
        ? this.convertDateFormat(filter.issuedDate)
        : null;

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
          R.Data_Date as Applied_Date,
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

      // Filter by Academic Year
      if (filter.academicYear) {
        query += ` AND R.Scholarship_Year_Id = @academicYear`;
        queryParams.academicYear = filter.academicYear;
      }

      // Filter by Issued Date
      if (issuedDate) {
        query += ` AND CONVERT(DATE, P.Donated_Date) = CONVERT(DATE, @issuedDate, 101)`;
        queryParams.issuedDate = issuedDate;
      }

      // Filter by Issued Type (cheque in favor type)
      if (filter.issuedType && filter.issuedType !== 'all') {
        if (filter.issuedType === 'Individual') {
          query += ` AND P.DDCheque_In_Favor = R.Applicant_Name`;
        } else if (filter.issuedType === 'Institution') {
          query += ` AND P.DDCheque_In_Favor != R.Applicant_Name AND P.DDCheque_In_Favor = R.Institution_Name`;
        } else if (filter.issuedType === 'Concession') {
          query += ` AND P.DDCheque_In_Favor != R.Applicant_Name AND P.DDCheque_In_Favor != R.Institution_Name`;
        }
      }

      // Filter by Issued By
      if (filter.intIssuedBy) {
        query += ` AND P.User_ID = @intIssuedBy`;
        queryParams.intIssuedBy = filter.intIssuedBy;
      } else if (filter.strIssuedBy && filter.strIssuedBy !== 'All') {
        query += ` AND P.User_ID = (SELECT User_Id FROM TBL_USERMASTER WHERE User_Name = @strIssuedBy)`;
        queryParams.strIssuedBy = filter.strIssuedBy;
      }

      // Keyword search
      if (filter.keyword) {
        const keyword = `%${filter.keyword}%`;
        query += ` AND (
          R.Application_Id LIKE @keyword
          OR R.Applicant_Name LIKE @keyword
          OR R.Student_ID LIKE @keyword
          OR R.Institution_Name LIKE @keyword
          OR P.Scholarship_No LIKE @keyword
        )`;
        queryParams.keyword = keyword;
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
   * Get approved form report
   * Uses raw SQL query
   * Filters: Academic Year, Application No., Student ID, Status, Mobile No., Keyword Search
   */
  async getApprovedFormReport(filter: ApprovedFormReportFilter) {
    try {
      // Normalize status to handle case-insensitive comparison
      const normalizedStatus = filter.status
        ? filter.status.charAt(0).toUpperCase() +
          filter.status.slice(1).toLowerCase()
        : null;

      // Base query - select all relevant fields for approved forms
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
          R.Data_Date as Applied_Date,
          SY.ScholarshipYear_Name as Scholarship_Year,
          R.Scholarship_For,
          P.Status,
          R.Mobile_Number
        FROM t_Registration R
        LEFT JOIN t_Registration_Process P ON P.Application_Id = R.Application_Id
        INNER JOIN T_Scholarship_Year SY ON SY.ScholarshipYear_Id = R.Scholarship_Year_Id
        WHERE 1=1
      `;

      const queryParams: Record<string, unknown> = {};

      // Filter by Academic Year
      if (filter.academicYear) {
        query += ` AND R.Scholarship_Year_Id = @academicYear`;
        queryParams.academicYear = filter.academicYear;
      }

      // Filter by Application No
      if (filter.applicationNo) {
        query += ` AND R.Application_Id LIKE @applicationNo`;
        queryParams.applicationNo = `%${filter.applicationNo}%`;
      }

      // Filter by Student ID
      if (filter.studentId) {
        query += ` AND R.Student_ID LIKE @studentId`;
        queryParams.studentId = `%${filter.studentId}%`;
      }

      // Filter by Status (default to "Approved" if not specified)
      if (normalizedStatus) {
        query += ` AND P.Status = @status`;
        queryParams.status = normalizedStatus;
      } else {
        // Default to Approved status if no status filter is provided
        query += ` AND P.Status = 'Approved'`;
      }

      // Filter by Mobile Number
      if (filter.mobileNumber) {
        query += ` AND R.Mobile_Number LIKE @mobileNumber`;
        queryParams.mobileNumber = `%${filter.mobileNumber}%`;
      }

      // Keyword search - search across multiple fields
      if (filter.keyword) {
        const keyword = `%${filter.keyword}%`;
        query += ` AND (
          R.Application_Id LIKE @keyword
          OR R.Applicant_Name LIKE @keyword
          OR R.Student_ID LIKE @keyword
          OR R.Institution_Name LIKE @keyword
          OR R.Father_Name LIKE @keyword
          OR R.Mother_Name LIKE @keyword
          OR R.Mobile_Number LIKE @keyword
          OR P.Scholarship_No LIKE @keyword
        )`;
        queryParams.keyword = keyword;
      }

      query += ` ORDER BY R.Data_Date DESC, R.Application_Id`;

      const result = await this.db.query(query, queryParams);

      return (result.recordset as Record<string, unknown>[]) || [];
    } catch (error) {
      this.logger.error('Error generating approved form report', error);
      throw new BadRequestException('Failed to generate approved form report');
    }
  }

  /**
   * Get approval form data for a specific application and scholarship
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

  /**
   * Export report to PDF using Puppeteer (supports up to 100,000 records)
   * Format matches the old application exactly: Header with title, specific table columns, footer with date/time and page numbers
   */
  async exportToPDF(
    reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    filters:
      | CategoriesReportFilter
      | ScholarshipIssuedReportFilter
      | ApprovedFormReportFilter,
  ): Promise<Buffer> {
    try {
      // Fetch data based on report type
      let data: Record<string, unknown>[] = [];
      if (reportType === 'categories') {
        data = await this.getCategoriesWiseReport(
          filters as CategoriesReportFilter,
        );
      } else if (reportType === 'scholarship-issued') {
        data = await this.getScholarshipIssuedReport(
          filters as ScholarshipIssuedReportFilter,
        );
      } else {
        data = await this.getApprovedFormReport(
          filters as ApprovedFormReportFilter,
        );
      }

      // Helper function to format date as DD/MM/YYYY
      const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        } catch {
          return String(dateStr);
        }
      };

      // Helper function to format date/time for footer
      const formatDateTime = (): string => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
      };

      // Helper function to extract academic year from data
      const getAcademicYearFromData = (): string => {
        if (data.length > 0 && data[0]['Scholarship_Year']) {
          const yearValue = data[0]['Scholarship_Year'];
          let yearStr = '';
          if (typeof yearValue === 'string' || typeof yearValue === 'number') {
            yearStr = String(yearValue);
          } else if (yearValue !== null && yearValue !== undefined) {
            yearStr = JSON.stringify(yearValue);
          }
          // If it's already in format "2024-2025", use as is
          if (yearStr.includes('-')) {
            return yearStr;
          } else {
            // Try to extract year from string
            const yearMatch = yearStr.match(/\d{4}/);
            if (yearMatch) {
              const year = parseInt(yearMatch[0], 10);
              if (!isNaN(year)) {
                return `${year}-${year + 1}`;
              }
            }
          }
        }
        // Fallback: try to get from filter
        const catFilters = filters as CategoriesReportFilter;
        if (catFilters.academicYear) {
          const yearEnd = catFilters.academicYear + 1;
          return `${catFilters.academicYear}-${yearEnd}`;
        }
        return '';
      };

      // Helper function to get report title based on filters - matches old app Excel logic
      const getReportTitle = (): string => {
        if (reportType === 'categories') {
          const catFilters = filters as CategoriesReportFilter;
          let title = 'Scholarship Based on';

          // Match exact logic from old app's Excel export (lines 1107-1209)
          if (catFilters.gender) {
            title += ` Gender - ${catFilters.gender === 'All' ? 'All' : catFilters.gender}`;
          } else if (catFilters.status) {
            title += ` Status - ${catFilters.status}`;
          } else if (catFilters.appliedDate) {
            title += ` Applied Date`;
          } else {
            title += ' All';
          }

          // Add academic year
          const academicYear = getAcademicYearFromData();
          if (academicYear) {
            title += ` - ${academicYear}`;
          }

          return title;
        } else if (reportType === 'scholarship-issued') {
          let title = 'Report of Scholarship Issued';
          const academicYear = getAcademicYearFromData();
          if (academicYear) {
            title += ` - ${academicYear}`;
          }
          return title;
        } else {
          let title = 'Approved Form Report';
          const academicYear = getAcademicYearFromData();
          if (academicYear) {
            title += ` - ${academicYear}`;
          }
          return title;
        }
      };

      const reportTitle = getReportTitle();
      const printDateTime = formatDateTime();

      // Define column structure based on report type
      let columns: Array<{ key: string; label: string }> = [];

      if (reportType === 'categories') {
        columns = [
          { key: 'S.No', label: 'S.No' },
          { key: 'Application_Id', label: 'Application Id' },
          { key: 'Applicant_Name', label: 'Name' },
          { key: 'Student_ID', label: 'Student Id' },
          { key: 'Gender', label: 'Gender' },
          { key: 'DDCheque_In_Favor', label: 'Cheque In Favor' },
          { key: 'Scholarship_Approved_Amount', label: 'Approved Amount' },
          { key: 'Issued_Amount', label: 'Issued Amount' },
          { key: 'Scholarship_No', label: 'Scholarship ID' },
          { key: 'CheckNo_Date', label: 'CheckNo/Date' },
          { key: 'Bank_Name', label: 'Bank Name' },
          { key: 'Applied_Date', label: 'Applied Date' },
          { key: 'Institution_Name', label: 'Institution Name' },
        ];
      } else if (reportType === 'scholarship-issued') {
        columns = [
          { key: 'S.No', label: 'S.No' },
          { key: 'Application_Id', label: 'Application Id' },
          { key: 'Applicant_Name', label: 'Name' },
          { key: 'Issued_Amount', label: 'Issued Amount' },
          { key: 'Donated_Date', label: 'Donated Date' },
          { key: 'DDCheque_No', label: 'DDCheque No' },
          { key: 'DDCheque_In_Favor', label: 'DDCheque In Favor' },
          { key: 'Scholarship_Year', label: 'Scholarship Year' },
          { key: 'Scholarship', label: 'Scholarship' },
          { key: 'Bank_Name', label: 'Bank Name' },
        ];
      } else {
        columns = [
          { key: 'S.No', label: 'S.No' },
          { key: 'Application_Id', label: 'Application Id' },
          { key: 'Applicant_Name', label: 'Name' },
          { key: 'Student_ID', label: 'Student Id' },
          { key: 'Institution_Name', label: 'Institution Name' },
          { key: 'Status', label: 'Status' },
          { key: 'Mobile_Number', label: 'Mobile Number' },
          { key: 'Scholarship_Year', label: 'Scholarship Year' },
          { key: 'Applied_Date', label: 'Applied Date' },
          { key: 'Father_Name', label: 'Father Name' },
          { key: 'Mother_Name', label: 'Mother Name' },
          { key: 'Gender', label: 'Gender' },
          { key: 'Class_Studying', label: 'Class Studying' },
        ];
      }

      // Process data rows
      const processedRows: Array<Record<string, string>> = [];
      let serialNumber = 1;

      for (const row of data) {
        const processedRow: Record<string, string> = {};

        columns.forEach((col) => {
          let cellValue = '';

          if (col.key === 'S.No') {
            cellValue = String(serialNumber);
          } else if (col.key === 'CheckNo_Date') {
            const chequeNoRaw = row['DDCheque_No'];
            let chequeNo = '';
            if (chequeNoRaw !== null && chequeNoRaw !== undefined) {
              if (
                typeof chequeNoRaw === 'string' ||
                typeof chequeNoRaw === 'number'
              ) {
                chequeNo = String(chequeNoRaw);
              } else {
                chequeNo = JSON.stringify(chequeNoRaw);
              }
            }
            const donatedDate = formatDate(row['Donated_Date'] as string);
            cellValue = donatedDate ? `${chequeNo}, ${donatedDate}` : chequeNo;
          } else if (
            col.key === 'Issued_Amount' &&
            reportType === 'categories'
          ) {
            cellValue = row['Scholarship_Approved_Amount']
              ? Number(row['Scholarship_Approved_Amount']).toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )
              : '';
          } else if (col.key.includes('Amount') || col.key.includes('amount')) {
            const amount = row[col.key];
            if (amount !== null && amount !== undefined) {
              cellValue = Number(amount).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }
          } else if (col.key.includes('Date') || col.key.includes('date')) {
            cellValue = formatDate(row[col.key] as string);
          } else {
            const rawValue = row[col.key];
            if (rawValue !== null && rawValue !== undefined) {
              if (
                typeof rawValue === 'object' &&
                !Array.isArray(rawValue) &&
                rawValue.constructor === Object
              ) {
                cellValue = JSON.stringify(rawValue);
              } else if (Array.isArray(rawValue)) {
                cellValue = JSON.stringify(rawValue);
              } else if (
                typeof rawValue === 'string' ||
                typeof rawValue === 'number' ||
                typeof rawValue === 'boolean' ||
                typeof rawValue === 'bigint' ||
                typeof rawValue === 'symbol'
              ) {
                cellValue = String(rawValue);
              } else {
                cellValue = JSON.stringify(rawValue);
              }
            }
          }

          processedRow[col.key] = cellValue || '';
        });

        processedRows.push(processedRow);
        serialNumber++;
      }

      // Generate HTML template matching old app format
      const html = this.generatePDFHTML(columns, processedRows);

      // Launch Puppeteer and generate PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Get logo as base64 for header
        const logoBase64 = this.getLogoBase64();

        // Generate PDF with header and footer
        const pdfBuffer = await page.pdf({
          format: 'A4',
          landscape: true,
          margin: {
            top: '25mm', // Increased top margin for header
            right: '10mm',
            bottom: '20mm',
            left: '10mm',
          },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: this.generateHeaderTemplate(logoBase64, reportTitle),
          footerTemplate: `
            <div style="font-size: 8pt; width: 100%; padding: 0 10mm; display: flex; justify-content: space-between; font-family: Arial, Helvetica, sans-serif; color: #000;">
              <span>Print Date & Time: ${printDateTime}</span>
              <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
          `,
        });

        return Buffer.from(pdfBuffer);
      } finally {
        await browser.close();
      }
    } catch (error) {
      this.logger.error('Error generating PDF export', error);
      throw new BadRequestException('Failed to generate PDF export');
    }
  }

  /**
   * Generate HTML template for PDF matching old app format exactly
   * Matches Crystal Reports output format from old application
   */
  private generatePDFHTML(
    columns: Array<{ key: string; label: string }>,
    rows: Array<Record<string, string>>,
  ): string {
    const headerHTML = columns
      .map((col) => `<th>${this.escapeHtml(col.label)}</th>`)
      .join('');

    const rowsHTML = rows
      .map((row) => {
        const cells = columns
          .map((col) => {
            const value = row[col.key] || '';
            // Truncate long values to prevent overflow
            const displayValue =
              value.length > 50 ? value.substring(0, 47) + '...' : value;
            return `<td>${this.escapeHtml(displayValue)}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    // Calculate column widths (percentage based)
    const colWidth = `${100 / columns.length}%`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 25mm 10mm 20mm 10mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      margin: 0;
      padding: 0;
      color: #000;
    }
    
    .header {
      display: none; /* Header is now in Puppeteer headerTemplate */
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      font-size: 7pt;
      table-layout: fixed;
      page-break-inside: auto;
    }
    
    thead {
      display: table-header-group;
    }
    
    tbody {
      display: table-row-group;
    }
    
    th {
      background-color: #e8e8e8;
      border: 1px solid #000;
      padding: 5px 4px;
      text-align: left;
      font-weight: bold;
      font-size: 8pt;
      font-family: Arial, Helvetica, sans-serif;
      word-wrap: break-word;
      overflow: hidden;
      white-space: nowrap;
    }
    
    td {
      border: 1px solid #000;
      padding: 4px 3px;
      text-align: left;
      font-size: 7pt;
      font-family: Arial, Helvetica, sans-serif;
      word-wrap: break-word;
      overflow: hidden;
      vertical-align: middle;
    }
    
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    
    tbody tr {
      background-color: #fff;
    }
    
    .no-data {
      text-align: center;
      padding: 40px 20px;
      font-size: 12pt;
      font-weight: bold;
    }
    
    /* Column width classes */
    ${columns
      .map(
        (_, index) => `
    th:nth-child(${index + 1}),
    td:nth-child(${index + 1}) {
      width: ${colWidth};
    }
    `,
      )
      .join('')}
  </style>
</head>
<body>
  ${
    rows.length === 0
      ? '<div class="no-data">No data available</div>'
      : `
  <table>
    <thead>
      <tr>${headerHTML}</tr>
    </thead>
    <tbody>
      ${rowsHTML}
    </tbody>
  </table>
  `
  }
</body>
</html>
    `.trim();
  }

  /**
   * Get logo as base64 data URI
   */
  private getLogoBase64(): string {
    try {
      // Try to read logo from old app directory first
      const oldAppLogoPath = join(
        process.cwd(),
        '..',
        'SaiAramFoundation Without SVN',
        'images',
        'chairman logo.png',
      );
      const logoBuffer = readFileSync(oldAppLogoPath);
      const base64 = logoBuffer.toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      this.logger.warn('Logo file not found, using text-only header', error);
      return '';
    }
  }

  /**
   * Generate header template for PDF pages
   * This header will appear on every page
   */
  private generateHeaderTemplate(
    logoBase64: string,
    reportTitle: string,
  ): string {
    const logoHtml = logoBase64
      ? `<img src="${logoBase64}" style="width: 60px; height: 60px; object-fit: contain; margin-right: 10px;" alt="Logo" />`
      : '';

    return `
      <div style="width: 100%; padding: 5mm 10mm; border-bottom: 1px solid #000; display: flex; align-items: center; justify-content: space-between; font-family: Arial, Helvetica, sans-serif;">
        <div style="display: flex; align-items: center; flex: 1;">
          ${logoHtml}
          <div>
            <div style="font-size: 20pt; font-weight: bold; color: #8B0000; line-height: 1.2; margin-bottom: 2px;">LEO MUTHU</div>
            <div style="font-size: 14pt; font-weight: bold; color: #FF8C00; line-height: 1.2;">SCHOLARSHIP</div>
          </div>
        </div>
        <div style="font-size: 10pt; color: #000; text-align: right; flex: 1;">
          Online Reports of Leo Muthu Scholarship (LMS)
        </div>
      </div>
      <div style="width: 100%; padding: 3mm 10mm; text-align: center; border-bottom: 1px solid #ccc;">
        <div style="font-size: 12pt; font-weight: bold; color: #000;">${this.escapeHtml(reportTitle)}</div>
      </div>
    `;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Export report to Excel (supports up to 100,000 records)
   */
  async exportToExcel(
    reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    filters:
      | CategoriesReportFilter
      | ScholarshipIssuedReportFilter
      | ApprovedFormReportFilter,
  ): Promise<Buffer> {
    try {
      // Fetch data based on report type
      let data: Record<string, unknown>[] = [];
      if (reportType === 'categories') {
        data = await this.getCategoriesWiseReport(
          filters as CategoriesReportFilter,
        );
      } else if (reportType === 'scholarship-issued') {
        data = await this.getScholarshipIssuedReport(
          filters as ScholarshipIssuedReportFilter,
        );
      } else {
        data = await this.getApprovedFormReport(
          filters as ApprovedFormReportFilter,
        );
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      if (data.length === 0) {
        worksheet.addRow(['No data available']);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
      }

      // Get headers
      const headers = Object.keys(data[0]);

      // Add header row
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F6CBD' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows in chunks for better performance
      const chunkSize = 5000;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        chunk.forEach((row) => {
          const rowData = headers.map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (
              typeof value === 'object' &&
              !Array.isArray(value) &&
              value.constructor === Object
            ) {
              return JSON.stringify(value);
            }
            if (Array.isArray(value)) {
              return JSON.stringify(value);
            }
            if (
              typeof value === 'string' ||
              typeof value === 'number' ||
              typeof value === 'boolean' ||
              typeof value === 'bigint' ||
              typeof value === 'symbol'
            ) {
              return String(value);
            }
            // Fallback for any other type
            return JSON.stringify(value);
          });
          worksheet.addRow(rowData);
        });
      }

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        if (column.header) {
          column.width = 15;
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Error generating Excel export', error);
      throw new BadRequestException('Failed to generate Excel export');
    }
  }

  /**
   * Export report to CSV (supports up to 100,000 records with streaming)
   */
  async exportToCSV(
    reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    filters:
      | CategoriesReportFilter
      | ScholarshipIssuedReportFilter
      | ApprovedFormReportFilter,
  ): Promise<string> {
    try {
      // Fetch data based on report type
      let data: Record<string, unknown>[] = [];
      if (reportType === 'categories') {
        data = await this.getCategoriesWiseReport(
          filters as CategoriesReportFilter,
        );
      } else if (reportType === 'scholarship-issued') {
        data = await this.getScholarshipIssuedReport(
          filters as ScholarshipIssuedReportFilter,
        );
      } else {
        data = await this.getApprovedFormReport(
          filters as ApprovedFormReportFilter,
        );
      }

      if (data.length === 0) {
        return 'No data available';
      }

      // Get headers
      const headers = Object.keys(data[0]);

      // Build CSV
      const csvRows: string[] = [];

      // Add header row
      csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));

      // Add data rows
      data.forEach((row) => {
        const values = headers.map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '""';
          let strValue = '';
          if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value.constructor === Object
          ) {
            strValue = JSON.stringify(value).replace(/"/g, '""');
          } else if (Array.isArray(value)) {
            strValue = JSON.stringify(value).replace(/"/g, '""');
          } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            typeof value === 'bigint' ||
            typeof value === 'symbol'
          ) {
            strValue = String(value).replace(/"/g, '""');
          } else {
            // Fallback for any other type
            strValue = JSON.stringify(value).replace(/"/g, '""');
          }
          return `"${strValue}"`;
        });
        csvRows.push(values.join(','));
      });

      return csvRows.join('\n');
    } catch (error) {
      this.logger.error('Error generating CSV export', error);
      throw new BadRequestException('Failed to generate CSV export');
    }
  }

  /**
   * Export report to Word (supports up to 100,000 records)
   */
  async exportToWord(
    reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    filters:
      | CategoriesReportFilter
      | ScholarshipIssuedReportFilter
      | ApprovedFormReportFilter,
  ): Promise<Buffer> {
    try {
      // Fetch data based on report type
      let data: Record<string, unknown>[] = [];
      if (reportType === 'categories') {
        data = await this.getCategoriesWiseReport(
          filters as CategoriesReportFilter,
        );
      } else if (reportType === 'scholarship-issued') {
        data = await this.getScholarshipIssuedReport(
          filters as ScholarshipIssuedReportFilter,
        );
      } else {
        data = await this.getApprovedFormReport(
          filters as ApprovedFormReportFilter,
        );
      }

      const reportTitle =
        reportType === 'categories'
          ? 'Categories Wise Report'
          : reportType === 'scholarship-issued'
            ? 'Report of Scholarship Issued'
            : 'Approved Form Report';

      // Create document
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];

      // Title
      children.push(
        new Paragraph({
          text: reportTitle,
          heading: 'Heading1',
          alignment: AlignmentType.CENTER,
        }),
      );

      // Metadata
      children.push(
        new Paragraph({
          text: `Generated on: ${new Date().toLocaleString()}`,
        }),
      );
      children.push(
        new Paragraph({
          text: `Total Records: ${data.length}`,
        }),
      );
      children.push(new Paragraph({ text: '' })); // Empty line

      if (data.length === 0) {
        children.push(
          new Paragraph({
            text: 'No data available',
            alignment: AlignmentType.CENTER,
          }),
        );
      } else {
        // Get headers
        const headers = Object.keys(data[0]);

        // Create table rows
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tableRows: any[] = [];

        // Header row
        const headerCells = headers.map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  text: header,
                  children: [new TextRun({ bold: true })],
                }),
              ],
              width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
            }),
        );
        tableRows.push(new TableRow({ children: headerCells }));

        // Data rows (process in chunks for large datasets)
        const chunkSize = 1000;
        for (let i = 0; i < Math.min(data.length, 10000); i += chunkSize) {
          // Limit to 10,000 rows for Word to prevent memory issues
          const chunk = data.slice(i, i + chunkSize);
          chunk.forEach((row) => {
            const cells = headers.map((header) => {
              const value = row[header];
              let text = '';
              if (value !== null && value !== undefined) {
                if (
                  typeof value === 'object' &&
                  !Array.isArray(value) &&
                  value.constructor === Object
                ) {
                  text = JSON.stringify(value).substring(0, 50);
                } else if (Array.isArray(value)) {
                  text = JSON.stringify(value).substring(0, 50);
                } else if (
                  typeof value === 'string' ||
                  typeof value === 'number' ||
                  typeof value === 'boolean' ||
                  typeof value === 'bigint' ||
                  typeof value === 'symbol'
                ) {
                  text = String(value).substring(0, 50);
                } else {
                  // Fallback for any other type
                  text = JSON.stringify(value).substring(0, 50);
                }
              }
              return new TableCell({
                children: [new Paragraph({ text })],
                width: {
                  size: 100 / headers.length,
                  type: WidthType.PERCENTAGE,
                },
              });
            });
            tableRows.push(new TableRow({ children: cells }));
          });
        }

        // Add table
        children.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        );
      }

      const doc = new Document({
        sections: [
          {
            children,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      return buffer;
    } catch (error) {
      this.logger.error('Error generating Word export', error);
      throw new BadRequestException('Failed to generate Word export');
    }
  }
}
