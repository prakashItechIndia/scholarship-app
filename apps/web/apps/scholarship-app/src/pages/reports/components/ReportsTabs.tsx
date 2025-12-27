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
    <>
      {/* Tabs on the left */}
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
                  fontSize: "13px",
                  lineHeight: "20px",
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? "#242424" : "#424242",
                  backgroundColor: "#FAFAFA",
                  border: "none",
                  borderBottom: `5px solid ${isActive ? "#0f6cbd" : "transparent"}`,
                  cursor: "pointer",
                  marginBottom: "12px",
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

      {/* Search and Actions on the right */}
      {showActions && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
          paddingRight: "24px",
          flexShrink: 0,
        }}>
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
              backgroundColor: "#0f6cbd",
              borderRadius: "6px",
              height: "32px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          />

          <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
            <DropdownMenuTrigger>
              <Button
                appearance="outline"
                aria-label="More options"
                style={{
                  width: "32px",
                  minWidth: "32px",
                  maxWidth: "32px",
                  height: "32px",
                  padding: 0,
                  borderColor: "#d1d5db",
                  backgroundColor: "#fff",
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
    </>
  );
};

export default ReportsTabs;

