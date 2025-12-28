import * as React from "react";
import { usePermissions } from "@/contexts/PermissionContext";
import { tabLabels } from "../constants";
import { getScreenNameFromTab } from "../utils/tabPermissions";

interface ProcessTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProcessTabs: React.FC<ProcessTabsProps> = ({ activeTab, onTabChange }) => {
  const { permissions, loading } = usePermissions();

  // Check if user is Administrator - they have full access
  const isAdministrator = React.useMemo(() => {
    try {
      const authData = localStorage.getItem('scholarship_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.userType === 'Administrator';
      }
    } catch {
      // Ignore errors
    }
    return false;
  }, []);

  // Filter tabs based on permissions
  const allowedTabs = React.useMemo(() => {
    // Administrators have access to all tabs
    if (isAdministrator) {
      return tabLabels;
    }

    // If permissions are loading or not available, show all tabs (will be filtered once loaded)
    if (loading || !permissions || !permissions.screens) {
      return tabLabels;
    }

    // Filter tabs based on screen permissions
    return tabLabels.filter((tab) => {
      const screenName = getScreenNameFromTab(tab.value);
      if (!screenName) {
        // If no mapping exists, allow the tab (for backward compatibility)
        return true;
      }

      // Check if user has permission for this screen
      return permissions.screens.some(
        (screen) => screen.screenName === screenName && screen.isActive
      );
    });
  }, [permissions, loading, isAdministrator]);

  return (
    <div style={{ width: "38.71875rem" }}>
      <div style={{
        display: "flex",
        gap: "24px",
        borderBottom: "none",
        padding: "12px",
        paddingBottom: "10px",
      }}>
        {allowedTabs.map((tab) => {
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

