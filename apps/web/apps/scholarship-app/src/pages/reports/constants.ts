import { ScholarshipReportData } from "./types";

// Mock data for demonstration - replace with actual API calls
export const mockScholarshipData: ScholarshipReportData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    studentId: "SEC21CB033",
    institutionName: "Leo Muthu Scholarship...",
    scholarshipId: "24LMSS1002",
    checkNo: "004545",
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    studentId: "SEC21CB034",
    institutionName: "Leo Muthu Scholarship...",
    scholarshipId: "24LMSS1002",
    checkNo: "123456",
  },
  {
    applicationNo: "AF2510003",
    studentName: "Agathiyan",
    studentId: "SEC21CB035",
    institutionName: "Leo Muthu Scholarship...",
    scholarshipId: "24LMSS1002",
    checkNo: "789012",
  },
  {
    applicationNo: "AF2510004",
    studentName: "Viswamithran",
    studentId: "SEC21CB036",
    institutionName: "Leo Muthu Scholarship...",
    scholarshipId: "24LMSS1002",
    checkNo: "345678",
  },
  {
    applicationNo: "AF2510005",
    studentName: "Aravind",
    studentId: "SEC21CB037",
    institutionName: "Leo Muthu Scholarship...",
    scholarshipId: "24LMSS1002",
    checkNo: "901234",
  },
];

export const academicYearOptions = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2021-2022", label: "2021-2022" },
];

export const genderOptions = [
  { value: "all", label: "All" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const statusOptions = [
  { value: "all", label: "All" },
  { value: "registered", label: "Registered" },
  { value: "verified", label: "Verified" },
  { value: "approved", label: "Approved" },
];

