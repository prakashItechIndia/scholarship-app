import * as React from "react";
import { Tabs, TabsTrigger } from "@shared/components";
import { tabLabels } from "../constants";

interface ProcessTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProcessTabs: React.FC<ProcessTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={{ flex: 1 }}>
      <Tabs
        value={activeTab}
        defaultValue="overview"
        onValueChange={onTabChange}
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

export default ProcessTabs;

