import * as React from "react";
import {
  Table,
  TableSkeleton,
  Pagination,
  Card,
} from "@shared/components";
import { ScholarshipReportData, ReportFilters, ReportTab } from "./types";
import ReportsTabs from "./components/ReportsTabs";
import ReportsFilters from "./components/ReportsFilters";
import EmptyState from "./components/EmptyState";
import { useReportsTable } from "./hooks/useReportsTable";
import PrintDetailsModal from "../process/components/PrintDetailsModal";
import { reports } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";
import { useActionLoading } from "@/hooks";

const ReportsPage: React.FC = () => {
  const { success, error: showError } = useToast();
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
    issuedBy: undefined,
    issuedDate: null,
    issuedType: undefined,
    applicationNo: "",
    studentId: "",
    mobileNumber: "",
  });
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [hasAppliedFilters, setHasAppliedFilters] = React.useState(false);
  const [applyTrigger, setApplyTrigger] = React.useState(0); // Trigger counter to force re-fetch
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Loading state for export action
  const { loading: exportLoading, execute: executeExport } = useActionLoading();

  // Print Modal State
  const [printModalOpen, setPrintModalOpen] = React.useState(false);
  const [selectedReportForPrint, setSelectedReportForPrint] = React.useState<ScholarshipReportData | null>(null);

  const handleViewPdf = React.useCallback((item: ScholarshipReportData) => {
    setSelectedReportForPrint(item);
    setPrintModalOpen(true);
  }, []);

  // Format date to DD/MM/YYYY for API
  const formatDateForAPI = (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch report data from backend
  const fetchReportData = React.useCallback(async () => {
    if (!hasAppliedFilters) {
      setReportData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: any[] = [];

      if (activeTab === "categories-wise") {
        // Categories Wise Report filters: Academic Year, Applied Date, Gender, Status, Keyword Search
        const apiFilters: Record<string, unknown> = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.appliedDate && { appliedDate: formatDateForAPI(filters.appliedDate) }),
          ...(filters.gender && { gender: filters.gender }),
          ...(filters.status && { status: filters.status }),
          ...(filters.keywordSearch && { keyword: filters.keywordSearch }),
        };

        data = await reports.getCategoriesWiseReport(apiFilters);
      } else if (activeTab === "scholarship-issued") {
        // Report of Scholarship Issued filters: Academic Year, Issued By, Issued Date, Issued Type, Keyword Search
        const apiFilters: Record<string, unknown> = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.issuedDate && { issuedDate: formatDateForAPI(filters.issuedDate) }),
          ...(filters.issuedType && { issuedType: filters.issuedType }),
          ...(filters.keywordSearch && { keyword: filters.keywordSearch }),
          // Use internal fields for API
          ...(filters.intIssuedBy !== undefined && { intIssuedBy: filters.intIssuedBy }),
          ...(filters.strIssuedBy && { strIssuedBy: filters.strIssuedBy }),
        };

        data = await reports.getScholarshipIssuedReport(apiFilters);
      } else if (activeTab === "approved-form") {
        // Approved Form filters: Academic Year, Application No., Student ID, Status, Mobile No., Keyword Search
        // Note: Some filters may need client-side filtering as the API might not support all fields
        const apiFilters: Record<string, unknown> = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.status && { status: filters.status }),
          // Application No, Student ID, Mobile No may need client-side filtering
        };

        data = await reports.getCategoriesWiseReport(apiFilters);
      }

      // Debug: Log first record to see actual column names
      if (data && data.length > 0) {
        console.log("Sample report data record:", data[0]);
        console.log("Available keys in record:", Object.keys(data[0]));
      }

      setReportData(data || []);
    } catch (err: any) {
      console.error("Error fetching report data:", err);
      const errorMessage = err?.response?.data?.message || "Failed to fetch report data";
      setError(errorMessage);
      showError('Failed to Load Report', errorMessage);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, hasAppliedFilters, activeTab]);

  // Fetch data when filters are applied
  React.useEffect(() => {
    if (hasAppliedFilters) {
      fetchReportData();
    }
  }, [hasAppliedFilters, activeTab, applyTrigger]); // Add applyTrigger to dependencies

  // Get filtered data - use backend data
  const filteredData = React.useMemo(() => {
    if (!hasAppliedFilters || loading) {
      return [];
    }

    // Apply keyword search on client side if needed
    let data = [...reportData];

    // Apply client-side keyword search filtering for all tabs
    if (filters.keywordSearch) {
      const searchTerm = filters.keywordSearch.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // For Approved Form tab, apply client-side filtering for applicationNo, studentId, mobileNumber
    // since the API might not support all these fields directly
    if (activeTab === "approved-form") {
      if (filters.applicationNo) {
        const searchTerm = filters.applicationNo.toLowerCase();
        data = data.filter((item) => {
          const appNo = String(item.Application_Id || item.Application_No || item.applicationNo || "").toLowerCase();
          return appNo.includes(searchTerm);
        });
      }
      if (filters.studentId) {
        const searchTerm = filters.studentId.toLowerCase();
        data = data.filter((item) => {
          const studentId = String(item.Student_Id || item.Student_ID || item.studentId || "").toLowerCase();
          return studentId.includes(searchTerm);
        });
      }
      if (filters.mobileNumber) {
        const searchTerm = filters.mobileNumber.toLowerCase();
        data = data.filter((item) => {
          const mobile = String(item.Mobile_Number || item.Mobile_No || item.mobileNumber || "").toLowerCase();
          return mobile.includes(searchTerm);
        });
      }
    }

    return data;
  }, [reportData, activeTab, filters.applicationNo, filters.studentId, filters.mobileNumber, filters.keywordSearch, hasAppliedFilters, loading]);

  // Helper to get application number from any data type
  const getApplicationNo = (item: any): string => {
    return item?.Application_Id || item?.applicationNo || "";
  };

  // Get table columns
  const { columns } = useReportsTable({
    onRowSelect: (item, selected) => {
      const newSelected = new Set(selectedRows);
      const appNo = getApplicationNo(item);
      if (selected) {
        newSelected.add(appNo);
      } else {
        newSelected.delete(appNo);
      }
      setSelectedRows(newSelected);
    },
    onSelectAll: (selected) => {
      if (selected) {
        const allIds = new Set(filteredData?.map(item => getApplicationNo(item)));
        setSelectedRows(allIds);
      } else {
        setSelectedRows(new Set());
      }
    },
    selectedRows,
    data: filteredData,
    onViewPdf: handleViewPdf,
    activeTab,
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
    setError(null);
    // Increment trigger to force re-fetch even if hasAppliedFilters is already true
    setApplyTrigger(prev => prev + 1);
  }, []);

  const handleResetFilter = React.useCallback(() => {
    console.log("Reset Filter Triggered");
    setFilters({
      academicYear: undefined,
      appliedDate: null,
      gender: undefined,
      status: undefined,
      keywordSearch: "",
      issuedBy: undefined,
      issuedDate: null,
      issuedType: undefined,
      intIssuedBy: undefined,
      strIssuedBy: undefined,
      applicationNo: "",
      studentId: "",
      mobileNumber: "",
    });
    setHasAppliedFilters(false);
    setSelectedRows(new Set());
    setCurrentPage(1);
  }, []);

  const handleExport = React.useCallback(async (format: "excel" | "pdf" | "csv" | "word") => {
    await executeExport(async () => {
      try {
        setError(null);

      let blob: Blob | null = null;
      let filename = "";

      // Prepare filters for export
      let exportFilters: Record<string, unknown> = {};
      let reportType: 'categories' | 'scholarship-issued' | 'approved-form';

      if (activeTab === "categories-wise") {
        reportType = "categories";
        exportFilters = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.appliedDate && { appliedDate: formatDateForAPI(filters.appliedDate) }),
          ...(filters.gender && { gender: filters.gender }),
          ...(filters.status && { status: filters.status }),
          ...(filters.keywordSearch && { keyword: filters.keywordSearch }),
        };
      } else if (activeTab === "scholarship-issued") {
        reportType = "scholarship-issued";
        exportFilters = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.issuedDate && { issuedDate: formatDateForAPI(filters.issuedDate) }),
          ...(filters.issuedType && { issuedType: filters.issuedType }),
          ...(filters.keywordSearch && { keyword: filters.keywordSearch }),
          ...(filters.intIssuedBy !== undefined && { intIssuedBy: filters.intIssuedBy }),
          ...(filters.strIssuedBy && { strIssuedBy: filters.strIssuedBy }),
        };
      } else {
        reportType = "approved-form";
        exportFilters = {
          ...(filters.academicYear && { academicYear: filters.academicYear }),
          ...(filters.applicationNo && { applicationNo: filters.applicationNo }),
          ...(filters.studentId && { studentId: filters.studentId }),
          ...(filters.status && { status: filters.status }),
          ...(filters.mobileNumber && { mobileNumber: filters.mobileNumber }),
          ...(filters.keywordSearch && { keyword: filters.keywordSearch }),
        };
      }

      // Determine filename based on format
      const reportName = reportType === "categories" 
        ? "ScholarshipCategorieswiseReport"
        : reportType === "scholarship-issued"
        ? "ScholarshipIssuedReport"
        : "ApprovedFormReport";

      // Use backend export endpoint for all formats (supports up to 100,000 records)
      try {
        blob = await reports.exportReport(reportType, format, exportFilters);
        
        if (format === "pdf") {
          filename = `${reportName}.pdf`;
        } else if (format === "excel") {
          filename = `${reportName}.xlsx`;
        } else if (format === "csv") {
          filename = `${reportName}.csv`;
        } else if (format === "word") {
          filename = `${reportName}.docx`;
        } else {
          filename = `${reportName}.${format}`;
        }
      } catch (exportError: unknown) {
        // Fallback to client-side CSV if backend fails
        console.warn("Backend export failed, using client-side CSV export:", exportError);
        const csvContent = convertToCSV(filteredData);
        blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        filename = `${reportName}_${new Date().toISOString().split('T')[0]}.csv`;
        format = "csv"; // Update format for success message
      }

      if (!blob || !filename) {
        throw new Error("Failed to generate export file");
      }

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
        success('Export Successful', `Report exported as ${filename} successfully`);
      } catch (err: unknown) {
        console.error("Error exporting report:", err);
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to export report";
        setError(errorMessage);
        showError('Export Failed', errorMessage);
        throw err; // Re-throw to let useActionLoading handle the error state
      }
    });
  }, [filteredData, filters, activeTab, success, showError, executeExport]);

  // Helper function to convert data to CSV
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data?.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(",")
      )
    ];

    return csvRows.join("\n");
  };


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
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        minWidth: 0, // Allow flex item to shrink below content size
        overflow: "hidden", // Prevent overflow from affecting parent
      }}>
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
            exportLoading={exportLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: "16px 24px",
            backgroundColor: "#fee",
            color: "#c00",
            borderBottom: "1px solid #e0e0e0",
          }}>
            {error}
          </div>
        )}

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
              minWidth: 0, // Allow flex item to shrink below content size
            }}>
              <div style={{ 
                flex: 1, 
                minHeight: 0, 
                minWidth: 0, 
                overflowX: "auto", // Enable horizontal scrolling
                overflowY: "auto", // Enable vertical scrolling
                width: "100%"
              }}>
                {loading ? (
                  <TableSkeleton
                    columnCount={columns.length - (columns.some(col => col.key === 'checkbox') ? 1 : 0)}
                    rowCount={5}
                    columnWidths={columns
                      .filter(col => col.key !== 'checkbox')
                      .map(col => col.minWidth || 150)}
                    showCheckbox={columns.some(col => col.key === 'checkbox')}
                  />
                ) : (
                  <Table columns={columns} data={paginatedData} />
                )}
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

