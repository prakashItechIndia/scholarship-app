import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, PageActionButtons, CardSkeleton, TableSkeleton, Card, Skeleton } from "@shared/components";
import {
  ArrowDownload24Regular,
  ChevronDown24Regular,
  DocumentBulletList24Regular,
  DocumentCheckmark24Regular,
  DocumentTableSearch24Regular,
} from "@fluentui/react-icons";
import {
  People20Regular,
} from "@fluentui/react-icons";
import { UnifiedCard } from "./components/UnifiedCard";
import { FinancialSummaryCard } from "./components/FinancialSummaryCard";
import { ApplicationActivityChart } from "./components/ApplicationActivityChart";
import { ApplicationStatusChart } from "./components/ApplicationStatusChart";
import { RecentActivityWidget } from "./components/RecentActivityWidget";
import { PerformanceMetricsChart } from "./components/PerformanceMetricsChart";
import { FundSpendingChart } from "./components/FundSpendingChart";
import { ScholarshipDistributionChart } from "./components/ScholarshipDistributionChart";
import { ScheduleCalendar } from "./components/ScheduleCalendar";
import { RecentApplicationsTable } from "./components/RecentApplicationsTable";
import { Separator } from "./components/Separator";
import { dashboard, reports } from "@/services/scholarship.service";
import { useToast } from "@/components/ui/toast";
import { exportDashboardToExcel, exportDashboardToWord } from "@/utils/exportUtils";
import type { FinancialSummary, ApplicationMetrics, RecentApplication, ApplicationActivityData, ScholarshipDistributionData } from "./types";
import { mockCalendarEvents } from "./constants";

const AdminDashboard: React.FC = () => {
  const { error: showError } = useToast();
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date(2024, 8, 1)); // September 2024
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("Monthly");
  const [selectedStatusMonth, setSelectedStatusMonth] = React.useState<string>("October 2025");
  const [selectedYear, setSelectedYear] = React.useState<string>("2024 - 2025");
  
  // Get user name from localStorage
  const [userName, setUserName] = React.useState<string>("User");
  const currentYear = new Date().getFullYear();

  // State for dashboard data
  const [financialData, setFinancialData] = React.useState<FinancialSummary>({
    totalAmountSpentThisYear: 0,
    amountSpentForSchoolStudents: 0,
    amountSpentForCollegeStudents: 0,
    amountSpentForResearchScholars: 0,
    amountSpentForMedicalAssistance: 0,
  });

  const [applicationMetrics, setApplicationMetrics] = React.useState<ApplicationMetrics>({
    totalApplications: 0,
    submitted: 0,
    approved: 0,
    underReview: 0,
  });

  const [recentApplications, setRecentApplications] = React.useState<RecentApplication[]>([]);
  const [applicationActivityData, setApplicationActivityData] = React.useState<ApplicationActivityData[]>([]);
  const [programDistributionData, setProgramDistributionData] = React.useState<ScholarshipDistributionData[]>([]);
  const [academicYearOptions, setAcademicYearOptions] = React.useState<{ value: string; label: string }[]>([]);
  
  // Application Status Chart data
  const [applicationStatusData, setApplicationStatusData] = React.useState<{
    pending: number;
    inReview: number;
    rejected: number;
    approved: number;
  }>({
    pending: 0,
    inReview: 0,
    rejected: 0,
    approved: 0,
  });

  // Recent Activities data
  const [recentActivities, setRecentActivities] = React.useState<{
    name: string;
    action: string;
    timestamp: string;
    color: string;
    border: string;
  }[]>([]);

  // Performance Metrics data
  const [performanceMetrics, setPerformanceMetrics] = React.useState<{
    label: string;
    value: string;
    percentage: number;
    color: string;
  }[]>([]);

  // Fund Spending data
  const [fundSpendingData, setFundSpendingData] = React.useState<{
    month: string;
    budget2024: number;
    budget2025: number;
  }[]>([]);

  // Calendar Events data
  const [calendarEvents, setCalendarEvents] = React.useState<{
    date: string;
    title: string;
    type?: "meeting" | "deadline" | "activity";
  }[]>([]);

  // Loading state
  const [loading, setLoading] = React.useState(true);

  // Get username from localStorage
  React.useEffect(() => {
    try {
      const authData = localStorage.getItem('scholarship_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const name = parsed.user?.userName || parsed.user?.User_Name || parsed.email || "User";
        setUserName(name);
      }
    } catch (e) {
      console.error('Error reading username from storage:', e);
    }
  }, []);

  // Fetch academic years
  React.useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const years = await reports.getAcademicYears();
        const options = years.map((year: any) => ({
          value: year.ScholarshipYear_Id?.toString() || year.value?.toString() || "",
          label: year.ScholarshipYear_Code || year.label || "",
        }));
        setAcademicYearOptions(options);
        // Auto-select the first academic year to load dashboard data
        if (options.length > 0 && !selectedAcademicYear) {
          setSelectedAcademicYear(options[0].value);
        }
      } catch (err) {
        console.error('Error fetching academic years:', err);
      }
    };
    void fetchAcademicYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch dashboard data
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedAcademicYear) return;
      
      setLoading(true);
      try {
        const academicYearId = parseInt(selectedAcademicYear, 10);
        
        // Fetch all data in parallel
        const [financial, analytics, recent, activity, distribution, statusData, activities, metrics, fundSpending, calendar] = await Promise.all([
          dashboard.getFinancialSummary(academicYearId),
          dashboard.getApplicationAnalytics(academicYearId),
          dashboard.getRecentApplications(10, academicYearId),
          dashboard.getApplicationActivity(academicYearId),
          dashboard.getProgramDistribution(academicYearId),
          dashboard.getApplicationStatus(selectedStatusMonth, academicYearId),
          dashboard.getRecentActivities(5),
          dashboard.getPerformanceMetrics(academicYearId),
          dashboard.getFundSpending(selectedYear, academicYearId),
          dashboard.getCalendarEvents(undefined, academicYearId),
        ]);

        // Map financial summary
        setFinancialData({
          totalAmountSpentThisYear: financial.Total_Amount_Spent || 0,
          amountSpentForSchoolStudents: financial.School_Students_Amount || 0,
          amountSpentForCollegeStudents: financial.College_Students_Amount || 0,
          amountSpentForResearchScholars: financial.Research_Scholars_Amount || 0,
          amountSpentForMedicalAssistance: financial.Medical_Assistance_Amount || 0,
        });

        // Map application analytics
        setApplicationMetrics({
          totalApplications: analytics.Total_Applications || 0,
          submitted: analytics.Submitted || 0,
          approved: analytics.Approved || 0,
          underReview: analytics.Under_Review || 0,
        });

        // Map recent applications
        const mappedRecent = recent.map((app: any) => ({
          applicationNo: app.Application_Id || app.applicationNo || "",
          studentName: app.Applicant_Name || app.studentName || "",
          classStudying: app.Class_Studying || app.classStudying || "",
          courseStream: app.Degree_Type || app.Degree || app.Course_Stream || app.courseStream || "",
          institutionName: app.Institution_Name || app.institutionName || "",
          roomNumber: app.Room_Number || app.roomNumber || "",
          mobileNumber: app.Mobile_Number || app.mobileNumber || "",
          status: app.Status || app.status || "Registered",
          scholarshipId: app.Scholarship_No?.toString() || app.scholarshipId || "",
        }));
        setRecentApplications(mappedRecent);

        // Map application activity data
        const mappedActivity = activity.map((item: any) => ({
          date: item.Month || item.date || "",
          count: item.Application_Count || item.count || 0,
        }));
        setApplicationActivityData(mappedActivity);

        // Map program distribution data (group by month and scholarship type)
        const distributionMap = new Map<string, { month: string; meritExcellence: number; stemInnovation: number; achievement: number; sports: number }>();
        distribution.forEach((item: any) => {
          const month = item.Month || item.month || "";
          const scholarshipFor = item.Scholarship_For || item.scholarshipFor || "";
          const amount = Number(item.Total_Amount || item.amount || 0);
          
          if (!distributionMap.has(month)) {
            distributionMap.set(month, {
              month,
              meritExcellence: 0,
              stemInnovation: 0,
              achievement: 0,
              sports: 0,
            });
          }
          
          const entry = distributionMap.get(month)!;
          if (scholarshipFor === "School" || scholarshipFor === "Merit Excellence") {
            entry.meritExcellence += amount;
          } else if (scholarshipFor === "College" || scholarshipFor === "STEM Innovation") {
            entry.stemInnovation += amount;
          } else if (scholarshipFor === "Research" || scholarshipFor === "Concessions" || scholarshipFor === "Achievement") {
            entry.achievement += amount;
          } else if (scholarshipFor === "Medical" || scholarshipFor === "Sports") {
            entry.sports += amount;
          }
        });
        
        setProgramDistributionData(Array.from(distributionMap.values()));

        // Map application status data
        setApplicationStatusData({
          pending: statusData.Pending || 0,
          inReview: statusData.In_Review || 0,
          rejected: statusData.Rejected || 0,
          approved: statusData.Approved || 0,
        });

        // Map recent activities
        const mappedActivities = activities.map((act: any) => {
          const userName = act.User_Name || act.ApplicantName || 'Unknown';
          let action = act.ProcessUndergone || act.Action || 'Activity';
          let color = '#EFF6FF'; // Default blue background
          let border = '1px solid #BFDBFE'; // Default blue border
          
          // Determine action, color, and border based on process
          if (action.includes('Submitted') || action.includes('Registered')) {
            color = '#E0F9E7'; // Green background
            border = '1px solid #58DB95'; // Green border
            action = `Submitted Application${act.Scholarship_No ? ` - Scholarship ${act.Scholarship_No}` : ''}`;
          } else if (action.includes('Updated') || action.includes('Profile')) {
            color = '#FDEEE4'; // Orange background
            border = '1px solid #F58969'; // Orange border
            action = 'Updated Profile';
          } else if (action.includes('Uploaded') || action.includes('Document')) {
            color = '#FFF8E5'; // Yellow background
            border = '1px solid #FECE79'; // Yellow border
            action = 'Uploaded Document';
          } else if (action.includes('Approved')) {
            color = '#EFF6FF'; // Blue background
            border = '1px solid #BFDBFE'; // Blue border
            action = `Application Approved${act.Scholarship_No ? ` - Scholarship ${act.Scholarship_No}` : ''}`;
          } else if (action.includes('Registered') || action.includes('Account')) {
            color = '#FAF5FF'; // Purple background
            border = '1px solid #E9D5FF'; // Purple border
            action = 'Registered Account';
          }

          // Format timestamp
          const date = act.Data_Date ? new Date(act.Data_Date) : new Date();
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timestamp = '';
          if (diffMins < 1) {
            timestamp = 'Just now';
          } else if (diffMins < 60) {
            timestamp = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
          } else if (diffHours < 24) {
            timestamp = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
          } else if (diffDays === 1) {
            const hours = date.getHours();
            const mins = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            timestamp = `Yesterday, ${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
          } else {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            timestamp = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
          }

          return {
            name: userName,
            action,
            timestamp,
            color,
            border,
          };
        });
        setRecentActivities(mappedActivities);

        // Map performance metrics
        const mappedMetrics = [
          {
            label: 'Average Processing Time',
            value: metrics.averageProcessingTime.value,
            percentage: metrics.averageProcessingTime.percentage,
            color: '#3b82f6',
          },
          {
            label: 'Student Retention Rate',
            value: metrics.studentRetentionRate.value,
            percentage: metrics.studentRetentionRate.percentage,
            color: '#f59e0b',
          },
          {
            label: 'Satisfaction Score',
            value: metrics.satisfactionScore.value,
            percentage: metrics.satisfactionScore.percentage,
            color: '#10b981',
          },
          {
            label: 'Budget Utilization',
            value: metrics.budgetUtilization.value,
            percentage: metrics.budgetUtilization.percentage,
            color: '#8b5cf6',
          },
        ];
        setPerformanceMetrics(mappedMetrics);

        // Map fund spending data
        setFundSpendingData(fundSpending);

        // Map calendar events
        const mappedCalendarEvents = Array.isArray(calendar) && calendar.length > 0
          ? calendar.map((event: any) => ({
              date: event.date || event.Date || event.eventDate || "",
              title: event.title || event.Title || event.eventTitle || event.name || "",
              type: event.type || event.Type || event.eventType || "meeting",
            }))
          : mockCalendarEvents; // Fallback to mock data if API returns empty
        setCalendarEvents(mappedCalendarEvents);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        showError('Error', err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [selectedAcademicYear, selectedStatusMonth, selectedYear, showError]);

  const handleExportExcel = async () => {
    try {
      const selectedYearLabel = academicYearOptions.find(
        (opt) => opt.value === selectedAcademicYear,
      )?.label || selectedAcademicYear;

      await exportDashboardToExcel(
        financialData,
        applicationMetrics,
        recentApplications,
        selectedYearLabel,
        userName,
      );
    } catch (error) {
      console.error("Error exporting dashboard:", error);
      showError("Error", "Failed to export dashboard. Please try again.");
    }
  };

  const handleExportWord = async () => {
    try {
      const selectedYearLabel = academicYearOptions.find(
        (opt) => opt.value === selectedAcademicYear,
      )?.label || selectedAcademicYear;

      await exportDashboardToWord(
        financialData,
        applicationMetrics,
        recentApplications,
        selectedYearLabel,
        userName,
      );
    } catch (error) {
      console.error("Error exporting dashboard:", error);
      showError("Error", "Failed to export dashboard. Please try again.");
    }
  };

  // Indian Rupee symbol function
  const getIndianRupeeIcon = (color: string = "#2453C3") => (
    <span style={{
      fontSize: "28px",
      // fontWeight: 700,
      color: color,
      fontFamily: "'Inter', sans-serif",
    }}>
      ₹
    </span>
  );

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      padding: "15px 24px 24px 24px",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 0,
    }}>
      {/* Header Section with PageActionButtons */}
      <div style={{
        flexShrink: 0,
        marginLeft: "-24px",
        marginRight: "-24px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "12px",
      }}>
        <PageActionButtons
          title={
            <div>
              <h1 style={{
                fontSize: "16px",
                lineHeight: "22px",
                fontWeight: 600,
                color: "#242424",
                // marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
              }}>
                Hello {userName}!
              </h1>
              <p style={{
                fontSize: "12px",
                lineHeight: "22px",
                fontWeight: 400,
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}>
                Welcome back to the Leo Muthu Scholarship Portal. View your {currentYear} performance metrics below.
              </p>
            </div>
          }
        >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  style={{
                    width: "127px",
                    height: "32px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #E0E0E0",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: selectedAcademicYear ? "#242424" : "#616161",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",fontSize:"12px",color:"#616161",fontWeight:400 }}>
                    {selectedAcademicYear 
                      ? academicYearOptions.find(opt => opt.value === selectedAcademicYear)?.label || selectedAcademicYear
                      : "Academic Year"}
                  </span>
                  <ChevronDown24Regular style={{ width: "16px", height: "16px", color: "#616161", flexShrink: 0 }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {academicYearOptions.length > 0 ? (
                  academicYearOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value} 
                      onClick={() => setSelectedAcademicYear(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem onClick={() => setSelectedAcademicYear("2025")}>
                    2025
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                style={{
                  backgroundColor: "#0f6cbd",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  height: "32px",
                  width: "105px",
                }}
              >
                <ArrowDownload24Regular style={{ width: "16px", height: "16px",}} />
                <span style={{color:"#FFFFFF",lineHeight:"20px",fontSize:"12px"}}> Export</span>
                <ChevronDown24Regular style={{ width: "16px", height: "16px" ,color:"#FFFFFF"}} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportExcel}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportWord}>
                Export to Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageActionButtons>
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#ffffff",
        marginBottom: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
        marginLeft: "-24px",
        marginRight: "-24px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}>
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            width: "100%",
          }}>
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px" }} />
          </div>
        ) : (
          <>
            <style>{`
              .financial-cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 12px;
                width: 100%;
              }
              @media (min-width: 1400px) {
                .financial-cards-grid {
                  grid-template-columns: repeat(4, 1fr);
                }
              }
              @media (max-width: 1200px) {
                .financial-cards-grid {
                  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                }
              }
              @media (max-width: 900px) {
                .financial-cards-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              @media (max-width: 600px) {
                .financial-cards-grid {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>
            <div className="financial-cards-grid">
            <FinancialSummaryCard
              icon={getIndianRupeeIcon("#2453C3")}
              value={financialData.totalAmountSpentThisYear}
              label="Total Amount Spent This Year"
              showCurrency={true}
              iconBgColor="#FFFFFF"
              color="#EFF6FF"
            />
            <FinancialSummaryCard
              icon={getIndianRupeeIcon("#2453C3")}
              value={financialData.amountSpentForSchoolStudents}
              label="Amount Spent for School Students"
              showCurrency={true}
              iconBgColor="#FFFFFF"
              color="#F0FDF4"
            />
            <FinancialSummaryCard
              icon={getIndianRupeeIcon("#2453C3")}
              value={financialData.amountSpentForCollegeStudents}
              label="Amount Spent for College Students"
              showCurrency={true}
              iconBgColor="#FFFFFF"
              color="#FAF5FF"
            />
            <FinancialSummaryCard
              icon={getIndianRupeeIcon("#2453C3")}
              value={financialData.amountSpentForResearchScholars}
              label="Amount Spent for Research Scholars"
              showCurrency={true}
              iconBgColor="#FFFFFF"
              color="#FFFBEB"
            />
            <FinancialSummaryCard
              icon={getIndianRupeeIcon("#2453C3")}
              value={financialData.amountSpentForMedicalAssistance}
              label="Amount Spent for Medical Assistance"
              showCurrency={true}
              iconBgColor="#FFFFFF"
              color="#FFEFEE"
            />
            </div>
          </>
        )}
      </div>

      {/* Scrollable Content Container - Starting from Applications Analytics */}
      <div 
        style={{
          width: "100%",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          marginTop: "-15px",
          minHeight: 0,
        }}
        className="dashboard-scrollable-content"
      >
        <style>{`
          .dashboard-scrollable-content::-webkit-scrollbar {
            width: 8px;
          }
          .dashboard-scrollable-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .dashboard-scrollable-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          .dashboard-scrollable-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
      {/* Applications Analytics Section */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        <h2 style={{
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "16px",
          fontFamily: "'Inter', sans-serif",
          // marginTop:"20px"
          // paddingTop:"-20px"
        }}>
          Applications Analytics & Reports
        </h2>
        {loading ? (
          <div style={{
            display: "flex",
            gap: "9px",
            marginBottom: "16px",
          }}>
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px", flex: 1, width: "100%" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px", flex: 1, width: "100%" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px", flex: 1, width: "100%" }} />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ height: "100px", flex: 1, width: "100%" }} />
          </div>
        ) : (
          <div style={{
            display: "flex",
            gap: "9px",
          }}>
            <UnifiedCard
              icon={<People20Regular style={{ width: "24px", height: "24px", color: "#2453C3" }} />}
              value={applicationMetrics.totalApplications}
              label="Total Applications"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentBulletList24Regular style={{ width: "24px", height: "24px", color: "#2453C3" }} />}
              value={applicationMetrics.submitted}
              label="Submitted"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentCheckmark24Regular style={{ width: "24px", height: "24px", color: "#2453C3" }} />}
              value={applicationMetrics.approved}
              label="Approved"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentTableSearch24Regular style={{ width: "24px", height: "24px", color: "#2453C3" }} />}
              value={applicationMetrics.underReview}
              label="Under Review"
              iconBgColor="#FFFFFF"
            />
          </div>
        )}
      </div>
      {/* Application Activity Chart - Full Width */}
      {loading ? (
        <div style={{ marginBottom: "16px" }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <div style={{
          marginBottom: "16px",
        }}>
          <ApplicationActivityChart
          data={applicationActivityData}
          selectedDate={selectedMonth}
          onDateChange={(date) => date && setSelectedMonth(date)}
        />
        </div>
      )}
     

      {/* Application Status and Recent Activity Row - 2 Columns */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "16px",
        }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "16px",
        }}>
          {/* Application Status Donut Chart */}
          <ApplicationStatusChart
            data={applicationStatusData}
            selectedMonth={selectedStatusMonth}
            onMonthChange={setSelectedStatusMonth}
          />

          {/* Recent Activity Widget */}
          <RecentActivityWidget activities={recentActivities} />
        </div>
      )}

      {/* Performance Metrics, Fund Spending, Scholarship Distribution, and Schedule Calendar - 2x2 Grid */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "16px",
        }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <>
          {/* Performance Metrics, Fund Spending, and Scholarship Distribution - 3 Columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "16px",
          }}>
            {/* Performance Metrics Chart */}
            <PerformanceMetricsChart metrics={performanceMetrics} />

            {/* Fund Spending Chart */}
            <FundSpendingChart
              data={fundSpendingData}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>

          {/* Schedule Calendar - Full Width or Right Aligned */}
          {/* Scholarship Distribution and Schedule Calendar Row */}
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "1fr 450px",
            gap: "24px",
            marginBottom: "16px" 
          }}>
            <ScholarshipDistributionChart
              data={programDistributionData}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
            <ScheduleCalendar events={calendarEvents} />
          </div>
        </>
      )}

      {/* Recent Applications Table */}
      {loading ? (
        <Card variant="elevated" style={{
          border: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
        }}>
          <div style={{
            marginBottom: "16px",
          }}>
            <Skeleton width="200px" height={24} variant="rounded" />
            <Skeleton width="300px" height={20} variant="rounded" style={{ marginTop: "4px" }} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <TableSkeleton
              columnCount={7}
              rowCount={5}
              columnWidths={[150, 150, 180, 200, 150, 120, 120]}
              showCheckbox={true}
            />
          </div>
        </Card>
      ) : (
        <RecentApplicationsTable data={recentApplications.length > 0 ? recentApplications : []} />
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
