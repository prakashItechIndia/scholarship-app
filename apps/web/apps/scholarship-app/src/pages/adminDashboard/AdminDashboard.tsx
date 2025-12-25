import * as React from "react";
import { Select, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, PageActionButtons } from "@shared/components";
import {
  ArrowDown24Regular,
  ArrowDownload20Regular,
  ArrowDownload24Regular,
  ChevronDown20Regular,
  ChevronDown24Regular,
  DocumentBulletList24Regular,
  DocumentCheckmark24Regular,
  DocumentTableSearch24Regular,
} from "@fluentui/react-icons";
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
import {
  mockRecentApplications,
} from "./constants";

const AdminDashboard: React.FC = () => {
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("September 2024");
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("Monthly");
  const [selectedStatusMonth, setSelectedStatusMonth] = React.useState<string>("October 2025");
  const [selectedYear, setSelectedYear] = React.useState<string>("2024 - 2025");
  
  // Mock user name - in real app, get from auth context
  const userName = "Aakash";
  const currentYear = new Date().getFullYear();

  // Generate academic year options from 2018 to 2025 (latest first)
  const academicYearOptions = Array.from({ length: 2025 - 2018 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Financial summary data
  const financialData = {
    totalAmountSpentThisYear: 2165700,
    amountSpentForSchoolStudents: 365700,
    amountSpentForCollegeStudents: 965700,
    amountSpentForResearchScholars: 465700,
    amountSpentForMedicalAssistance: 50000,
  };

  // Application metrics
  const applicationMetrics = {
    totalApplications: 72684,
    submitted: 2658,
    approved: 15210,
    underReview: 12531,
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
    // Implement Excel export logic
  };

  const handleExportWord = () => {
    console.log("Exporting to Word...");
    // Implement Word export logic
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
          <div style={{ width: "140px",marginRight: "120px" }}>
            <Select
              placeholder="Academic Year"
              options={academicYearOptions}
              selectedKey={selectedAcademicYear}
              onValueChange={(value) => setSelectedAcademicYear(value)}
            />
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
                  height: "43px",
                }}
              >
                <ArrowDownload24Regular style={{ width: "16px", height: "16px",color:"#FFFFFF"}} />
                Export
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
        marginBottom: "32px",
        paddingBottom: "24px",
        marginLeft: "-24px",
        marginRight: "-24px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderBottom: "1px solid #e0e0e0",
      }}>
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
            label="Under Review"
            iconBgColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Application Activity Chart - Full Width */}
      <div style={{ marginBottom: "32px" }}>
        <ApplicationActivityChart
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Application Status and Recent Activity Row - 2 Columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "32px",
      }}>
        {/* Application Status Donut Chart */}
        <ApplicationStatusChart
          selectedMonth={selectedStatusMonth}
          onMonthChange={setSelectedStatusMonth}
        />

        {/* Recent Activity Widget */}
        <RecentActivityWidget />
      </div>

      {/* Performance Metrics, Fund Spending, and Scholarship Distribution - 3 Columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "24px",
        marginBottom: "32px",
      }}>
        {/* Performance Metrics Chart */}
        <PerformanceMetricsChart />

        {/* Fund Spending Chart */}
        <FundSpendingChart
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />

        {/* Scholarship Distribution Chart */}
        <ScholarshipDistributionChart
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      {/* Schedule Calendar - Full Width or Right Aligned */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <div style={{ width: "400px" }}>
            <ScheduleCalendar />
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <RecentApplicationsTable data={mockRecentApplications} />
    </div>
  );
};

export default AdminDashboard;
