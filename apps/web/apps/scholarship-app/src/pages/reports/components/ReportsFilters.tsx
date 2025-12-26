import * as React from "react";
import { Select, DatePicker, Input, Button } from "@shared/components";
import { SearchRegular } from "@fluentui/react-icons";
import { ReportFilters, ReportTab } from "../types";
import {
  academicYearOptions,
  genderOptions,
  statusOptions,
  issuedTypeOptions,
} from "../constants";
import { reports } from "../../../services/scholarship.service";

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
  const [chequeIssuedByOptions, setChequeIssuedByOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [academicYears, setAcademicYears] = React.useState<
    { value: string; label: string }[]
  >([]);

  // Load academic years and cheque issued by options
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [years, issuedBy] = await Promise.all([
          reports.getAcademicYears(),
          reports.getChequeIssuedBy(),
        ]);
        setAcademicYears(
          years.map((y: any) => ({
            value: y.ScholarshipYear_Id?.toString() || "",
            label: y.ScholarshipYear_Code || "",
          }))
        );
        setChequeIssuedByOptions(
          issuedBy.map((item: any) => ({
            value: item.Id?.toString() || "",
            label: item.Issued_By || "",
          }))
        );
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };
    loadData();
  }, []);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    onFilterUpdate(key, value);
  };

  const isApplyDisabled = React.useMemo(() => {
    // Apply button is always enabled - filters are optional
    return false;
  }, []);

  const onFormatDate = (date?: Date): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      style={{
      width: "320px",
        minWidth: "320px", // Prevent drawer from shrinking
        maxWidth: "320px", // Prevent drawer from growing
        borderLeft: "1px solid #e0e0e0",
        height: "100%", // Take full height
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
        overflow: "hidden", // Prevent drawer from scrolling
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          backgroundColor: "#F5F5F5",
        padding: "24px",
          paddingBottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        }}
      >
        <h3
          style={{
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
          color: "#242424",
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          }}
        >
          Report Generation Filter
        </h3>
        <div
          style={{
          height: "1px",
          backgroundColor: "#cccccc",
          width: "calc(100% + 48px)",
          marginLeft: "-24px",
            marginRight: "-24px",
          }}
        />
      </div>

      {/* Content Section */}
      <div
        style={{
          backgroundColor: "#FAFAFA",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flex: 1,
        overflowY: "auto", // Allow vertical scrolling for filters
        overflowX: "hidden", // Prevent horizontal scrolling in drawer
        minWidth: 0, // Allow flex item to shrink
      }}
      >
        {/* Categories Wise Report Filters */}
        {activeTab === "categories-wise" && (
          <>
            {/* Academic Year */}
            <div>
              <label
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
                Academic Year
              </label>
              <Select
                placeholder="Select Academic Year"
                options={academicYears.length > 0 ? academicYears : academicYearOptions}
                selectedKey={filters.academicYear?.toString()}
                onValueChange={(value) =>
                  handleFilterChange("academicYear", value ? Number(value) : undefined)
                }
              />
            </div>

            {/* Applied Date */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Applied Date
              </label>
              <DatePicker
                value={filters.appliedDate || undefined}
                onSelectDate={(date) => handleFilterChange("appliedDate", date)}
                formatDate={onFormatDate}
                textField={{
                  placeholder: "DD/MM/YYYY",
                } as any}
              />
            </div>

            {/* Gender */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Gender
              </label>
              <Select
                placeholder="--Select--"
                options={genderOptions}
                selectedKey={filters.gender || ""}
                onValueChange={(value) => handleFilterChange("gender", value)}
              />
            </div>

            {/* Status */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Status
              </label>
              <Select
                placeholder="--Select--"
                options={statusOptions}
                selectedKey={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              />
            </div>
          </>
        )}

        {/* Report of Scholarship Issued Filters */}
        {activeTab === "scholarship-issued" && (
          <>
            {/* Academic Year */}
            <div>
              <label
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
                Academic Year
              </label>
              <Select
                placeholder="Select Academic Year"
                options={academicYears.length > 0 ? academicYears : academicYearOptions}
                selectedKey={filters.academicYear?.toString()}
                onValueChange={(value) =>
                  handleFilterChange("academicYear", value ? Number(value) : undefined)
                }
              />
            </div>

            {/* Issued By */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Issued By
              </label>
              <Select
                placeholder="--Select--"
                options={chequeIssuedByOptions}
                selectedKey={filters.strIssuedBy || filters.intIssuedBy?.toString() || ""}
                onValueChange={(value) => {
                  if (!value || value === "") {
                    handleFilterChange("strIssuedBy", undefined);
                    handleFilterChange("intIssuedBy", undefined);
                    handleFilterChange("issuedBy", undefined);
                  } else {
                    const selectedOption = chequeIssuedByOptions.find(opt => opt.value === value);
                    handleFilterChange("strIssuedBy", selectedOption?.label);
                    handleFilterChange("intIssuedBy", value ? Number(value) : undefined);
                    handleFilterChange("issuedBy", selectedOption?.label);
                  }
                }}
              />
            </div>

            {/* Issued Date */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Issued Date
              </label>
              <DatePicker
                value={filters.issuedDate || undefined}
                onSelectDate={(date) => handleFilterChange("issuedDate", date)}
                formatDate={onFormatDate}
                textField={{
                  placeholder: "DD/MM/YYYY",
                } as any}
              />
            </div>

            {/* Issued Type */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Issued Type
              </label>
              <Select
                placeholder="--Select--"
                options={issuedTypeOptions}
                selectedKey={filters.issuedType || ""}
                onValueChange={(value) => handleFilterChange("issuedType", value)}
              />
            </div>
          </>
        )}

        {/* Approved Form Report Filters */}
        {activeTab === "approved-form" && (
          <>
            {/* Academic Year */}
            <div>
              <label
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
                Academic Year
              </label>
              <Select
                placeholder="Select Academic Year"
                options={academicYears.length > 0 ? academicYears : academicYearOptions}
                selectedKey={filters.academicYear?.toString()}
                onValueChange={(value) =>
                  handleFilterChange("academicYear", value ? Number(value) : undefined)
                }
              />
            </div>

            {/* Application No */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#242424",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Application No.
              </label>
              <Input
                placeholder="Enter Application No"
                value={filters.applicationNo || ""}
                onChange={(e) => handleFilterChange("applicationNo", e.target.value)}
              />
            </div>

            {/* Student ID */}
            <div>
              <label
                style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                }}
              >
                Student ID
              </label>
              <Input
                placeholder="Enter Student ID"
                value={filters.studentId || ""}
                onChange={(e) => handleFilterChange("studentId", e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label
                style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                }}
              >
                Status
              </label>
              <Select
                placeholder="Select"
                options={statusOptions}
                selectedKey={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label
                style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#242424",
                marginBottom: "8px",
                display: "block",
                }}
              >
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
        <div>
          <label
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Keyword Search
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "40px",
              padding: "0 12px",
              border: "1px solid #d1d1d1",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
            }}
          >
            <SearchRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
            <input
              type="text"
              placeholder="Search"
              value={filters.keywordSearch || ""}
              onChange={(e) => {
                handleFilterChange("keywordSearch", e.target.value);
              }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "#242424",
                paddingLeft: "8px",
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
        backgroundColor: "#FFFFFF",
        padding: "0 24px 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        }}
      >
        <div
          style={{
          height: "1px",
            backgroundColor: "#b3b3b3",
          width: "calc(100% + 48px)",
          marginLeft: "-24px",
            marginRight: "-24px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: !isApplyDisabled ? "space-between" : "flex-end",
          }}
        >
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
