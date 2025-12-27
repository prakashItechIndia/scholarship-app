import * as React from "react";
import { ReportTab } from "../types";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@shared/components";
import {
  MoreVerticalRegular
} from "@fluentui/react-icons";
import { ExportButton, type ExportFormat } from "@/components/common";

interface ReportsTabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  onExport: (format: ExportFormat) => void;
  showActions?: boolean;
  exportLoading?: boolean;
}

const tabLabels = [
  { value: "categories-wise" as ReportTab, label: "Categories wise Report" },
  { value: "scholarship-issued" as ReportTab, label: "Report of Scholarship Issued" },
  { value: "approved-form" as ReportTab, label: "Approved Form" },
];

const ReportsTabs: React.FC<ReportsTabsProps> = ({ activeTab, onTabChange, onExport, showActions = false, exportLoading = false }) => {
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);

  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        borderBottom: "none",
        height: "100%",
        backgroundColor: "transparent",
      }}>
        {/* Tabs Left */}
        <div style={{ display: "flex", gap: "0px", height: "100%" }}>
          {tabLabels.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                style={{
                  padding: "0 24px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  color: isActive ? "#242424" : "#616161",
                  fontFamily: "'Inter', sans-serif",
                  border: "none",
                  borderBottom: `3px solid ${isActive ? "#2453C3" : "transparent"}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  outline: "none",
                  backgroundColor: "transparent",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Actions Right */}
        {showActions && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ExportButton
              options={[
                { format: "excel", label: "Excel (.xlsx)" },
                { format: "pdf", label: "PDF" },
                { format: "csv", label: "CSV" },
                { format: "word", label: "Word (.docx)" },
              ]}
              onExport={onExport}
              size="small"
              loading={exportLoading}
              buttonStyle={{
                backgroundColor: "#2453C3",
                borderRadius: "4px",
                height: "32px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />

            <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
              <DropdownMenuTrigger>
                <Button
                  appearance="subtle"
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  aria-label="More options"
                  style={{
                    width: "24px",
                    minWidth: "24px",
                    height: "32px",
                    padding: 0,
                    margin: 0,
                    border: "none",
                  }}
                >
                  <MoreVerticalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  label="Refresh"
                  onClick={() => {
                    console.log("Refresh clicked");
                    setMoreMenuOpen(false);
                  }}
                />
                <DropdownMenuItem
                  label="Settings"
                  onClick={() => {
                    console.log("Settings clicked");
                    setMoreMenuOpen(false);
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTabs;

