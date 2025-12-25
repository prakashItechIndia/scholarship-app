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

export interface CategoriesReportFilters {
  academicYear?: number;
  mainCategory?: string;
  status?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
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

export interface ScholarshipIssuedReportFilters {
  fromDate?: Date | null;
  toDate?: Date | null;
  institutionId?: number;
  strInstitution?: string;
  chequeInFavorType?: string;
  intIssuedBy?: number;
  strIssuedBy?: string;
}

export interface ReportFilters extends CategoriesReportFilters, ScholarshipIssuedReportFilters {
  // Legacy fields for backward compatibility
  appliedDate?: Date | null;
  keywordSearch?: string;
  issuedBy?: string;
  issuedDate?: Date | null;
  issuedType?: string;
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
