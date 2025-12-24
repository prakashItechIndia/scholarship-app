import {
  ApplicationActivityData,
  ScholarshipDistributionData,
  CalendarEvent,
  RecentApplication,
} from "./types";

// Mock data for Application Activity Chart
export const mockApplicationActivityData: ApplicationActivityData[] = Array.from(
  { length: 30 },
  (_, i) => ({
    date: `${i + 1}`,
    count: Math.floor(Math.random() * 400) + 50,
  })
);

// Mock data for Scholarship Program Distribution
export const mockScholarshipDistributionData: ScholarshipDistributionData[] = [
  { month: "June", meritExcellence: 25, stemInnovation: 30, concessions: 20, sports: 15 },
  { month: "July", meritExcellence: 30, stemInnovation: 35, concessions: 25, sports: 20 },
  { month: "August", meritExcellence: 28, stemInnovation: 32, concessions: 22, sports: 18 },
  { month: "September", meritExcellence: 35, stemInnovation: 40, concessions: 30, sports: 25 },
  { month: "October", meritExcellence: 32, stemInnovation: 38, concessions: 28, sports: 22 },
  { month: "November", meritExcellence: 30, stemInnovation: 35, concessions: 25, sports: 20 },
  { month: "December", meritExcellence: 28, stemInnovation: 32, concessions: 22, sports: 18 },
];

// Mock calendar events
export const mockCalendarEvents: CalendarEvent[] = [
  { date: "2024-10-07", title: "Annual Review Meeting", type: "meeting" },
  { date: "2024-10-15", title: "Application Deadline", type: "deadline" },
  { date: "2024-10-20", title: "Scholarship Distribution", type: "activity" },
];

// Mock recent applications
export const mockRecentApplications: RecentApplication[] = [
  {
    applicationNo: "AF2M0001",
    studentName: "Ramapriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Technology",
    mobileNumber: "+91 9876543210",
    status: "Registered",
    scholarshipId: "1",
  },
  {
    applicationNo: "AF2M0002",
    studentName: "Malarani",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Technology",
    mobileNumber: "+91 9876543211",
    status: "Registered",
    scholarshipId: "1",
  },
  {
    applicationNo: "AF2M0003",
    studentName: "Aparna",
    classStudying: "B.Tech",
    institutionName: "Sai Ram Institute of Technology",
    mobileNumber: "+91 9876543212",
    status: "Registered",
    scholarshipId: "1",
  },
  {
    applicationNo: "AF2M0004",
    studentName: "Bharathiraman",
    classStudying: "B.Sc",
    institutionName: "Sai Ram School",
    mobileNumber: "+91 9876543213",
    status: "Registered",
    scholarshipId: "1",
  },
  {
    applicationNo: "AF2M0005",
    studentName: "Aruna",
    classStudying: "M.Sc",
    institutionName: "Govt. Science College",
    mobileNumber: "+91 9876543214",
    status: "Registered",
    scholarshipId: "1",
  },
];

export const academicYearOptions = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2021-2022", label: "2021-2022" },
];

