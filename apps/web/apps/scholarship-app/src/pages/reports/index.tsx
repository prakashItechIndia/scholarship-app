import * as React from "react";
import {
  Table,
  Pagination,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import {
  MoreVerticalRegular,
  ArrowDown20Regular,
  ChevronDown20Regular,
} from "@fluentui/react-icons";
import { ScholarshipReportData, ReportFilters, ReportTab } from "./types";
import { mockScholarshipData } from "./constants";
import ReportsTabs from "./components/ReportsTabs";
import ReportsFilters from "./components/ReportsFilters";
import EmptyState from "./components/EmptyState";
import { useReportsTable } from "./hooks/useReportsTable";

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ReportTab>("scholarship-issued");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [filters, setFilters] = React.useState<ReportFilters>({
    academicYear: undefined,
    appliedDate: null,
    gender: undefined,
    status: undefined,
    keywordSearch: "",
  });
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [hasAppliedFilters, setHasAppliedFilters] = React.useState(false);
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);

  // Get filtered data based on active tab and filters
  const filteredData = React.useMemo(() => {
    if (!hasAppliedFilters) {
      return [];
    }

    let data = [...mockScholarshipData];

    // Apply keyword search
    if (filters.keywordSearch) {
      const searchTerm = filters.keywordSearch.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply other filters as needed
    // Add more filter logic here based on requirements

    return data;
  }, [filters, hasAppliedFilters]);

  // Get table columns
  const { columns } = useReportsTable({
    onRowSelect: (item, selected) => {
      const newSelected = new Set(selectedRows);
      if (selected) {
        newSelected.add(item.applicationNo);
      } else {
        newSelected.delete(item.applicationNo);
      }
      setSelectedRows(newSelected);
    },
    onSelectAll: (selected) => {
      if (selected) {
        const allIds = new Set(filteredData.map(item => item.applicationNo));
        setSelectedRows(allIds);
      } else {
        setSelectedRows(new Set());
      }
    },
    selectedRows,
    data: filteredData,
  });

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab]);

  const handleApplyFilter = () => {
    setHasAppliedFilters(true);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setFilters({
      academicYear: undefined,
      appliedDate: null,
      gender: undefined,
      status: undefined,
      keywordSearch: "",
    });
    setHasAppliedFilters(false);
    setSelectedRows(new Set());
    setCurrentPage(1);
  };

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    // RPT-002: Include generation timestamp and generated-by user ID
    const exportData = {
      data: filteredData,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: "current-user-id", // In real app, get from auth context
        format,
        totalRecords: filteredData.length,
      },
    };

    console.log(`Exporting to ${format}`, exportData);
    
    // RPT-003: Support datasets up to 100,000 records
    if (filteredData.length > 100000) {
      console.warn("Dataset exceeds 100,000 records. Export may be slow.");
    }

    // RPT-001: Reports shall be generated within 30 seconds
    // In real app, this would trigger an async export process
    // For now, simulate export
    if (format === "excel") {
      // Export as Excel (.xlsx)
      console.log("Exporting as Excel with multiple sheets");
    } else if (format === "pdf") {
      // Export as PDF (formatted document)
      console.log("Exporting as PDF for printing");
    } else if (format === "csv") {
      // Export as CSV (comma-separated values)
      console.log("Exporting as CSV for data analysis");
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      gap: "24px",
    }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{
            fontSize: "32px",
            lineHeight: "40px",
            fontWeight: 700,
            color: "#242424",
            marginBottom: "8px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Reports - Generate and Export Scholarship Performance Reports
          </h1>
        </div>

        {/* Tabs Section */}
        <div style={{ marginBottom: "24px" }}>
          <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Actions and Table Section */}
        {hasAppliedFilters && filteredData.length > 0 ? (
          <>
            {/* Action Buttons */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              marginBottom: "16px",
            }}>
              <DropdownMenu open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
                <DropdownMenuTrigger>
                  <Button
                    appearance="primary"
                    style={{
                      backgroundColor: "#0f6cbd",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ArrowDown20Regular style={{ width: "16px", height: "16px" }} />
                    Export
                    <ChevronDown20Regular style={{ width: "16px", height: "16px" }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    label="Excel (.xlsx)"
                    onClick={() => {
                      handleExport("excel");
                      setExportMenuOpen(false);
                    }}
                  />
                  <DropdownMenuItem
                    label="PDF"
                    onClick={() => {
                      handleExport("pdf");
                      setExportMenuOpen(false);
                    }}
                  />
                  <DropdownMenuItem
                    label="CSV"
                    onClick={() => {
                      handleExport("csv");
                      setExportMenuOpen(false);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
                <DropdownMenuTrigger>
                  <Button
                    appearance="subtle"
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    aria-label="More options"
                    style={{
                      width: "36px",
                      height: "36px",
                      padding: 0,
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

            {/* Table Section */}
            <Card variant="elevated" style={{
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ overflowX: "auto", flex: 1 }}>
                <Table columns={columns} data={paginatedData} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: "16px",
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    showFirstLast={true}
                    showPageSize={true}
                    showPageNumbers={true}
                    maxPageButtons={7}
                  />
                </div>
              )}
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card variant="elevated" style={{
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <EmptyState />
          </Card>
        )}
      </div>

      {/* Filters Sidebar */}
      <ReportsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />
    </div>
  );
};

export default ReportsPage;

