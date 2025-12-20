import { ApplicationData } from "./types";

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
    status: "Verified",
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
    status: "Pending",
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
    status: "Approved",
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
    status: "Rejected",
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
    status: "Pending",
    documents: getDocumentsForApplication("AF2510005"),
  },
];

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

// Sample data for Documents tab
export const documentsData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    documentType: "Aadhaar",
    status: "Verified",
    uploadedDate: "2024-01-15",
    verifiedBy: "Admin",
    pdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    documents: getDocumentsForApplication("AF2510001"),
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    documentType: "PAN",
    status: "Pending",
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
    verificationStatus: "Approved",
    verifiedDate: "2024-01-20",
    verifiedBy: "Admin",
    documents: getDocumentsForApplication("AF2510001"),
  },
];

// Sample data for other tabs
export const suggestData: ApplicationData[] = [];
export const approveData: ApplicationData[] = [];
export const issueAmountData: ApplicationData[] = [];

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

