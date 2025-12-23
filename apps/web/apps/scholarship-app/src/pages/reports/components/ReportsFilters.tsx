import * as React from "react";
import { Select, DatePicker, Input, Button } from "@shared/components";
import { Search20Regular } from "@fluentui/react-icons";
import { ReportFilters } from "../types";
import { academicYearOptions, genderOptions, statusOptions } from "../constants";

interface ReportsFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilter,
  onResetFilter,
}) => {
  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div style={{
      width: "320px",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "24px",
      height: "fit-content",
      fontFamily: "'Inter', sans-serif",
    }}>
      <h3 style={{
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: 600,
        color: "#242424",
        marginBottom: "24px",
        fontFamily: "'Inter', sans-serif",
      }}>
        Report Generation Filter
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Academic Year */}
        <div>
          <label style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#242424",
            marginBottom: "8px",
            display: "block",
            fontFamily: "'Inter', sans-serif",
          }}>
            Academic Year
          </label>
          <Select
            placeholder="Select Academic Year"
            options={academicYearOptions}
            selectedKey={filters.academicYear}
            onValueChange={(value) => handleFilterChange("academicYear", value)}
          />
        </div>

        {/* Applied Date */}
        <div>
          <label style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#242424",
            marginBottom: "8px",
            display: "block",
            fontFamily: "'Inter', sans-serif",
          }}>
            Applied Date
          </label>
          <DatePicker
            value={filters.appliedDate || undefined}
            onSelectDate={(date) => handleFilterChange("appliedDate", date)}
            textField={{
              placeholder: "Select Applied Date",
            } as any}
          />
        </div>

        {/* Gender */}
        <div>
          <label style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#242424",
            marginBottom: "8px",
            display: "block",
            fontFamily: "'Inter', sans-serif",
          }}>
            Gender
          </label>
          <Select
            placeholder="Select Gender"
            options={genderOptions}
            selectedKey={filters.gender}
            onValueChange={(value) => handleFilterChange("gender", value)}
          />
        </div>

        {/* Status */}
        <div>
          <label style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#242424",
            marginBottom: "8px",
            display: "block",
            fontFamily: "'Inter', sans-serif",
          }}>
            Status
          </label>
          <Select
            placeholder="Select"
            options={statusOptions}
            selectedKey={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          />
        </div>

        {/* Keyword Search */}
        <div>
          <label style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#242424",
            marginBottom: "8px",
            display: "block",
            fontFamily: "'Inter', sans-serif",
          }}>
            Keyword Search
          </label>
          <Input
            placeholder="Search"
            value={filters.keywordSearch || ""}
            onChange={(e) => handleFilterChange("keywordSearch", e.target.value)}
            suffixIcon={<Search20Regular style={{ width: "20px", height: "20px", color: "#616161" }} />}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginTop: "32px",
        justifyContent: "flex-end",
      }}>
        <Button
          appearance="secondary"
          onClick={onResetFilter}
          style={{
            backgroundColor: "#f5f5f5",
            color: "#242424",
            border: "1px solid #e0e0e0",
            minWidth: "100px",
          }}
        >
          Reset Filter
        </Button>
        <Button
          appearance="primary"
          onClick={onApplyFilter}
          style={{
            backgroundColor: "#0f6cbd",
            color: "#ffffff",
            minWidth: "100px",
          }}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
};

export default ReportsFilters;

