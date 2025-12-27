import * as React from "react";

import { tabLabels } from "../constants";

interface ProcessTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProcessTabs: React.FC<ProcessTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={{ width: "38.71875rem" }}>
      <div style={{
        display: "flex",
        gap: "24px",
        borderBottom: "none",
        padding: "12px",
        paddingBottom: "10px",
      }}>
        {tabLabels.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              style={{
                padding: "10px 0",
                fontSize: "13px", // matching 13px request
                lineHeight: "20px",
                fontWeight: isActive ? 600 : 400,  // matching 600 request
                fontFamily: "'Inter', sans-serif",
                color: isActive ? "#242424" : "#424242", 
                backgroundColor: "#FAFAFA",
                border: "none",
                borderBottom: `5px solid ${isActive ? "#0f6cbd" : "transparent"}`,
                cursor: "pointer",
                marginBottom: "12px", // Pull border down to overlap container border
                transition: "all 0.2s",
                outline: "none",
                
              }}
              className="hover:text-[#242424]"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessTabs;

