import * as React from "react";
import {
  Table,
  Pagination,
  Card,
} from "@shared/components";
import { ScholarshipReportData, ReportFilters, ReportTab } from "./types";
import { mockScholarshipData } from "./constants";
import ReportsTabs from "./components/ReportsTabs";
import ReportsFilters from "./components/ReportsFilters";
import EmptyState from "./components/EmptyState";
import { useReportsTable } from "./hooks/useReportsTable";
import PrintDetailsModal from "../process/components/PrintDetailsModal";

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ReportTab>("categories-wise");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  // RPT-001: Filters state
  const [filters, setFilters] = React.useState<ReportFilters>({
    academicYear: undefined,
    appliedDate: null,
    gender: undefined,
    status: undefined,
    keywordSearch: "",
  });
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [hasAppliedFilters, setHasAppliedFilters] = React.useState(false);

  // Print Modal State
  const [printModalOpen, setPrintModalOpen] = React.useState(false);
  const [selectedReportForPrint, setSelectedReportForPrint] = React.useState<ScholarshipReportData | null>(null);

  const handleViewPdf = React.useCallback((item: ScholarshipReportData) => {
    setSelectedReportForPrint(item);
    setPrintModalOpen(true);
  }, []);

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
    onViewPdf: handleViewPdf,
  });

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  console.log("Rendering ReportsPage. Filters:", filters);

  React.useEffect(() => {
    console.log("ReportsPage MOUNTED");
    return () => console.log("ReportsPage UNMOUNTED");
  }, []);

  // Handle tab change with explicit reset logic
  const handleTabChange = React.useCallback((newTab: ReportTab) => {
    console.log("Tab Change Triggered:", newTab);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      // Reset logic temporarily disabled for debugging
      /*
      setFilters({
        academicYear: undefined,
        appliedDate: null,
        gender: undefined,
        status: undefined,
        keywordSearch: "",
        issuedBy: "",
        issuedDate: null,
        issuedType: undefined,
        applicationNo: "",
        studentId: "",
        mobileNumber: "",
      });
      setHasAppliedFilters(false);
      setSelectedRows(new Set());
      setCurrentPage(1);
      */
    }
  }, [activeTab]);

  const handleApplyFilter = React.useCallback(() => {
    setHasAppliedFilters(true);
    setCurrentPage(1);
  }, []);

  const handleResetFilter = React.useCallback(() => {
    console.log("Reset Filter Triggered");
    setFilters({
      academicYear: undefined,
      appliedDate: null,
      gender: undefined,
      status: undefined,
      keywordSearch: "",
      issuedBy: "",
      issuedDate: null,
      issuedType: undefined,
      applicationNo: "",
      studentId: "",
      mobileNumber: "",
    });
    setHasAppliedFilters(false);
    setSelectedRows(new Set());
    setCurrentPage(1);
  }, []);

  const handleExport = React.useCallback((format: "excel" | "pdf" | "csv") => {
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

    console.log(`Exporting to ${format} `, exportData);

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
  }, [filteredData]);

  // Handle individual filter updates
  const handleFilterUpdate = React.useCallback((key: keyof ReportFilters, value: any) => {
    console.log(`Parent updating filter: ${key} = ${value} `);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      // padding: "24px",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      gap: "0px",
      overflow: "hidden",
    }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title Section */}
        <div style={{ paddingTop: "8px", paddingBottom: "9px", paddingLeft: "24px", }}>
          <h1 style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            marginTop: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            Reports
          </h1>
          <p style={{
            fontSize: "12px",
            lineHeight: "20px",
            fontWeight: 400,
            color: "#616161",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            Generate and Export Scholarship Performance Reports
          </p>
        </div>

        {/* Tabs Section */}
        <div>
          <ReportsTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onExport={handleExport}
            showActions={hasAppliedFilters && filteredData.length > 0}
          />
        </div>

        {/* Actions and Table Section */}
        {hasAppliedFilters && filteredData.length > 0 ? (
          <>
            {/* Table Section */}
            <Card variant="elevated" style={{
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              borderRight: "none",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }}>
                <Table columns={columns} data={paginatedData} />
              </div>

              {/* Pagination */}
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
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card variant="elevated" style={{
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            borderRight: "none",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
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
        onFilterUpdate={handleFilterUpdate}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
        activeTab={activeTab}
      />

      {/* Print Details Modal */}
      {selectedReportForPrint && (
        <PrintDetailsModal
          open={printModalOpen}
          onOpenChange={setPrintModalOpen}
          data={{
            ...selectedReportForPrint,
            amount: selectedReportForPrint.issuedAmount
          } as any}
        />
      )}
    </div>
  );
};

export default ReportsPage;

