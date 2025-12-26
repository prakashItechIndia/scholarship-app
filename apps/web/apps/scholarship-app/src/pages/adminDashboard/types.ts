export interface FinancialSummary {
  totalAmountSpentThisYear: number;
  amountSpentForSchoolStudents: number;
  amountSpentForCollegeStudents: number;
  amountSpentForResearchScholars: number;
  amountSpentForMedicalAssistance: number;
}

export interface ApplicationMetrics {
  totalApplications: number;
  submitted: number;
  approved: number;
  underReview: number;
}

export interface ApplicationActivityData {
  date: string;
  count: number;
}

export interface ScholarshipDistributionData {
  month: string;
  meritExcellence: number;
  stemInnovation: number;
  achievement: number;
  sports: number;
}

export interface CalendarEvent {
  date: string;
  title: string;
  type?: "meeting" | "deadline" | "activity";
}

export interface RecentApplication {
  applicationNo: string;
  studentName: string;
  classStudying: string;
  courseStream?: string;
  institutionName: string;
  roomNumber?: string;
  mobileNumber?: string;
  status: string;
  scholarshipId: string;
}

