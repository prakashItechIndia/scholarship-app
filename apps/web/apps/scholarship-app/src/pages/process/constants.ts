import { ApplicationData } from "./types";

// Sample documents data for each application
export const getDocumentsForApplication = (applicationNo: string): Array<{
  name: string;
  type: string;
  url: string;
  size: string;
  uploadedDate: string;
  status: string;
}> => {
  const baseDocuments = [
    {
      name: "Birth Certificate.pdf",
      type: "Birth Certificate",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      size: "120 KB",
      uploadedDate: "2024-01-15",
      status: "Verified",
    },
    {
      name: "Student IDCard.pdf",
      type: "Student ID Card",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      size: "120 KB",
      uploadedDate: "2024-01-15",
      status: "Verified",
    },
    {
      name: "Bank Pass Book.pdf",
      type: "Bank Pass Book",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      size: "120 KB",
      uploadedDate: "2024-01-15",
      status: "Verified",
    },
    {
      name: "AADHAAR ID.pdf",
      type: "Aadhaar",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      size: "120 KB",
      uploadedDate: "2024-01-15",
      status: "Verified",
    },
    {
      name: "Letter.pdf",
      type: "Letter",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      size: "120 KB",
      uploadedDate: "2024-01-15",
      status: "Verified",
    },
  ];

  return baseDocuments;
};

// Sample data for Overview tab
export const overviewData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarshipNumber: "-",
    status: "Registered",
    scholarship: "1",
    preparedBy: "-",
    verifiedBy: "-",
    suggestedBy: "-",
    pdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    documents: getDocumentsForApplication("AF2510001"),
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarshipNumber: "-",
    status: "Registered",
    scholarship: "1",
    preparedBy: "-",
    verifiedBy: "-",
    suggestedBy: "-",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    documents: getDocumentsForApplication("AF2510002"),
  },
  {
    applicationNo: "AF2510003",
    studentName: "Agathiyan",
    classStudying: "B.Tech",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarshipNumber: "25LMSS1007",
    status: "Completed",
    scholarship: "1",
    preparedBy: "Admin",
    verifiedBy: "Deepak",
    suggestedBy: "Balaji",
    documents: getDocumentsForApplication("AF2510003"),
  },
  {
    applicationNo: "AF2510004",
    studentName: "Viswamithran",
    classStudying: "12th",
    institutionName: "Sai Ram School",
    fatherAnnualIncome: "30001-40000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Chennai Corporation",
    scholarshipNumber: "-",
    status: "Review",
    scholarship: "1",
    preparedBy: "-",
    verifiedBy: "-",
    suggestedBy: "-",
    documents: getDocumentsForApplication("AF2510004"),
  },
  {
    applicationNo: "AF2510005",
    studentName: "Aravind",
    classStudying: "SSLC",
    institutionName: "Govt. School",
    fatherAnnualIncome: "20001-30000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Self Employed",
    scholarshipNumber: "-",
    status: "Rejected",
    scholarship: "1",
    preparedBy: "-",
    verifiedBy: "-",
    suggestedBy: "-",
    documents: getDocumentsForApplication("AF2510005"),
  },
];



// Sample data for Documents tab
export const documentsData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    documentType: "Aadhaar",
    scholarship: "1",
    scholarshipNumber: "123456",
    preparedBy: "Staff",
    suggestedBy: "Mentor",
    status: "Completed", // Was Verified
    uploadedDate: "2024-01-15",
    verifiedBy: "Admin",
    pdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    documents: getDocumentsForApplication("AF2510001"),
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    scholarship: "1",
    fatherOccupation: "Private Sector",
    documentType: "PAN",
    status: "Review", // Was Pending
    uploadedDate: "2024-01-16",
    verifiedBy: "-",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    documents: getDocumentsForApplication("AF2510002"),
  },
];

// Sample data for Verify tab
export const verifyData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarship: "1",
    status: "Verified", // Or whatever status is appropriate
    verificationStatus: "Approved",
    verifiedDate: "2024-01-20",
    verifiedBy: "Admin",
    processActionLabel: "Verified",
    documents: getDocumentsForApplication("AF2510001"),
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarship: "1",
    status: "Documents Submitted",
    verificationStatus: "Pending",
    verifiedDate: "-",
    verifiedBy: "-",
    processActionLabel: "Verified",
    documents: getDocumentsForApplication("AF2510002"),
  },
];

// Sample data for other tabs
export const suggestData: ApplicationData[] = [
  {
    applicationNo: "AF2510003",
    studentName: "Agathiyan",
    classStudying: "B.Tech",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarship: "1",
    status: "Verified",
    processActionLabel: "Suggest 1",
    documents: getDocumentsForApplication("AF2510003"),
  },
  {
    applicationNo: "AF2510004",
    studentName: "Viswamithran",
    classStudying: "12th",
    institutionName: "Sai Ram School",
    fatherAnnualIncome: "30001-40000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Chennai Corporation",
    scholarship: "1",
    status: "Completed",
    processActionLabel: "Suggest 2",
    documents: getDocumentsForApplication("AF2510004"),
  },
];

export const approveData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarship: "1",
    status: "Approve",
    processActionLabel: "Approve",
    documents: getDocumentsForApplication("AF2510001"),
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
    scholarship: "1",
    status: "Approved",
    processActionLabel: "Approved",
    documents: getDocumentsForApplication("AF2510002"),
  },
];

export const issueAmountData: ApplicationData[] = [
  {
    applicationNo: "AF2510008",
    studentName: "Sivakumar",
    classStudying: "MBA",
    institutionName: "Anna University",
    fatherAnnualIncome: "50000-60000",
    mobileNumber: "91 98765 43210",
    fatherOccupation: "Services",
    scholarship: "1",
    status: "Approved",
    processActionLabel: "Issue Amount",
    documents: getDocumentsForApplication("AF2510008"),
  },
  {
    applicationNo: "AF2510009",
    studentName: "Priya",
    classStudying: "B.Sc",
    institutionName: "Ethiraj College",
    fatherAnnualIncome: "20000-30000",
    mobileNumber: "91 87654 32109",
    fatherOccupation: "Agriculture",
    scholarship: "1",
    status: "Approved",
    processActionLabel: "Issue Amount",
    documents: getDocumentsForApplication("AF2510009"),
  },
];

// Tab-based data mapping
export const tabDataMap: Record<string, ApplicationData[]> = {
  overview: overviewData,
  documents: documentsData,
  verify: verifyData,
  suggest: suggestData,
  approve: approveData,
  "issue-amount": issueAmountData,
};

// Tab-based total items mapping
export const tabTotalItemsMap: Record<string, number> = {
  overview: 123,
  documents: 45,
  verify: 30,
  suggest: 15,
  approve: 8,
  "issue-amount": 5,
};

// Tab labels
export const tabLabels = [
  { value: "overview", label: "Overview" },
  { value: "documents", label: "Documents" },
  { value: "verify", label: "Verify" },
  { value: "suggest", label: "Suggest" },
  { value: "approve", label: "Approve" },
  { value: "issue-amount", label: "Issue Amount" },
];

export const samplePdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

export default {
  getDocumentsForApplication,
  overviewData,
  documentsData,
  verifyData,
  suggestData,
  approveData,
  issueAmountData,
  tabDataMap,
  tabTotalItemsMap,
  tabLabels,
  samplePdfUrl,
};

