import * as React from "react";
import { Tabs, TabsTrigger } from "@shared/components";
import { ReportTab } from "../types";

interface ReportsTabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const tabLabels = [
  { value: "categories-wise" as ReportTab, label: "Categories wise Report" },
  { value: "scholarship-issued" as ReportTab, label: "Report of Scholarship Issued" },
  { value: "approved-form" as ReportTab, label: "Approved Form" },
];

const ReportsTabs: React.FC<ReportsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={{ flex: 1 }}>
      <Tabs
        value={activeTab}
        defaultValue="scholarship-issued"
        onValueChange={(value) => onTabChange(value as ReportTab)}
        style={{ width: "100%" }}
      >
        <div style={{
          display: "flex",
          gap: "24px",
          borderBottom: "1px solid #e0e0e0",
        }}>
          {tabLabels.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value}
              style={{
                paddingBottom: "12px",
                paddingLeft: 0,
                paddingRight: 0,
                borderBottom: `2px solid ${activeTab === tab.value ? "#0f6cbd" : "transparent"}`,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: activeTab === tab.value ? 600 : 400,
                color: activeTab === tab.value ? "#0f6cbd" : "#616161",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
              }}
              className={activeTab !== tab.value ? "hover:text-[#242424]" : ""}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ReportsTabs;

