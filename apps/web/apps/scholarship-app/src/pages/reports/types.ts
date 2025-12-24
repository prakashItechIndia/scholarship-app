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

export interface ReportFilters {
  academicYear?: string;
  appliedDate?: Date | null;
  gender?: string;
  status?: string;
  keywordSearch?: string;
  issuedBy?: string;
  issuedDate?: Date | null;
  issuedType?: string;
  applicationNo?: string;
  studentId?: string;
  mobileNumber?: string;
}

export type ReportTab = "categories-wise" | "scholarship-issued" | "approved-form";
