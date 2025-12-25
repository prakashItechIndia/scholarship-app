import { ScholarshipReportData } from "./types";

// Mock data for demonstration - replace with actual API calls
export const mockScholarshipData: ScholarshipReportData[] = [
  {
    applicationNo: "AF2510001",
    aadhaarId: "375470648340",
    studentName: "Kavipriya",
    studentId: "SEC21CB033",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute",
    fatherName: "Kumar",
    fatherOfficeName: "TCS",
    motherName: "Lakshmi",
    motherOfficeName: "-",
    guardianName: "-",
    guardianOfficeName: "-",
    gender: "Female",
    checkInFavor: "Sai Ram Institute",
    approvedAmount: "50000",
    issuedAmount: "50000",
    scholarshipId: "SCH25001",
    ddCheckNo: "DD987654",
    donateDate: "20/06/2025",
    bankName: "HDFC Bank",
    appliedDate: "15/05/2025",
    scholarshipYear: "2024-2025",
    scholarshipFor: "Tuition Fee",
    status: "Approved",
  },
  {
    applicationNo: "AF2510002",
    aadhaarId: "482736159204",
    studentName: "Malathi",
    studentId: "SEC21CB034",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute",
    fatherName: "Ravi",
    fatherOfficeName: "Infosys",
    motherName: "Sita",
    motherOfficeName: "School",
    guardianName: "-",
    guardianOfficeName: "-",
    gender: "Female",
    checkInFavor: "Sai Ram Institute",
    approvedAmount: "45000",
    issuedAmount: "45000",
    scholarshipId: "SCH25002",
    ddCheckNo: "DD987655",
    donateDate: "21/06/2025",
    bankName: "SBI",
    appliedDate: "16/05/2025",
    scholarshipYear: "2024-2025",
    scholarshipFor: "Tuition Fee",
    status: "Approved",
  },
  {
    applicationNo: "AF2510003",
    aadhaarId: "593847260315",
    studentName: "Ananya",
    studentId: "SEC21CB035",
    classStudying: "B.Tech",
    institutionName: "Sai Ram Institute",
    fatherName: "Suresh",
    fatherOfficeName: "Self Employed",
    motherName: "Gita",
    motherOfficeName: "-",
    guardianName: "-",
    guardianOfficeName: "-",
    gender: "Female",
    checkInFavor: "Sai Ram Institute",
    approvedAmount: "55000",
    issuedAmount: "55000",
    scholarshipId: "SCH25003",
    ddCheckNo: "DD987656",
    donateDate: "22/06/2025",
    bankName: "Axis Bank",
    appliedDate: "17/05/2025",
    scholarshipYear: "2024-2025",
    scholarshipFor: "Hostel Fee",
    status: "Completed",
  },
  {
    applicationNo: "AF2510004",
    aadhaarId: "674829301456",
    studentName: "Kavya",
    studentId: "SEC21CB036",
    classStudying: "12th",
    institutionName: "Sai Ram School",
    fatherName: "Murugan",
    fatherOfficeName: "Driver",
    motherName: "Valli",
    motherOfficeName: "-",
    guardianName: "-",
    guardianOfficeName: "-",
    gender: "Female",
    checkInFavor: "Sai Ram School",
    approvedAmount: "25000",
    issuedAmount: "25000",
    scholarshipId: "SCH25004",
    ddCheckNo: "DD987657",
    donateDate: "23/06/2025",
    bankName: "ICICI Bank",
    appliedDate: "18/05/2025",
    scholarshipYear: "2024-2025",
    scholarshipFor: "School Fee",
    status: "Waiting",
  },
  {
    applicationNo: "AF2510005",
    aadhaarId: "785920413567",
    studentName: "Meera",
    studentId: "SEC21CB037",
    classStudying: "SSLC",
    institutionName: "Govt. School",
    fatherName: "Karthik",
    fatherOfficeName: "-",
    motherName: "Revathy",
    motherOfficeName: "Nurse",
    guardianName: "-",
    guardianOfficeName: "-",
    gender: "Female",
    checkInFavor: "Meera",
    approvedAmount: "10000",
    issuedAmount: "0",
    scholarshipId: "-",
    ddCheckNo: "-",
    donateDate: "-",
    bankName: "-",
    appliedDate: "19/05/2025",
    scholarshipYear: "2024-2025",
    scholarshipFor: "Books",
    status: "Registered",
  },
];

export const academicYearOptions = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2021-2022", label: "2021-2022" },
];

export const genderOptions = [
  { value: "all", label: "All Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const statusOptions = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "registered", label: "Registered" },
  { value: "rejected", label: "Rejected" },
  { value: "waiting", label: "Waiting" },
];

export const issuedTypeOptions = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual" },
  { value: "institution", label: "Institution" },
  { value: "concession", label: "Concession" },
];

// Main Category options for Categories Report
export const mainCategoryOptions = [
  { value: "", label: "--Select--" },
  { value: "Applied Date", label: "Applied Date" },
  { value: "Amount", label: "Amount" },
  { value: "Gender", label: "Gender" },
  { value: "Issued to", label: "Issued to" },
  { value: "Processed Date", label: "Processed Date" },
  { value: "Status", label: "Status" },
  { value: "Sairam Group", label: "Sairam Group" },
  { value: "Parent Office", label: "Parent Office" },
  { value: "Favour Type", label: "Favour Type" },
];

// Amount options
export const amountOptions = [
  { value: "", label: "--Select--" },
  { value: "Below 5000", label: "Below 5000" },
  { value: "5000-10000", label: "5000-10000" },
  { value: "10000-20000", label: "10000-20000" },
  { value: "20000-50000", label: "20000-50000" },
  { value: "Above 50000", label: "Above 50000" },
];

// Issued To options
export const issuedToOptions = [
  { value: "", label: "--Select--" },
  { value: "All", label: "All" },
  { value: "College", label: "College" },
  { value: "Research", label: "Research" },
  { value: "School", label: "School" },
];

// Sairam Category options
export const sairamCategoryOptions = [
  { value: "All", label: "All" },
  { value: "College", label: "College" },
  { value: "School", label: "School" },
  { value: "Polytechnic", label: "Polytechnic" },
  { value: "Medical", label: "Medical" },
];

// College options
export const collegeOptions = [
  { value: "All", label: "All" },
  { value: "Sri Sai Ram Engineering College", label: "Sri Sai Ram Engineering College" },
  { value: "Sri Sai Ram Institute Of Technology", label: "Sri Sai Ram Institute Of Technology" },
  { value: "Sri Sairam College Of Engineering", label: "Sri Sairam College Of Engineering" },
];

// School options
export const schoolOptions = [
  { value: "All", label: "All" },
  { value: "Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai", label: "Sai Ram Matriculation Hr. Sec. School,West Tambaram,Chennai" },
  { value: "Sai Matriculation Hr Sec School,Madipakkam", label: "Sai Matriculation Hr Sec School,Madipakkam" },
  { value: "Sai Ram Vidyalaya,Madipakkam,Chennai", label: "Sai Ram Vidyalaya,Madipakkam,Chennai" },
  { value: "Sai Ram Vidyalaya,Ullavaikal,Pondicherry", label: "Sai Ram Vidyalaya,Ullavaikal,Pondicherry" },
  { value: "Sai Ram Matriculation Hr Sec School,Thiruthuripoondi", label: "Sai Ram Matriculation Hr Sec School,Thiruthuripoondi" },
  { value: "Sai Ram Matriculation School,Thiruvarur", label: "Sai Ram Matriculation School,Thiruvarur" },
  { value: "Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai", label: "Sai Ram Matriculation Hr Sec School,Goripalayam,Madurai" },
];

// Polytechnic options
export const polytechnicOptions = [
  { value: "All", label: "All" },
  { value: "Sri Sai Ram Polytechnic College,West Tambaram,Chennai", label: "Sri Sai Ram Polytechnic College,West Tambaram,Chennai" },
  { value: "Sai Jothi Polytechnic College,Ellayarpathi,Madurai", label: "Sai Jothi Polytechnic College,Ellayarpathi,Madurai" },
];

// Medical options
export const medicalOptions = [
  { value: "All", label: "All" },
  { value: "Sri Sai Ram Siddha,West Tambaram,Chennai", label: "Sri Sai Ram Siddha,West Tambaram,Chennai" },
  { value: "Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai", label: "Sri Sai Ram Ayur. Medical College & Research Centre,West Tambaram,Chennai" },
  { value: "Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai", label: "Sri Sai Ram Homoeopathy Medical College & Research,West Tambaram,Chennai" },
];

// Favour Category options
export const favourCategoryOptions = [
  { value: "All", label: "All" },
  { value: "Individual", label: "Cheque" },
  { value: "Concession", label: "Concession" },
  { value: "Institution", label: "Institution" },
];

// Favour Group options
export const favourGroupOptions = [
  { value: "All", label: "All" },
  { value: "Sairam Group", label: "Sairam Group" },
  { value: "Out Of Sairam Group", label: "Out Of Sairam Group" },
];

// Main Category options for Scholarship Issued Report
export const scholarshipIssuedMainCategoryOptions = [
  { value: "", label: "--Select--" },
  { value: "Issued By", label: "Issued By" },
  { value: "Issued Date", label: "Issued Date" },
];

// Cheque In Favor Type options
export const chequeInFavorTypeOptions = [
  { value: "All", label: "All" },
  { value: "Individual", label: "Individual" },
  { value: "Institution", label: "Institution" },
  { value: "Concession", label: "Concession" },
];

