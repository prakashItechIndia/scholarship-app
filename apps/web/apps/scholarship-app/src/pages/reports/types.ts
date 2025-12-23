export interface ScholarshipReportData {
  applicationNo: string;
  studentName: string;
  studentId: string;
  institutionName: string;
  scholarshipId: string;
  checkNo: string;
}

export interface ReportFilters {
  academicYear?: string;
  appliedDate?: Date | null;
  gender?: string;
  status?: string;
  keywordSearch?: string;
}

export type ReportTab = "categories-wise" | "scholarship-issued" | "approved-form";

