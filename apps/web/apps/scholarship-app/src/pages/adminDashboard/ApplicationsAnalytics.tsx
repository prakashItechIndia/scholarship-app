import * as React from "react";
import { StatCard } from "./components";
import { Select } from "@shared/components";
import { WelcomeBanner } from "../../components/common";

interface ApplicationsAnalyticsProps {
  totalApplications?: number;
  submitted?: number;
  approved?: number;
  underReview?: number;
  userName?: string;
}

export const ApplicationsAnalytics: React.FC<ApplicationsAnalyticsProps> = ({
  totalApplications = 72684,
  submitted = 2658,
  approved = 15210,
  underReview = 12531,
  userName = "Admin",
}) => {
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState<string>("");

  const academicYearOptions = [
    { value: "2024-2025", label: "2024-2025" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2021-2022", label: "2021-2022" },
  ];

  return (
    <div className="w-full" style={{ paddingLeft: 0, marginLeft: 0 }}>
      {/* Header Section with Welcome Banner and Controls */}
      <div
        style={{
          position: "relative",
          marginBottom: "18px",
          marginLeft: 0,
          paddingLeft: 0,
        }}
      >
        <WelcomeBanner 
          userName={userName} 
          style={{ 
            marginLeft: 0,
            paddingLeft: 0,
            width: "100%",
          }}
        />
        {/* Controls Section - Easy to add more buttons here */}
        <div
          style={{
            position: "absolute",
            right: "48px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Academic Year Dropdown */}
          <div style={{ width: "180px" }}>
            <Select
              placeholder="Academic year"
              options={academicYearOptions}
              selectedKey={selectedAcademicYear}
              onValueChange={(value) => setSelectedAcademicYear(value)}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d1d1d1",
                borderRadius: "8px",
                height: "36px",
                minHeight: "36px",
              }}
            />
          </div>
          {/* 
            Future buttons/components can be added here, for example:
            <Button onClick={handleExport}>Export</Button>
            <Button onClick={handleFilter}>Filter</Button>
          */}
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Applications Analytics & Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={"$"}
          value={totalApplications}
          label="Total Applications"
          color="#EFF6FF"
        />
        <StatCard
                    icon={"$"}
          value={submitted}
          label="Submitted"
          color="#F0FDF4"
        />
        <StatCard
          icon={"$"}
          value={approved}
          label="Approved"
          color="#FAF5FF"
        />
        <StatCard
          icon={"$"}
          value={underReview}
          label="Under Review"
          color="#FFFBEB"
        />
        <StatCard
          icon={"$"}
          value={underReview}
          label="Under Review"
          color="#FFEFEE"
        />
      </div>
    </div>
  );
};

