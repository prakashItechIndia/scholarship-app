import * as React from "react";
import {
  Table,
  Pagination,
  Button,

  Modal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import {
  MoreVerticalRegular,
  ChevronDownRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import PDFViewerModal from "../../components/PDFViewerModal";
import ViewDocumentsDrawer from "../../components/ViewDocumentsDrawer";
import ApplicationDetailsView from "../../components/ApplicationDetailsView";
import { ApplicationData } from "./types";
import { tabDataMap, tabTotalItemsMap } from "./constants";
import { useProcessTable } from "./hooks/useProcessTable";
import ProcessTabs from "./components/ProcessTabs";
import ProcessFilters from "./components/ProcessFilters";
import DocumentUploadPanel from "./components/DocumentUploadPanel";
import ProcessHistoryModal from "./components/ProcessHistoryModal";
import ScholarshipHistoryModal from "./components/ScholarshipHistoryModal";
import PrintDetailsModal from "./components/PrintDetailsModal";

const tabHeaderInfo: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Overview",
    subtitle: "High-Level View of Document Details and Progress",
  },
  documents: {
    title: "Upload Document",
    subtitle: "Select and Upload Your Supporting Documents",
  },
  verify: {
    title: "Document Verification",
    subtitle: "Submit and Verify Supporting Documents for Approval",
  },
  suggest: {
    title: "Suggest",
    subtitle: "Input the amount you’d like to suggest",
  },
  approve: {
    title: "Approve",
    subtitle: "Review application for final approval",
  },
  "issue-amount": {
    title: "Issue Amount",
    subtitle: "Review and Confirm the Issue Amount",
  },
};

const ProcessPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedApplication, setSelectedApplication] = React.useState<ApplicationData | null>(null);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = React.useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = React.useState(false);
  const [viewDocumentsDrawerOpen, setViewDocumentsDrawerOpen] = React.useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = React.useState<string | undefined>();
  const [selectedPdfApplicationNo, setSelectedPdfApplicationNo] = React.useState<string | undefined>();
  const [uploadPanelOpen, setUploadPanelOpen] = React.useState(false);
  const [selectedUploadApplication, setSelectedUploadApplication] = React.useState<ApplicationData | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false);
  const [selectedHistoryApplication, setSelectedHistoryApplication] = React.useState<ApplicationData | null>(null);

  const [scholarshipHistoryModalOpen, setScholarshipHistoryModalOpen] = React.useState(false);
  const [selectedScholarshipHistoryApplication, setSelectedScholarshipHistoryApplication] = React.useState<ApplicationData | null>(null);

  const [printDetailsModalOpen, setPrintDetailsModalOpen] = React.useState(false);
  const [selectedPrintApplication, setSelectedPrintApplication] = React.useState<ApplicationData | null>(null);

  const [selectedDocument, setSelectedDocument] = React.useState<ApplicationData | null>(null);
  const [academicYear, setAcademicYear] = React.useState("Academic year");

  // Get current tab's total items
  const totalItems = tabTotalItemsMap[activeTab] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Handle view action
  const handleView = React.useCallback((item: ApplicationData) => {
    setSelectedApplication(item);
    setViewModalOpen(true);
  }, []);

  // Handle edit action
  const handleEdit = React.useCallback((item: ApplicationData) => {
    setSelectedApplication(item);
    setEditModalOpen(true);
  }, []);

  // Handle delete action
  const handleDelete = React.useCallback((item: ApplicationData) => {
    setSelectedApplication(item);
    setDeleteModalOpen(true);
  }, []);

  // Handle PDF viewer action
  const handleViewPDF = React.useCallback((item: ApplicationData) => {
    setSelectedPdfUrl("https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/AF2510004.pdf");
    setSelectedPdfApplicationNo(item.applicationNo);
    setPdfViewerOpen(true);
  }, []);

  // Handle document viewer action (for documents tab) - opens drawer with document list
  const handleViewDocument = React.useCallback((item: ApplicationData) => {
    setSelectedDocument(item);
    setViewDocumentsDrawerOpen(true);
  }, []);

  // Handle upload action - opens upload panel
  const handleUpload = React.useCallback((item: ApplicationData) => {
    setSelectedUploadApplication(item);
    setUploadPanelOpen(true);
  }, []);

  // Handle history view action
  const handleViewHistory = React.useCallback((item: ApplicationData) => {
    setSelectedHistoryApplication(item);
    setHistoryModalOpen(true);
  }, []);

  const handleViewScholarshipHistory = React.useCallback((item: ApplicationData) => {
    setSelectedScholarshipHistoryApplication(item);
    setScholarshipHistoryModalOpen(true);
  }, []);

  // Handle print details view action
  const handlePrintDetails = React.useCallback((item: ApplicationData) => {
    setSelectedPrintApplication(item);
    setPrintDetailsModalOpen(true);
  }, []);

  // Handle viewing a specific document from the drawer - opens in new tab
  const handleViewSpecificDocument = React.useCallback((doc: { url: string; name: string }) => {
    // Open PDF in new tab
    window.open(doc.url, '_blank');
  }, []);

  // Handle downloading a document from the drawer
  const handleDownloadDocument = React.useCallback((doc: { url: string; name: string }) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Get table columns using custom hook
  const { columns } = useProcessTable({
    activeTab,
    handleView,
    handleEdit,
    handleDelete,
    handleViewPDF,
    handleViewDocument, // Always pass handleViewDocument so drawer opens for "View Documents"
    handleUpload,
    handleViewHistory,
    handleViewScholarshipHistory,
    handlePrintDetails,
  });

  // Get current tab's data
  const currentTabData = React.useMemo(() => {
    return tabDataMap[activeTab] ?? [];
  }, [activeTab]);

  // Filter data based on search query and active tab
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return currentTabData;
    const query = searchQuery.toLowerCase();
    return currentTabData.filter((item) => {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      );
    });
  }, [searchQuery, currentTabData]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#ffffff",
      padding: "0px", // Removed main padding to allow full-bleed table
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // Prevent outer scroll interaction
    }}>
      {/* Title Section */}
      <div style={{ padding: "0.125rem 1.5rem 0 1.5rem", flexShrink: 0 }}>

        <div style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}>
          <div>
            <h1 style={{
              fontSize: "1rem",
              lineHeight: "1.25rem",
              fontWeight: 600,
              color: "#242424",
              marginBottom: "0.5rem",
              fontFamily: "'Inter', sans-serif",
            }}>
              {tabHeaderInfo[activeTab]?.title || "Overview"}
            </h1>
            <p style={{
              fontSize: "0.75rem",
              lineHeight: "1rem",
              fontWeight: 400,
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              {tabHeaderInfo[activeTab]?.subtitle || "High-Level View of Document Details and Progress"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                appearance="outline"
                style={{
                  minWidth: "140px",
                  justifyContent: "space-between",

                  backgroundColor: "#fff",
                }}
                iconPosition="after"
                icon={<ChevronDownRegular />}
              >
                {academicYear}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setAcademicYear(year)}
                  style={{
                    fontWeight: year === academicYear ? "bold" : "normal",
                    color: year === academicYear ? "#242424" : "#616161", // optional color change for better visibility
                  }}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* Tabs and Search Section */}
      <div style={{
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #e0e0e0", // Added border here as requested
        marginBottom: "0px",
        height: "3.75rem",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "0 24px",
          height: "100%", // Fill the 44px height
        }}>
          {/* Tabs on the left */}
          <ProcessTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Search and Actions on the right */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}>
            <div>
              <Button
                variant="ghost"
                onClick={() => console.log("Search clicked")}
                aria-label="Search"
                className="w-32px h-32px rounded-md bg-white hover:bg-gray-50 p-0 flex items-center justify-center"
              >
                <SearchRegular className="w-5 h-5 text-gray-600" />
                <input
                  id='search'
                  type="text"
                  placeholder="Search"
                  className="w-full h-full bg-transparent border-none outline-none text-gray-600 pl-2"
                />
              </Button>

            </div>
            <ProcessFilters
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}

            />

            <Button
              appearance="outline"
              onClick={() => console.log("More options clicked")}
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
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{
        overflow: "auto", // Enable scrolling on parent container
        backgroundColor: "#ffffff",
        display: "flex", // Changed to flex to support marginTop: auto for footer
        flexDirection: "column",
        border: "none",
        boxShadow: "none",
        borderRadius: "0px",
        flex: 1, // Fill remaining height of the page
        minHeight: 0, // Enable scrolling within flex child
      }} className="custom-scrollbar">
        {/* Add custom style for webkit browsers via style tag if needed, or rely on scrollbar-color property */}
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #d1d1d1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #a8a8a8;
            }
          `}
        </style>

        {/* Table no longer handles its own scrolling. It sits inside the scrolling parent. */}
        <Table
          columns={columns}
          data={paginatedData}
          disableScroll={true}
        />
      </div>

      {/* Pagination Fixed Footer */}
      <div style={{
        padding: "12px 24px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
        flexShrink: 0,
        width: "100%",
        zIndex: 10,
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
          className="w-full !flex-row"
        />
      </div>

      {/* View Modal with Application Details */}
      <Modal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Application Details"
        size={"lg" as const}
        footer={
          <>
            <Button appearance="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button appearance="primary" onClick={() => {
              setViewModalOpen(false);
              if (selectedApplication) handleEdit(selectedApplication);
            }}>
              Edit
            </Button>
          </>
        }
      >
        {selectedApplication && (
          <ApplicationDetailsView
            data={{
              applicationNo: selectedApplication.applicationNo,
              studentName: selectedApplication.studentName,
              classStudying: selectedApplication.classStudying,
              institutionName: selectedApplication.institutionName,
              fatherAnnualIncome: selectedApplication.fatherAnnualIncome,
              mobileNumber: selectedApplication.mobileNumber,
              fatherOccupation: selectedApplication.fatherOccupation,
              status: selectedApplication.status,
              uploadedDate: selectedApplication.uploadedDate,
              verifiedBy: selectedApplication.verifiedBy,
              verifiedDate: selectedApplication.verifiedDate,
            }}
            onEdit={() => {
              setViewModalOpen(false);
              handleEdit(selectedApplication);
            }}
            onViewDocument={(url) => {
              setSelectedPdfUrl(url);
              setSelectedPdfApplicationNo(selectedApplication.applicationNo);
              setPdfViewerOpen(true);
            }}
            onDownload={(url) => {
              window.open(url, '_blank');
            }}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit Application"
        size={"lg" as const}
        footer={
          <>
            <Button appearance="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                console.log("Save changes", selectedApplication);
                setEditModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Edit form for application {selectedApplication?.applicationNo}
          </p>
          {/* Add form fields here */}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Application"
        size={"md" as const}
        footer={
          <>
            <Button appearance="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                console.log("Delete application", selectedApplication);
                setDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Are you sure you want to delete application{" "}
            <span style={{
              fontWeight: 600,
              color: "#242424",
            }}>
              {selectedApplication?.applicationNo}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* PDF Viewer Modal (for Application No click) */}
      <PDFViewerModal
        open={pdfViewerOpen}
        onOpenChange={setPdfViewerOpen}
        pdfUrl={selectedPdfUrl}
        applicationNo={selectedPdfApplicationNo}
        title="File Viewer"
      />

      {/* View Documents Drawer (for View Documents action - opens drawer with list of files) */}
      <ViewDocumentsDrawer
        open={viewDocumentsDrawerOpen}
        onOpenChange={setViewDocumentsDrawerOpen}
        documents={(selectedDocument?.documents ?? []).map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.url,
          size: (doc.size as string) ?? "120 KB",
          uploadedDate: doc.uploadedDate,
          status: doc.status,
        }))}
        applicationNo={selectedDocument?.applicationNo}
        studentName={selectedDocument?.studentName}
        onViewDocument={handleViewSpecificDocument}
        onDownloadDocument={handleDownloadDocument}
      />
      <DocumentUploadPanel
        isOpen={uploadPanelOpen}
        onClose={() => setUploadPanelOpen(false)}
        data={selectedUploadApplication}
      />
      <ProcessHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        applicationNo={selectedHistoryApplication?.applicationNo}
      />
      <ScholarshipHistoryModal
        open={scholarshipHistoryModalOpen}
        onOpenChange={setScholarshipHistoryModalOpen}
        applicationNo={selectedScholarshipHistoryApplication?.applicationNo}
        studentName={selectedScholarshipHistoryApplication?.studentName}
      />
      <PrintDetailsModal
        open={printDetailsModalOpen}
        onOpenChange={setPrintDetailsModalOpen}
        data={selectedPrintApplication || undefined}
      />
    </div >
  );
};

export default ProcessPage;
