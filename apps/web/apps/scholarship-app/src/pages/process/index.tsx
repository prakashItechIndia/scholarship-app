import * as React from "react";
import {
  Table,
  Pagination,
  Search,
  Button,
  Card,
  Modal,
} from "@shared/components";
import {
  MoreVerticalRegular,
} from "@fluentui/react-icons";
import PDFViewerModal from "../../components/PDFViewerModal";
import ViewDocumentsDrawer from "../../components/ViewDocumentsDrawer";
import ApplicationDetailsView from "../../components/ApplicationDetailsView";
import { ApplicationData } from "./types";
import { tabDataMap, tabTotalItemsMap } from "./constants";
import { useProcessTable } from "./hooks/useProcessTable";
import ProcessTabs from "./components/ProcessTabs";
import ProcessFilters from "./components/ProcessFilters";

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
  const [selectedDocument, setSelectedDocument] = React.useState<ApplicationData | null>(null);

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
    setSelectedPdfUrl(item.pdfUrl);
    setSelectedPdfApplicationNo(item.applicationNo);
    setPdfViewerOpen(true);
  }, []);

  // Handle document viewer action (for documents tab) - opens drawer with document list
  const handleViewDocument = React.useCallback((item: ApplicationData) => {
    setSelectedDocument(item);
    setViewDocumentsDrawerOpen(true);
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
      backgroundColor: "#fafafa",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
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
          Overview
        </h1>
        <p style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          High-Level View of Document Details and Progress
        </p>
      </div>

      {/* Tabs and Search Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        gap: "16px",
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
          <div style={{ width: "300px" }}>
            <Search
              searchPlaceHolder="Search"
              searchValue={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <ProcessFilters 
            open={filterPopoverOpen} 
            onOpenChange={setFilterPopoverOpen} 
          />
          <Button
            variant="ghost"
            onClick={() => console.log("More options clicked")}
            aria-label="More options"
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
            }}
          >
            <MoreVerticalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card variant="elevated" style={{
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
      }}>
        <div style={{ overflowX: "auto" }}>
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

      {/* View Modal with Application Details */}
      <Modal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Application Details"
        size={"lg" as const}
        footer={
          <>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="default" onClick={() => {
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
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
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
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
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
        title="Application Document Viewer"
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
    </div>
  );
};

export default ProcessPage;
