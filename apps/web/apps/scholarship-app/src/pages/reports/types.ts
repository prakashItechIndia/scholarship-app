export interface ScholarshipReportData {
  applicationNo: string;
  aadhaarId: string;
  studentName: string;
  studentId: string;
  classStudying: string;
  institutionName: string;
  fatherName: string;
  fatherOfficeName: string;
  motherName: string;
  motherOfficeName: string;
  guardianName: string;
  guardianOfficeName: string;
  gender: string;
  checkInFavor: string;
  approvedAmount: string;
  issuedAmount: string;
  scholarshipId: string;
  ddCheckNo: string;
  donateDate: string;
  bankName: string;
  appliedDate: string;
  scholarshipYear: string;
  scholarshipFor: string;
  status: string;
}

// Categories Wise Report filters
export interface CategoriesReportFilters {
  academicYear?: number;
  appliedDate?: Date | null;
  gender?: string;
  status?: string;
  keywordSearch?: string;
}

// Report of Scholarship Issued filters
export interface ScholarshipIssuedReportFilters {
  academicYear?: number;
  issuedBy?: string;
  issuedDate?: Date | null;
  issuedType?: string;
  keywordSearch?: string;
  // Internal fields for API
  intIssuedBy?: number;
  strIssuedBy?: string;
}

// Approved Form filters
export interface ApprovedFormFilters {
  academicYear?: number;
  applicationNo?: string;
  studentId?: string;
  status?: string;
  mobileNumber?: string;
  keywordSearch?: string;
}

// Unified ReportFilters interface
export interface ReportFilters {
  // Categories Wise Report
  academicYear?: number;
  appliedDate?: Date | null;
  gender?: string;
  status?: string;
  keywordSearch?: string;
  
  // Report of Scholarship Issued
  issuedBy?: string;
  issuedDate?: Date | null;
  issuedType?: string;
  intIssuedBy?: number;
  strIssuedBy?: string;
  
  // Approved Form
  applicationNo?: string;
  studentId?: string;
  mobileNumber?: string;
}

export type ReportTab = "categories-wise" | "scholarship-issued" | "approved-form";

export interface ApprovedFormData {
  applicationNo: string;
  studentName: string;
  classStudying: string;
  institutionName: string;
  fatherAnnualIncome: string;
  mobileNumber: string;
  fatherOccupation: string;
  scholarship: string;
  status: string;
}
