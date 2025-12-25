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
import { reports } from "../../services/scholarship.service";

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
  const [applyTrigger, setApplyTrigger] = React.useState(0); // Trigger counter to force re-fetch
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
        const apiFilters: any = {
          academicYear: filters.academicYear ? Number(filters.academicYear) : undefined,
          mainCategory: filters.mainCategory,
          status: filters.status,
          fromDate: formatDateForAPI(filters.fromDate),
          toDate: formatDateForAPI(filters.toDate),
          amount: filters.amount,
          gender: filters.gender,
          issuedTo: filters.issuedTo,
          sairamCategory: filters.sairamCategory,
          institutionName: filters.institutionName,
          parentOffice: filters.parentOffice,
          favourCategory: filters.favourCategory,
          favourGroup: filters.favourGroup,
          keyword: filters.keyword || filters.keywordSearch,
        };

        // Remove undefined values
        Object.keys(apiFilters).forEach(key => {
          if (apiFilters[key] === undefined || apiFilters[key] === null || apiFilters[key] === '') {
            delete apiFilters[key];
          }
        });

        data = await reports.getCategoriesWiseReport(apiFilters);
      } else if (activeTab === "scholarship-issued") {
        // For scholarship issued report, follow old app logic:
        // - Convert dates from DD/MM/YYYY format (frontend) to MM/DD/YYYY (stored procedure expects this)
        // - Always pass all parameters (even if null/empty) - stored procedure handles null values
        // - If date is not provided, pass null (backend will handle it)
        const apiFilters: any = {
          fromDate: formatDateForAPI(filters.fromDate) || null, // Convert to DD/MM/YYYY or null
          toDate: formatDateForAPI(filters.toDate) || null, // Convert to DD/MM/YYYY or null
          institutionId: filters.institutionId || null,
          strInstitution: filters.strInstitution || null,
          chequeInFavorType: filters.chequeInFavorType || null,
          intIssuedBy: filters.intIssuedBy || null,
          strIssuedBy: filters.strIssuedBy || null,
        };

        // Don't remove null/empty values - stored procedure expects all parameters
        // Just remove undefined values
        Object.keys(apiFilters).forEach(key => {
          if (apiFilters[key] === undefined) {
            delete apiFilters[key];
          }
        });

        data = await reports.getScholarshipIssuedReport(apiFilters);
      } else if (activeTab === "approved-form") {
        // For approved form, use the categories report with status = "Approved"
        // The backend will normalize the status to handle case-insensitive comparison
        // Note: USP_GetReportApproved_Waiting_Status doesn't support keyword filtering
        // If keyword is provided, we'll need to filter client-side after fetching
        const apiFilters: any = {
          academicYear: filters.academicYear ? Number(filters.academicYear) : undefined,
          status: filters.status || "Approved", // Default to "Approved" if not specified
          // Don't pass keyword to the stored procedure - it doesn't support it
        };

        // Remove undefined values
        Object.keys(apiFilters).forEach(key => {
          if (apiFilters[key] === undefined || apiFilters[key] === null || apiFilters[key] === '') {
            delete apiFilters[key];
          }
        });

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
      setError(err?.response?.data?.message || "Failed to fetch report data");
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

    // For Approved Form tab, apply client-side filtering for applicationNo, studentId, mobileNumber
    // since USP_GetReportApproved_Waiting_Status doesn't support keyword filtering
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
      // Also apply general keyword search if provided
      if (filters.keyword || filters.keywordSearch) {
        const searchTerm = (filters.keyword || filters.keywordSearch || "").toLowerCase();
        data = data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm)
          )
        );
      }
    } else if (filters.keyword || filters.keywordSearch) {
      const searchTerm = (filters.keyword || filters.keywordSearch || "").toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    return data;
  }, [reportData, activeTab, filters.applicationNo, filters.studentId, filters.mobileNumber, filters.keyword, filters.keywordSearch, hasAppliedFilters, loading]);

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
        const allIds = new Set(filteredData.map(item => getApplicationNo(item)));
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

  const handleExport = React.useCallback(async (format: "excel" | "pdf" | "csv") => {
    try {
      setLoading(true);
      setError(null);

      let blob: Blob;
      let filename: string;

      if (format === "csv") {
        // CSV export - convert data to CSV format (client-side)
        const csvContent = convertToCSV(filteredData);
        blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        filename = `ScholarshipReport_${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        // Prepare filters for export
        let exportFilters: any = {};

        if (activeTab === "categories-wise") {
          exportFilters = {
            academicYear: filters.academicYear ? Number(filters.academicYear) : undefined,
            mainCategory: filters.mainCategory,
            status: filters.status,
            fromDate: formatDateForAPI(filters.fromDate),
            toDate: formatDateForAPI(filters.toDate),
            amount: filters.amount,
            gender: filters.gender,
            issuedTo: filters.issuedTo,
            sairamCategory: filters.sairamCategory,
            institutionName: filters.institutionName,
            parentOffice: filters.parentOffice,
            favourCategory: filters.favourCategory,
            favourGroup: filters.favourGroup,
            keyword: filters.keyword || filters.keywordSearch,
          };
        } else if (activeTab === "scholarship-issued") {
          exportFilters = {
            fromDate: formatDateForAPI(filters.fromDate),
            toDate: formatDateForAPI(filters.toDate),
            institutionId: filters.institutionId,
            strInstitution: filters.strInstitution,
            chequeInFavorType: filters.chequeInFavorType,
            intIssuedBy: filters.intIssuedBy,
            strIssuedBy: filters.strIssuedBy,
    };
        }

        // Remove undefined values
        Object.keys(exportFilters).forEach(key => {
          if (exportFilters[key] === undefined || exportFilters[key] === null || exportFilters[key] === '') {
            delete exportFilters[key];
          }
        });

        // Try to export from backend, fallback to client-side if not available
        try {
          if (format === "excel") {
            blob = await reports.exportToExcel(activeTab === "categories-wise" ? "categories" : "scholarship-issued", exportFilters);
            filename = `ScholarshipCategorieswiseReport.xls`;
          } else {
            blob = await reports.exportToPdf(activeTab === "categories-wise" ? "categories" : "scholarship-issued", exportFilters);
            filename = `ScholarshipCategorieswiseReport.pdf`;
          }
        } catch (exportError: any) {
          // If backend export fails, use client-side export for Excel/PDF
          console.warn("Backend export not available, using client-side export:", exportError);
    if (format === "excel") {
            const csvContent = convertToCSV(filteredData);
            blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
            filename = `ScholarshipReport_${new Date().toISOString().split('T')[0]}.xls`;
          } else {
            // For PDF, we'd need a library like jsPDF, for now export as CSV
            const csvContent = convertToCSV(filteredData);
            blob = new Blob([csvContent], { type: "text/plain" });
            filename = `ScholarshipReport_${new Date().toISOString().split('T')[0]}.txt`;
          }
        }
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
    } catch (err: any) {
      console.error("Error exporting report:", err);
      setError(err?.response?.data?.message || "Failed to export report");
    } finally {
      setLoading(false);
    }
  }, [filteredData, filters, activeTab]);

  // Helper function to convert data to CSV
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row =>
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

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            padding: "16px 24px",
            textAlign: "center",
            color: "#616161",
          }}>
            Loading report data...
          </div>
        )}

        {/* Actions and Table Section */}
        {hasAppliedFilters && !loading && filteredData.length > 0 ? (
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

