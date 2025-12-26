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
        height: "2.75rem",
        backgroundColor: "#F5F5F5",
        paddingRight: "16px",
      }}>
        {/* Tabs Left */}
        <div style={{ display: "flex", gap: "24px", height: "100%" }}>
          {tabLabels.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                style={{
                  padding: "12px 22px",
                  fontSize: "13px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  color: isActive ? "black" : "#616161",
                  fontFamily: "'Inter', sans-serif",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? "#0f6cbd" : "transparent"}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  outline: "none",
                  backgroundColor: "transparent",
                }}
                className="hover:text-[#242424]"
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
              ]}
              onExport={onExport}
              size="small"
              loading={exportLoading}
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

