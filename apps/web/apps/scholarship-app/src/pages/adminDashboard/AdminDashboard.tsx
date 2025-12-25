import * as React from "react";
import { Select, PageActionButtons, CardSkeleton, TableSkeleton, Card, Skeleton } from "@shared/components";
import {
  DocumentBulletList24Regular,
  DocumentCheckmark24Regular,
  DocumentTableSearch24Regular,
} from "@fluentui/react-icons";
import { ExportButton } from "@/components/common";
import {
  People20Regular,
} from "@fluentui/react-icons";
import { UnifiedCard } from "./components/UnifiedCard";
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

const AdminDashboard: React.FC = () => {
  const { error: showError } = useToast();
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("September 2024");
  const [selectedPeriod, setSelectedPeriod] = React.useState("Monthly");
  const [selectedStatusMonth, setSelectedStatusMonth] = React.useState<string>("October 2025");
  const [selectedYear, setSelectedYear] = React.useState<string>("2024 - 2025");
  
  // Get user name from localStorage
  const [userName, setUserName] = React.useState<string>("User");

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
        // Set default to first year if available
        if (options.length > 0 && !selectedAcademicYear) {
          setSelectedAcademicYear(options[0].value);
        }
      } catch (err) {
        console.error('Error fetching academic years:', err);
      }
    };
    void fetchAcademicYears();
  }, [selectedAcademicYear]);

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
        const distributionMap = new Map<string, { month: string; meritExcellence: number; stemInnovation: number; concessions: number; sports: number }>();
        distribution.forEach((item: any) => {
          const month = item.Month || item.month || "";
          const scholarshipFor = item.Scholarship_For || item.scholarshipFor || "";
          const amount = Number(item.Total_Amount || item.amount || 0);
          
          if (!distributionMap.has(month)) {
            distributionMap.set(month, {
              month,
              meritExcellence: 0,
              stemInnovation: 0,
              concessions: 0,
              sports: 0,
            });
          }
          
          const entry = distributionMap.get(month)!;
          if (scholarshipFor === "School" || scholarshipFor === "Merit Excellence") {
            entry.meritExcellence += amount;
          } else if (scholarshipFor === "College" || scholarshipFor === "STEM Innovation") {
            entry.stemInnovation += amount;
          } else if (scholarshipFor === "Research" || scholarshipFor === "Concessions") {
            entry.concessions += amount;
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
          let color = '#3b82f6'; // Default blue
          
          // Determine action and color based on process
          if (action.includes('Submitted') || action.includes('Registered')) {
            color = '#10b981'; // Green
            action = `Submitted Application${act.Scholarship_No ? ` - Scholarship ${act.Scholarship_No}` : ''}`;
          } else if (action.includes('Updated') || action.includes('Profile')) {
            color = '#f59e0b'; // Orange
            action = 'Updated Profile';
          } else if (action.includes('Uploaded') || action.includes('Document')) {
            color = '#eab308'; // Yellow
            action = 'Uploaded Document';
          } else if (action.includes('Approved')) {
            color = '#3b82f6'; // Blue
            action = `Application Approved${act.Scholarship_No ? ` - Scholarship ${act.Scholarship_No}` : ''}`;
          } else if (action.includes('Registered') || action.includes('Account')) {
            color = '#8b5cf6'; // Purple
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
        setCalendarEvents(calendar);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        showError('Error', err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [selectedAcademicYear, selectedStatusMonth, selectedYear, showError]);

  const handleExport = async (format: "excel" | "word" | "pdf" | "csv") => {
    try {
      const selectedYearLabel = academicYearOptions.find(
        (opt) => opt.value === selectedAcademicYear,
      )?.label || selectedAcademicYear;

      if (format === "excel") {
        await exportDashboardToExcel(
          financialData,
          applicationMetrics,
          recentApplications,
          selectedYearLabel,
          userName,
        );
      } else if (format === "word") {
        await exportDashboardToWord(
          financialData,
          applicationMetrics,
          recentApplications,
          selectedYearLabel,
          userName,
        );
      } else {
        console.warn(`Export format ${format} not yet implemented`);
      }
    } catch (error) {
      console.error("Error exporting dashboard:", error);
      showError("Error", "Failed to export dashboard. Please try again.");
    }
  };

  // Indian Rupee symbol function
  const getIndianRupeeIcon = (color = "#2453C3") => (
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
    }}>
      {/* Header Section with PageActionButtons */}
      <div style={{
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
                marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
              }}>
                Hello {userName}!
              </h1>
              <p style={{
                fontSize: "12px",
                lineHeight: "22px",
                fontWeight: 400,
                color: "#707070",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}>
                An initiative of Shri. Leo Mutha Scholarship Trust. View your LMS performance metrics below.
              </p>
            </div>
          }
        >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{ width: "140px",marginRight: "120px" }}>
            <Select
              placeholder="Academic Year"
              options={academicYearOptions}
              selectedKey={selectedAcademicYear}
              onValueChange={(value) => setSelectedAcademicYear(value)}
            />
          </div>
          <ExportButton
            options={[
              { format: "excel", label: "Export to Excel" },
              { format: "word", label: "Export to Word" },
            ]}
            onExport={handleExport}
            size="medium"
          />
        </div>
      </PageActionButtons>
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        marginBottom: "32px",
        paddingBottom: "24px",
        marginLeft: "-24px",
        marginRight: "-24px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderBottom: "1px solid #e0e0e0",
      }}>
        {loading ? (
          <>
            {/* First row - 4 cards skeleton */}
            <div style={{
              display: "flex",
              alignItems: "stretch",
              gap: "15px",
              marginBottom: "16px",
            }}>
              <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ backgroundColor: "#EFF6FF", minWidth: "430px", height: "100px" }} />
              <Separator height="auto" />
              <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ backgroundColor: "#F0FDF4", minWidth: "430px", height: "100px" }} />
              <Separator height="auto" />
              <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ backgroundColor: "#FAF5FF", minWidth: "430px", height: "100px" }} />
              <Separator height="auto" />
              <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ backgroundColor: "#FFFBEB", minWidth: "430px", height: "100px" }} />
            </div>
            {/* Second row - 5th card skeleton */}
            <div style={{
              display: "flex",
              gap: "16px",
            }}>
              <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ backgroundColor: "#FFEFEE", minWidth: "430px", height: "100px" }} />
            </div>
          </>
        ) : (
          <>
            {/* First row - 4 cards */}
            <div style={{
              display: "flex",
              alignItems: "stretch",
              gap: "15px",
              marginBottom: "16px",
            }}>
              <UnifiedCard
                icon={getIndianRupeeIcon("#2453C3")}
                value={financialData.totalAmountSpentThisYear}
                label="Total Amount Spent This Year"
                showCurrency={true}
                iconBgColor="#FFFFFF"
                color="#EFF6FF"
              />
              <Separator height="auto" />
              <UnifiedCard
                icon={getIndianRupeeIcon("#2453C3")}
                value={financialData.amountSpentForSchoolStudents}
                label="Amount Spent for School Students"
                showCurrency={true}
                iconBgColor="#FFFFFF"
                color="#F0FDF4"
              />
              <Separator height="auto" />
              <UnifiedCard
                icon={getIndianRupeeIcon("#2453C3")}
                value={financialData.amountSpentForCollegeStudents}
                label="Amount Spent for College Students"
                showCurrency={true}
                iconBgColor="#FFFFFF"
                color="#FAF5FF"
              />
              <Separator height="auto" />
              <UnifiedCard
                icon={getIndianRupeeIcon("#2453C3")}
                value={financialData.amountSpentForResearchScholars}
                label="Amount Spent for Research Scholars"
                showCurrency={true}
                iconBgColor="#FFFFFF"
                color="#FFFBEB"
              />
            </div>
            {/* Second row - 5th card */}
            <div style={{
              display: "flex",
              gap: "16px",
            }}>
              <UnifiedCard
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

      {/* Applications Analytics Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "16px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Applications Analytics & Reports
        </h2>
        {loading ? (
          <div style={{
            display: "flex",
            gap: "16px",
          }}>
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ minWidth: "430px", height: "100px" }} />
            <Separator height="auto" />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ minWidth: "430px", height: "100px" }} />
            <Separator height="auto" />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ minWidth: "430px", height: "100px" }} />
            <Separator height="auto" />
            <CardSkeleton variant="elevated" showIcon={true} showHeader={false} contentSections={0} style={{ minWidth: "430px", height: "100px" }} />
          </div>
        ) : (
          <div style={{
            display: "flex",
            gap: "16px",
          }}>
            <UnifiedCard
              icon={<People20Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
              value={applicationMetrics.totalApplications}
              label="Total Applications"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentBulletList24Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
              value={applicationMetrics.submitted}
              label="Submitted"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentCheckmark24Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
              value={applicationMetrics.approved}
              label="Approved"
              iconBgColor="#FFFFFF"
            />
            <Separator height="auto" />
            <UnifiedCard
              icon={<DocumentTableSearch24Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
              value={applicationMetrics.underReview}
              label="Funded (Inactive)"
              iconBgColor="#FFFFFF"
            />
          </div>
        )}
      </div>

      {/* Application Activity Chart - Full Width */}
      {loading ? (
        <div style={{ marginBottom: "32px" }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <div style={{ marginBottom: "32px" }}>
          <ApplicationActivityChart
            data={applicationActivityData}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      )}

      {/* Application Status and Recent Activity Row - 2 Columns */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}>
          {/* Application Status Donut Chart */}
          <ApplicationStatusChart
            data={applicationStatusData}
            selectedMonth={selectedStatusMonth}
            onMonthChange={setSelectedStatusMonth}
          />

          {/* Recent Activity Widget */}
          <RecentActivityWidget 
            activities={recentActivities}
            selectedMonth={selectedStatusMonth}
            onMonthChange={setSelectedStatusMonth}
          />
        </div>
      )}

      {/* Performance Metrics, Fund Spending, Scholarship Distribution, and Schedule Calendar - 2x2 Grid */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
          <CardSkeleton variant="elevated" showIcon={false} showHeader={true} contentSections={0} style={{ height: "400px" }} />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}>
          {/* Top Row - Left: Performance Metrics */}
          <PerformanceMetricsChart metrics={performanceMetrics} />

          {/* Top Row - Right: Fund Spending */}
          <FundSpendingChart
            data={fundSpendingData}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />

          {/* Bottom Row - Left: Scholarship Distribution */}
          <ScholarshipDistributionChart
            data={programDistributionData}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Bottom Row - Right: Schedule Calendar */}
          <ScheduleCalendar events={calendarEvents} />
        </div>
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
        <RecentApplicationsTable data={recentApplications} />
      )}
    </div>
  );
};

export default AdminDashboard;
