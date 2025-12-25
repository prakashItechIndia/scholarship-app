import * as React from "react";
import { Select, DatePicker, Input, Button } from "@shared/components";
import { SearchRegular } from "@fluentui/react-icons";
import { ReportFilters, ReportTab } from "../types";
import {
  academicYearOptions,
  genderOptions,
  statusOptions,
  mainCategoryOptions,
  amountOptions,
  issuedToOptions,
  sairamCategoryOptions,
  collegeOptions,
  schoolOptions,
  polytechnicOptions,
  medicalOptions,
  favourCategoryOptions,
  favourGroupOptions,
  scholarshipIssuedMainCategoryOptions,
  chequeInFavorTypeOptions,
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

  // Determine which filters to show based on Main Category
  const showDateFilters =
    filters.mainCategory === "Applied Date" ||
    filters.mainCategory === "Processed Date";
  const showAmountFilter = filters.mainCategory === "Amount";
  const showGenderFilter = filters.mainCategory === "Gender";
  const showIssuedToFilter = filters.mainCategory === "Issued to";
  const showStatusFilter = filters.mainCategory === "Status";
  const showSairamGroupFilter = filters.mainCategory === "Sairam Group";
  const showParentOfficeFilter = filters.mainCategory === "Parent Office";
  const showFavourTypeFilter = filters.mainCategory === "Favour Type";

  // For Sairam Group, show institution dropdown based on selected category
  const showInstitutionFilter =
    showSairamGroupFilter && filters.sairamCategory !== "All";
  const institutionOptions =
    filters.sairamCategory === "College"
      ? collegeOptions
      : filters.sairamCategory === "School"
      ? schoolOptions
      : filters.sairamCategory === "Polytechnic"
      ? polytechnicOptions
      : filters.sairamCategory === "Medical"
      ? medicalOptions
      : [];

  // For Favour Type, show Sairam Group filters if Favour Group is "Sairam Group"
  const showFavourSairamGroup =
    showFavourTypeFilter && filters.favourGroup === "Sairam Group";

  // For Scholarship Issued Report
  const showIssuedDateFilters =
    activeTab === "scholarship-issued" &&
    filters.mainCategory === "Issued Date";
  const showIssuedByFilter =
    activeTab === "scholarship-issued" &&
    filters.mainCategory === "Issued By";
  const showChequeInFavorType =
    activeTab === "scholarship-issued" &&
    filters.mainCategory !== "" &&
    filters.mainCategory !== "--Select--";
  const showIssuedInstitutionFilter =
    showChequeInFavorType &&
    filters.chequeInFavorType !== "All" &&
    filters.chequeInFavorType !== "Individual";

  const isApplyDisabled = React.useMemo(() => {
    if (activeTab === "categories-wise") {
      return !filters.academicYear || !filters.mainCategory || filters.mainCategory === "";
    }
    if (activeTab === "scholarship-issued") {
      return !filters.mainCategory || filters.mainCategory === "";
    }
    if (activeTab === "approved-form") {
      // For approved form, at least one filter should be selected
      return !filters.academicYear && !filters.applicationNo && !filters.studentId && !filters.status && !filters.mobileNumber;
    }
    return false;
  }, [filters, activeTab]);

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
        {/* Academic Year - For Categories Report */}
        {activeTab === "categories-wise" && (
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
        )}

        {/* Main Category */}
        {activeTab !== "approved-form" && (
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
              Main Category
            </label>
            <Select
              placeholder="--Select--"
              options={
                activeTab === "categories-wise"
                  ? mainCategoryOptions
                  : scholarshipIssuedMainCategoryOptions
              }
              selectedKey={filters.mainCategory || ""}
              onValueChange={(value) => {
                const previousMainCategory = filters.mainCategory;
                handleFilterChange("mainCategory", value);
                // Only reset filters that are no longer relevant to the new main category
                // Preserve filters that are still valid
                if (previousMainCategory !== value) {
                  if (activeTab === "categories-wise") {
                    // Clear filters that are specific to the previous main category
                    // Only clear if the new main category doesn't use them
                    if (previousMainCategory === "Applied Date" || previousMainCategory === "Processed Date") {
                      if (value !== "Applied Date" && value !== "Processed Date") {
                        handleFilterChange("fromDate", null);
                        handleFilterChange("toDate", null);
                      }
                    }
                    if (previousMainCategory === "Amount" && value !== "Amount") {
                      handleFilterChange("amount", undefined);
                    }
                    if (previousMainCategory === "Gender" && value !== "Gender") {
                      handleFilterChange("gender", undefined);
                    }
                    if (previousMainCategory === "Issued to" && value !== "Issued to") {
                      handleFilterChange("issuedTo", undefined);
                    }
                    if (previousMainCategory === "Status" && value !== "Status") {
                      handleFilterChange("status", undefined);
                    }
                    if (previousMainCategory === "Sairam Group" && value !== "Sairam Group") {
                      handleFilterChange("sairamCategory", undefined);
                      handleFilterChange("institutionName", undefined);
                    }
                    if (previousMainCategory === "Parent Office" && value !== "Parent Office") {
                      handleFilterChange("parentOffice", undefined);
                    }
                    if (previousMainCategory === "Favour Type" && value !== "Favour Type") {
                      handleFilterChange("favourCategory", undefined);
                      handleFilterChange("favourGroup", undefined);
                      handleFilterChange("sairamCategory", undefined);
                      handleFilterChange("institutionName", undefined);
                    }
                  } else if (activeTab === "scholarship-issued") {
                    // For scholarship-issued tab, clear dependent filters when main category changes
                    if (previousMainCategory === "Issued Date" && value !== "Issued Date") {
                      handleFilterChange("fromDate", null);
                      handleFilterChange("toDate", null);
                    }
                    if (previousMainCategory === "Issued By" && value !== "Issued By") {
                      handleFilterChange("intIssuedBy", undefined);
                      handleFilterChange("strIssuedBy", undefined);
                    }
                    // Always clear chequeInFavorType and related filters when main category changes
                    // (unless it's the same category)
                    if (previousMainCategory !== value) {
                      handleFilterChange("chequeInFavorType", undefined);
                      handleFilterChange("institutionId", undefined);
                      handleFilterChange("strInstitution", undefined);
                    }
                  }
                }
              }}
            />
          </div>
        )}

        {/* Categories Report Filters */}
        {activeTab === "categories-wise" && (
          <>
            {/* Date Filters */}
            {showDateFilters && (
              <>
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
                    From Date
              </label>
              <DatePicker
                    value={filters.fromDate || undefined}
                    onSelectDate={(date) => handleFilterChange("fromDate", date)}
                formatDate={onFormatDate}
                textField={{
                      placeholder: "DD/MM/YYYY",
                } as any}
              />
            </div>
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
                    To Date
                  </label>
                  <DatePicker
                    value={filters.toDate || undefined}
                    onSelectDate={(date) => handleFilterChange("toDate", date)}
                    formatDate={onFormatDate}
                    textField={{
                      placeholder: "DD/MM/YYYY",
                    } as any}
                  />
                </div>
              </>
            )}

            {/* Amount Filter */}
            {showAmountFilter && (
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
                  Amount
                </label>
                <Select
                  placeholder="--Select--"
                  options={amountOptions}
                  selectedKey={filters.amount || ""}
                  onValueChange={(value) => handleFilterChange("amount", value)}
                />
              </div>
            )}

            {/* Gender Filter */}
            {showGenderFilter && (
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
            )}

            {/* Issued To Filter */}
            {showIssuedToFilter && (
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
                  Issued To
                </label>
                <Select
                  placeholder="--Select--"
                  options={issuedToOptions}
                  selectedKey={filters.issuedTo || ""}
                  onValueChange={(value) => handleFilterChange("issuedTo", value)}
                />
              </div>
            )}

            {/* Status Filter */}
            {showStatusFilter && (
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
            )}

            {/* Sairam Group Filter */}
            {showSairamGroupFilter && (
              <>
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
                    Sairam Category
                  </label>
                  <Select
                    placeholder="All"
                    options={sairamCategoryOptions}
                    selectedKey={filters.sairamCategory || "All"}
                    onValueChange={(value) => {
                      handleFilterChange("sairamCategory", value);
                      handleFilterChange("institutionName", undefined);
                    }}
                  />
                </div>
                {showInstitutionFilter && (
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
                      Institution Name
                    </label>
                    <Select
                      placeholder="All"
                      options={institutionOptions}
                      selectedKey={filters.institutionName || "All"}
                      onValueChange={(value) =>
                        handleFilterChange("institutionName", value)
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* Parent Office Filter */}
            {showParentOfficeFilter && (
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
                  Parent Office
                </label>
                <Input
                  placeholder="Enter Parent Office"
                  value={filters.parentOffice || ""}
                  onChange={(e) => handleFilterChange("parentOffice", e.target.value)}
                />
              </div>
            )}

            {/* Favour Type Filters */}
            {showFavourTypeFilter && (
              <>
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
                    Favour Category
                  </label>
                  <Select
                    placeholder="All"
                    options={favourCategoryOptions}
                    selectedKey={filters.favourCategory || "All"}
                    onValueChange={(value) => handleFilterChange("favourCategory", value)}
                  />
                </div>
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
                    Favour Group
                  </label>
                  <Select
                    placeholder="All"
                    options={favourGroupOptions}
                    selectedKey={filters.favourGroup || "All"}
                    onValueChange={(value) => {
                      handleFilterChange("favourGroup", value);
                      if (value !== "Sairam Group") {
                        handleFilterChange("sairamCategory", undefined);
                        handleFilterChange("institutionName", undefined);
                      }
                    }}
                  />
                </div>
                {showFavourSairamGroup && (
                  <>
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
                        Sairam Category
                      </label>
                      <Select
                        placeholder="All"
                        options={sairamCategoryOptions}
                        selectedKey={filters.sairamCategory || "All"}
                        onValueChange={(value) => {
                          handleFilterChange("sairamCategory", value);
                          handleFilterChange("institutionName", undefined);
                        }}
                      />
                    </div>
                    {showInstitutionFilter && (
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
                          Institution Name
                        </label>
                        <Select
                          placeholder="All"
                          options={institutionOptions}
                          selectedKey={filters.institutionName || "All"}
                          onValueChange={(value) =>
                            handleFilterChange("institutionName", value)
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Scholarship Issued Report Filters */}
        {activeTab === "scholarship-issued" && (
          <>
            {/* Issued By Filter */}
            {showIssuedByFilter && (
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
                  placeholder="All"
                  options={[
                    { value: "All", label: "All" },
                    ...chequeIssuedByOptions,
                  ]}
                  selectedKey={filters.strIssuedBy || "All"}
                  onValueChange={(value) => {
                    if (value === "All") {
                      handleFilterChange("strIssuedBy", "All");
                      handleFilterChange("intIssuedBy", undefined);
                    } else {
                      handleFilterChange("strIssuedBy", undefined);
                      handleFilterChange("intIssuedBy", value ? Number(value) : undefined);
                    }
                  }}
              />
            </div>
            )}

            {/* Date Filters for Issued Date */}
            {showIssuedDateFilters && (
              <>
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
                    From Date
              </label>
              <DatePicker
                    value={filters.fromDate || undefined}
                    onSelectDate={(date) => handleFilterChange("fromDate", date)}
                formatDate={onFormatDate}
                textField={{
                      placeholder: "DD/MM/YYYY",
                } as any}
              />
            </div>
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
                    To Date
                  </label>
                  <DatePicker
                    value={filters.toDate || undefined}
                    onSelectDate={(date) => handleFilterChange("toDate", date)}
                    formatDate={onFormatDate}
                    textField={{
                      placeholder: "DD/MM/YYYY",
                    } as any}
                  />
                </div>
              </>
            )}

            {/* Cheque In Favor Type */}
            {showChequeInFavorType && (
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
                  Type
                </label>
                <Select
                  placeholder="All"
                  options={chequeInFavorTypeOptions}
                  selectedKey={filters.chequeInFavorType || "All"}
                  onValueChange={(value) => {
                    handleFilterChange("chequeInFavorType", value);
                    if (value === "All" || value === "Individual") {
                      handleFilterChange("institutionId", undefined);
                      handleFilterChange("strInstitution", undefined);
                    }
                  }}
                />
              </div>
            )}

            {/* Issued Institution Filter */}
            {showIssuedInstitutionFilter && (
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
                  In Favor of
              </label>
              <Select
                  placeholder="--Select--"
                  options={[
                    { value: "All", label: "All" },
                    { value: "Other", label: "Other" },
                    ...chequeIssuedByOptions,
                  ]}
                  selectedKey={
                    filters.strInstitution ||
                    filters.institutionId?.toString() ||
                    ""
                  }
                  onValueChange={(value) => {
                    if (value === "All") {
                      handleFilterChange("strInstitution", "All");
                      handleFilterChange("institutionId", undefined);
                    } else if (value === "Other") {
                      handleFilterChange("strInstitution", "Other");
                      handleFilterChange("institutionId", undefined);
                    } else {
                      handleFilterChange("strInstitution", undefined);
                      handleFilterChange("institutionId", value ? Number(value) : undefined);
                    }
                  }}
              />
            </div>
            )}
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
                Application No
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
              value={filters.keyword || filters.keywordSearch || ""}
              onChange={(e) => {
                handleFilterChange("keyword", e.target.value);
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
