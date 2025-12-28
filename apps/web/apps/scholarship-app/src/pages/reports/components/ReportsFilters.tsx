import * as React from "react";
import { 
  Input,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@shared/components";
import { SearchRegular, ChevronDown24Regular, CalendarRegular } from "@fluentui/react-icons";
import { Calendar, DayOfWeek } from "@fluentui/react";
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
        const academicYearsMapped = years.map((y: any) => ({
          value: y.ScholarshipYear_Id?.toString() || "",
          label: y.ScholarshipYear_Code || "",
        }));
        setAcademicYears(academicYearsMapped);
        // Auto-select the first academic year if none is selected
        if (academicYearsMapped.length > 0 && !filters.academicYear) {
          const firstYearId = Number(academicYearsMapped[0].value);
          if (!isNaN(firstYearId)) {
            onFilterUpdate("academicYear", firstYearId);
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    onFilterUpdate(key, value);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: "20px",
    fontWeight: 400,
    color: "#242424",
    marginBottom: "8px",
    display: "block",
    fontFamily: "'Inter', sans-serif",
  };

  const renderDropdown = (
    _key: keyof ReportFilters,
    value: string | undefined,
    options: { value: string; label: string }[],
    placeholder: string,
    onChange: (val: string) => void
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          style={{
            width: "100%",
            height: "32px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #D1D1D1",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span style={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            fontSize: "13px",
            color: value ? "#242424" : "#707070",
            fontWeight: 400 
          }}>
            {value 
              ? options.find(opt => opt.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronDown24Regular style={{ width: "16px", height: "16px", color: "#616161", flexShrink: 0 }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: "272px" }}>
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderDatePicker = (
    value: Date | undefined,
    placeholder: string,
    onChange: (date: Date | null | undefined) => void
  ) => (
    <Popover positioning="below">
      <PopoverTrigger>
        <button
          style={{
            width: "100%",
            height: "32px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #D1D1D1",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span style={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            fontSize: "13px",
            color: value ? "#242424" : "#707070",
            fontWeight: 400 
          }}>
            {value ? onFormatDate(value) : placeholder}
          </span>
          <CalendarRegular style={{ width: "16px", height: "16px", color: "#616161", flexShrink: 0 }} />
        </button>
      </PopoverTrigger>
      <PopoverContent style={{ padding: 0, border: "none" }}>
        <Calendar
          onSelectDate={onChange}
          value={value}
          firstDayOfWeek={DayOfWeek.Sunday}
          highlightCurrentMonth
          showGoToToday
        />
      </PopoverContent>
    </Popover>
  );

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
          padding: "24px 24px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "13px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Report Generation Filter
        </h3>
      </div>
      <div
        style={{
          height: "1px",
          backgroundColor: "#E0E0E0",
          width: "100%",
        }}
      />

      {/* Content Section */}
      <div
        style={{
          backgroundColor: "#FAFAFA",
          padding: "24px",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
          overflowY: "auto", // Allow vertical scrolling for filters
          overflowX: "hidden", // Prevent horizontal scrolling in drawer
          minWidth: 0, // Allow flex item to shrink
        }}
      >
        <style>
          {`
            /* Target all inputs and comboboxes within this container */
            input::placeholder,
            .fui-Input__input::placeholder,
            .fui-Combobox__input::placeholder,
            .ms-TextField-field::placeholder {
              color: #707070 !important;
              font-size: 13px !important;
              line-height: 20px !important;
              font-weight: 400 !important;
              font-family: 'Inter', sans-serif !important;
            }
            
            /* Target the actual text value and background */
            input,
            .fui-Input__input,
            .fui-Combobox__input,
            .ms-TextField-field {
              font-size: 13px !important;
              line-height: 20px !important;
              font-weight: 400 !important;
              font-family: 'Inter', sans-serif !important;
              color: #242424 !important;
            }

            /* Target Fluent UI specific placeholder elements if any */
            .fui-Input__placeholder,
            .fui-Combobox__placeholder {
              color: #707070 !important;
              font-size: 13px !important;
              line-height: 20px !important;
              font-weight: 400 !important;
            }
          `}
        </style>

        {/* Categories Wise Report Filters */}
        {activeTab === "categories-wise" && (
          <>
            {/* Academic Year */}
            <div>
              <label style={labelStyle}>Academic Year</label>
              {renderDropdown(
                "academicYear",
                filters.academicYear?.toString(),
                academicYears.length > 0 ? academicYears : academicYearOptions,
                "Select Academic Year",
                (val) => handleFilterChange("academicYear", val ? Number(val) : undefined)
              )}
            </div>

            {/* Applied Date */}
            <div>
              <label style={labelStyle}>Applied Date</label>
              <div style={{ width: "100%"}}>
                {renderDatePicker(
                  filters.appliedDate || undefined,
                  "Select Applied Date",
                  (date) => handleFilterChange("appliedDate", date)
                )}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyle}>Gender</label>
              {renderDropdown(
                "gender",
                filters.gender,
                genderOptions,
                "Select Gender",
                (val) => handleFilterChange("gender", val)
              )}
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              {renderDropdown(
                "status",
                filters.status,
                statusOptions,
                "Select Status",
                (val) => handleFilterChange("status", val)
              )}
            </div>
          </>
        )}

        {/* Report of Scholarship Issued Filters */}
        {activeTab === "scholarship-issued" && (
          <>
            {/* Academic Year */}
            <div>
              <label style={labelStyle}>Academic Year</label>
              {renderDropdown(
                "academicYear",
                filters.academicYear?.toString(),
                academicYears.length > 0 ? academicYears : academicYearOptions,
                "Select Academic Year",
                (val) => handleFilterChange("academicYear", val ? Number(val) : undefined)
              )}
            </div>

            {/* Issued By */}
            <div>
              <label style={labelStyle}>Issued By</label>
              {renderDropdown(
                "issuedBy",
                filters.strIssuedBy || filters.intIssuedBy?.toString(),
                chequeIssuedByOptions,
                "Select",
                (val) => {
                  if (!val) {
                    handleFilterChange("strIssuedBy", undefined);
                    handleFilterChange("intIssuedBy", undefined);
                    handleFilterChange("issuedBy", undefined);
                  } else {
                    const selectedOption = chequeIssuedByOptions.find(opt => opt.value === val);
                    handleFilterChange("strIssuedBy", selectedOption?.label);
                    handleFilterChange("intIssuedBy", Number(val));
                    handleFilterChange("issuedBy", selectedOption?.label);
                  }
                }
              )}
            </div>

            {/* Issued Date */}
            <div>
              <label style={labelStyle}>Issued Date</label>
              <div style={{ width: "100%" }}>
                {renderDatePicker(
                  filters.issuedDate || undefined,
                  "Select Date",
                  (date) => handleFilterChange("issuedDate", date)
                )}
              </div>
            </div>

            {/* Issued Type */}
            <div>
              <label style={labelStyle}>Issued Type</label>
              {renderDropdown(
                "issuedType",
                filters.issuedType,
                issuedTypeOptions,
                "Select",
                (val) => handleFilterChange("issuedType", val)
              )}
            </div>
          </>
        )}

        {/* Approved Form Report Filters */}
        {activeTab === "approved-form" && (
          <>
            {/* Academic Year */}
            <div>
              <label style={labelStyle}>Academic Year</label>
              {renderDropdown(
                "academicYear",
                filters.academicYear?.toString(),
                academicYears.length > 0 ? academicYears : academicYearOptions,
                "Select Academic Year",
                (val) => handleFilterChange("academicYear", val ? Number(val) : undefined)
              )}
            </div>

            {/* Application No */}
            <div>
              <label style={labelStyle}>Application No.</label>
              <Input
                placeholder="Enter Application No."
                value={filters.applicationNo || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("applicationNo", e.target.value)}
                style={{ width: "100%", height: "32px", backgroundColor: "#ffffff", border: "1px solid #d1d5db" }}
              />
            </div>

            {/* Student ID */}
            <div>
              <label style={labelStyle}>Student ID</label>
              <Input
                placeholder="Enter Student ID"
                value={filters.studentId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("studentId", e.target.value)}
                style={{ width: "100%", height: "32px", backgroundColor: "#ffffff", border: "1px solid #d1d5db" }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              {renderDropdown(
                "status",
                filters.status,
                statusOptions,
                "Select",
                (val) => handleFilterChange("status", val)
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <Input
                placeholder="Enter Mobile No."
                value={filters.mobileNumber || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("mobileNumber", e.target.value)}
                style={{ width: "100%", height: "32px", backgroundColor: "#ffffff", border: "1px solid #d1d5db" }}
              />
            </div>
          </>
        )}

        {/* Keyword Search - Common for all tabs */}
        <div>
          <label style={labelStyle}>Keyword Search</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "32px",
              padding: "0 12px",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              border: "1px solid #D1D1D1",
            }}
          >
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
                paddingRight: "8px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                lineHeight: "20px",
                fontWeight: 400,
              }}
            />
            <SearchRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "24px 15px 24px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "80px",
          }}
        >
          <Button
            appearance="outline"
            onClick={onResetFilter}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #D1D1D1",
              color: "#242424",
              flex: 1,
              height: "32px",
              // width:"36px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Reset Filter
          </Button>
          <Button
            appearance="primary"
            onClick={onApplyFilter}
            disabled={isApplyDisabled}
            style={{
              backgroundColor: isApplyDisabled ? "#cccccc" : "#2453C3",
              color: "#ffffff",
              flex: 1,
              height: "36px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
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
