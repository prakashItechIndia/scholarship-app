import * as React from "react";
import { Select, DatePicker, Input, Button } from "@shared/components";
import { Search20Regular, SearchRegular } from "@fluentui/react-icons";
import { ReportFilters, ReportTab } from "../types";
import { academicYearOptions, genderOptions, statusOptions, issuedTypeOptions } from "../constants";
import { Separator } from "@fluentui/react";

interface ReportsFiltersProps {
  filters: ReportFilters;
  onFilterUpdate: (key: keyof ReportFilters, value: any) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  activeTab: ReportTab;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  filters,
  onFilterUpdate,
  onApplyFilter,
  onResetFilter,
  activeTab,
}) => {
  console.log("ReportsFilters rendered with filters:", filters);
  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    console.log(`Child received update: ${key} = ${value}, calling parent`);
    onFilterUpdate(key, value);
  };

  const isApplyDisabled = React.useMemo(() => {
    if (activeTab === "categories-wise") {
      return !filters.academicYear || !filters.appliedDate || !filters.gender || !filters.status;
    }
    // Add validation logic for other tabs if strictly required, otherwise rely on backend or default relaxed state
    return !filters.academicYear;
  }, [filters, activeTab]);

  const onFormatDate = (date?: Date): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{
      width: "320px",
      borderLeft: "1px solid #e0e0e0", // Only left border as separator
      height: "auto", // Full height matching parent flex
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: "#F5F5F5", // Swapped color
        padding: "24px",
        paddingBottom: 0, // Remove bottom padding so separator sits flush if needed, but we use negative margin
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        <h3 style={{
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
          color: "#242424",
          margin: 0,
          fontFamily: "'Inter', sans-serif",
        }}>
          Report Generation Filter
        </h3>
        {/* Separator after text - Full Width */}
        <div style={{
          height: "1px",
          backgroundColor: "#cccccc",
          width: "calc(100% + 48px)",
          marginLeft: "-24px",
          marginRight: "-24px"
        }} />
      </div>

      {/* Content Section */}
      <div style={{
        backgroundColor: "#FAFAFA", // Swapped color
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flex: 1,
        overflowY: "auto", // Allow scrolling if content is too long
      }}>
        {/* Academic Year - Common for all tabs */}
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

        {/* Categories Wise Report Specifics */}
        {activeTab === "categories-wise" && (
          <>
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
                formatDate={onFormatDate}
                textField={{
                  placeholder: "Select Applied Date",
                } as any}
              />
            </div>
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
          </>
        )}

        {/* Report of Scholarship Issued Specifics */}
        {activeTab === "scholarship-issued" && (
          <>
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
                Issued By
              </label>
              <Input
                placeholder="Enter Issuer Name"
                value={filters.issuedBy || ""}
                onChange={(e) => handleFilterChange("issuedBy", e.target.value)}
              />
            </div>
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
                Issued Date
              </label>
              <DatePicker
                value={filters.issuedDate || undefined}
                onSelectDate={(date) => handleFilterChange("issuedDate", date)}
                formatDate={onFormatDate}
                textField={{
                  placeholder: "Select Issued Date",
                } as any}
              />
            </div>
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
                Issued Type
              </label>
              <Select
                placeholder="Select Type"
                options={issuedTypeOptions}
                selectedKey={filters.issuedType}
                onValueChange={(value) => handleFilterChange("issuedType", value)}
              />
            </div>
          </>
        )}

        {/* Approved Form Specifics */}
        {activeTab === "approved-form" && (
          <>
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
                Application No
              </label>
              <Input
                placeholder="Enter Application No"
                value={filters.applicationNo || ""}
                onChange={(e) => handleFilterChange("applicationNo", e.target.value)}
              />
            </div>
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
                Student Id
              </label>
              <Input
                placeholder="Enter Student Id"
                value={filters.studentId || ""}
                onChange={(e) => handleFilterChange("studentId", e.target.value)}
              />
            </div>
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
                placeholder="Select Status"
                options={statusOptions}
                selectedKey={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              />
            </div>
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
                Mobile Number
              </label>
              <Input
                placeholder="Enter Mobile Number"
                value={filters.mobileNumber || ""}
                onChange={(e) => handleFilterChange("mobileNumber", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Keyword Search - Common for all tabs */}
        <div className="flex flex-col">
          <label
            htmlFor="search"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Keyword Search
          </label>

          <div className="flex items-center w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus-within:border-blue-500">
            <SearchRegular className="w-5 h-5 text-gray-600" />

            <input
              id="search"
              type="text"
              placeholder="Search"
              value={filters.keywordSearch || ""}
              onChange={(e) =>
                handleFilterChange("keywordSearch", e.target.value)
              }
              className="w-full h-full bg-transparent border-none outline-none text-gray-700 pl-2"
            />
          </div>
        </div>

      </div>

      {/* Footer Section with Separator */}
      <div style={{
        backgroundColor: "#FFFFFF",
        padding: "0 24px 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        {/* Full Width Separator */}
        <div style={{
          height: "1px",
          backgroundColor: "#b3b3b3", // Slightly darker for visibility on D1D1D1
          width: "calc(100% + 48px)",
          marginLeft: "-24px",
          marginRight: "-24px"
        }} />
        <div style={{ display: "flex", justifyContent: !isApplyDisabled ? "space-between" : "flex-end" }}>
          {!isApplyDisabled && (
            <Button
              appearance="outline"
              onClick={onResetFilter}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #D1D1D1",
                color: "#242424",
                minWidth: "100px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              Reset Filter
            </Button>
          )}
          <Button
            appearance="primary"
            onClick={onApplyFilter}
            disabled={isApplyDisabled}
            style={{
              backgroundColor: isApplyDisabled ? "#cccccc" : "#0f6cbd",
              color: "#ffffff",
              minWidth: "100px",
              cursor: isApplyDisabled ? "not-allowed" : "pointer",
            }}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilters;
