import * as React from "react";
import { Button, Select } from "@shared/components";
import {
  ArrowDownload20Regular,
} from "@fluentui/react-icons";
import {
  People20Regular,
  Document20Regular,
  CheckmarkCircle20Regular,
  Eye20Regular,
} from "@fluentui/react-icons";
import { StatCard } from "./components/StatCard";
import { FinancialSummaryCard } from "./components/FinancialSummaryCard";
import { ApplicationActivityChart } from "./components/ApplicationActivityChart";
import { ApplicationStatusChart } from "./components/ApplicationStatusChart";
import { RecentActivityWidget } from "./components/RecentActivityWidget";
import { PerformanceMetricsChart } from "./components/PerformanceMetricsChart";
import { FundSpendingChart } from "./components/FundSpendingChart";
import { ScholarshipDistributionChart } from "./components/ScholarshipDistributionChart";
import { ScheduleCalendar } from "./components/ScheduleCalendar";
import { RecentApplicationsTable } from "./components/RecentApplicationsTable";
import {
  academicYearOptions,
  mockRecentApplications,
} from "./constants";

const AdminDashboard: React.FC = () => {
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState<string>("2024-2025");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("September 2024");
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("Monthly");
  const [selectedStatusMonth, setSelectedStatusMonth] = React.useState<string>("October 2025");
  const [selectedYear, setSelectedYear] = React.useState<string>("2024 - 2025");
  
  // Mock user name - in real app, get from auth context
  const userName = "Aakash";
  const currentYear = new Date().getFullYear();

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

  const handleExport = () => {
    console.log("Exporting dashboard data...");
    // Implement export logic here
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Title Section */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 700,
          color: "#242424",
          marginBottom: "8px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Dashboard - Overview
        </h1>
      </div>

      {/* Header Section */}
      <div style={{
        position: "relative",
        marginBottom: "24px",
        backgroundColor: "#F5F5F5",
        padding: "12px 24px",
        borderRadius: "8px",
      }}>
        <h1 style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#242424",
          marginBottom: "4px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Hello {userName}!
        </h1>
        <p style={{
          fontSize: "13px",
          lineHeight: "24px",
          fontWeight: 400,
          color: "#707070",
          fontFamily: "'Inter', sans-serif",
        }}>
          Welcome back to the Leo Muthu Scholarship Portal. View your {currentYear} performance metrics below.
        </p>
        {/* Controls Section */}
        <div style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{ width: "180px" }}>
            <Select
              placeholder="Academic Year"
              options={academicYearOptions}
              selectedKey={selectedAcademicYear}
              onValueChange={(value) => setSelectedAcademicYear(value)}
            />
          </div>
          <Button
            appearance="primary"
            onClick={handleExport}
            style={{
              backgroundColor: "#0f6cbd",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowDownload20Regular style={{ width: "16px", height: "16px" }} />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <FinancialSummaryCard
          label="Total Amount Spent This Year"
          amount={financialData.totalAmountSpentThisYear}
          color="#0f6cbd"
        />
        <FinancialSummaryCard
          label="Amount Spent for School Students"
          amount={financialData.amountSpentForSchoolStudents}
          color="#16a34a"
        />
        <FinancialSummaryCard
          label="Amount Spent for College Students"
          amount={financialData.amountSpentForCollegeStudents}
          color="#8b5cf6"
        />
        <FinancialSummaryCard
          label="Amount Spent for Research Scholars"
          amount={financialData.amountSpentForResearchScholars}
          color="#f59e0b"
        />
        <FinancialSummaryCard
          label="Amount Spent for Medical Assistance"
          amount={financialData.amountSpentForMedicalAssistance}
          color="#ec4899"
        />
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
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}>
          <StatCard
            icon={<People20Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
            value={applicationMetrics.totalApplications}
            label="Total Applications"
            color="#EFF6FF"
          />
          <StatCard
            icon={<Document20Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
            value={applicationMetrics.submitted}
            label="Submitted"
            color="#F0FDF4"
          />
          <StatCard
            icon={<CheckmarkCircle20Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
            value={applicationMetrics.approved}
            label="Approved"
            color="#FAF5FF"
          />
          <StatCard
            icon={<Eye20Regular style={{ width: "28px", height: "28px", color: "#2453C3" }} />}
            value={applicationMetrics.underReview}
            label="Under Review"
            color="#FFFBEB"
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
