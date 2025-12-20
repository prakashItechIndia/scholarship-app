export interface ApplicationData {
  applicationNo: string;
  studentName: string;
  classStudying?: string;
  institutionName?: string;
  fatherAnnualIncome?: string;
  mobileNumber?: string;
  fatherOccupation?: string;
  documentType?: string;
  status?: string;
  uploadedDate?: string;
  verifiedBy?: string;
  verificationStatus?: string;
  verifiedDate?: string;
  pdfUrl?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedDate: string;
    status: string;
    size?: string;
  }>;
  [key: string]: unknown;
}

