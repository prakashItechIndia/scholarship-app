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
  FilterRegular,
} from "@fluentui/react-icons";
import PDFViewerModal from "../../components/PDFViewerModal";
import ViewDocumentsDrawer from "../../components/ViewDocumentsDrawer";
import ApplicationDetailsView from "../../components/ApplicationDetailsView";
import { ApplicationData } from "./types";
import { useProcessTable } from "./hooks/useProcessTable";
import ProcessTabs from "./components/ProcessTabs";
import DocumentUploadPanel from "./components/DocumentUploadPanel";
import ProcessHistoryModal from "./components/ProcessHistoryModal";
import ScholarshipHistoryModal from "./components/ScholarshipHistoryModal";
import PrintDetailsModal from "./components/PrintDetailsModal";
import ApproveModal from "./components/ApproveModal";
import IssueAmountModal from "./components/IssueAmountModal";
import SuggestModal from "./components/SuggestModal";
import VerifyModal from "./components/VerifyModal";
import { processManagement, reports } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

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
    subtitle: "Input the amount you'd like to suggest",
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
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = React.useState("overview");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [applications, setApplications] = React.useState<ApplicationData[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selectedApplication, setSelectedApplication] = React.useState<ApplicationData | null>(null);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
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

  // Issue Amount Modal State
  const [issueAmountModalOpen, setIssueAmountModalOpen] = React.useState(false);
  const [selectedIssueAmountApplication, setSelectedIssueAmountApplication] = React.useState<ApplicationData | null>(null);

  // Approve Modal State
  const [approveModalOpen, setApproveModalOpen] = React.useState(false);
  const [selectedApproveApplication, setSelectedApproveApplication] = React.useState<ApplicationData | null>(null);

  // Suggest Modal State
  const [suggestModalOpen, setSuggestModalOpen] = React.useState(false);
  const [selectedSuggestApplication, setSelectedSuggestApplication] = React.useState<ApplicationData | null>(null);

  // Verify Modal State
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const [selectedVerifyApplication, setSelectedVerifyApplication] = React.useState<ApplicationData | null>(null);

  const [selectedDocument, setSelectedDocument] = React.useState<ApplicationData | null>(null);
  const [academicYear, setAcademicYear] = React.useState("All Years");
  const [academicYearId, setAcademicYearId] = React.useState<number | undefined>();
  const [academicYears, setAcademicYears] = React.useState<{ ScholarshipYear_Id?: string | number; ScholarshipYear_Code?: string; [key: string]: unknown }[]>([]);
  const [loadingAcademicYears, setLoadingAcademicYears] = React.useState(false);

  // Helper function to map API response to ApplicationData
  const mapApiResponseToApplicationData = (apiData: Record<string, unknown>): ApplicationData => {
    return {
      applicationNo: String(apiData.Application_Id || ''),
      studentName: String(apiData.Applicant_Name || ''),
      classStudying: String(apiData.Class_Studying || ''),
      institutionName: String(apiData.Institution_Name || ''),
      fatherAnnualIncome: String(apiData.Father_AnnualIncome || ''),
      mobileNumber: String(apiData.Mobile_Number || ''),
      fatherOccupation: String(apiData.Father_Occupation || ''),
      scholarshipNumber: String(apiData.Scholarship_No || '-'),
      status: String(apiData.Status || ''),
      scholarship: String(apiData.Scholarship_Id || ''),
      preparedBy: String(apiData.Prepared_By || '-'),
      verifiedBy: String(apiData.Verified_By || '-'),
      suggestedBy: String(apiData.Suggested_By || '-'),
      processActionLabel: activeTab === 'suggest' && apiData.SuggestText 
        ? String(apiData.SuggestText ?? '').trim() 
        : getProcessActionLabel(String(apiData.Status ?? ''), activeTab),
      suggestLinkEnable: Boolean(apiData.SuggestLinkEnable),
      lblSuggested: Boolean(apiData.lblSuggested),
      lblReject: Boolean(apiData.lblReject),
      lblCompleted: Boolean(apiData.lblCompleted),
      suggestScholarshipId: apiData.SuggestScholarshipId ? (typeof apiData.SuggestScholarshipId === 'number' ? apiData.SuggestScholarshipId : Number(apiData.SuggestScholarshipId)) : undefined,
      // Issue Amount fields
      requestAmount: apiData.RequestAmount || apiData.Request_Amount || 0,
      suggestedAmount: apiData.Scholarship_Suggest_Amount || 0,
      approvedAmount: apiData.Scholarship_Approved_Amount || 0,
      fatherName: String(apiData.Father_Name || ''),
      scholarshipSeekingFor: apiData.Scholarship_For === 'School' 
        ? String(apiData.Class_Studying || '')
        : apiData.Scholarship_For === 'College'
        ? `${String(apiData.Degree_Type || '')}-${String(apiData.Degree || '')}`
        : apiData.Scholarship_For === 'Research'
        ? String(apiData.Ph_D || '')
        : '',
      ...apiData,
    };
  };

  // Helper function to get process action label based on status and tab
  const getProcessActionLabel = (status: string, tab: string): string => {
    if (tab === 'overview') {
      if (status === 'Registered') return 'View';
      if (status === 'Waiting') return 'Approve';
      if (status === 'Approved') return 'Issue Amount';
      if (status === 'Completed') return 'View';
    }
    if (tab === 'documents') return 'Upload';
    if (tab === 'verify') return 'Verify';
    if (tab === 'suggest') return 'Suggest';
    if (tab === 'approve') {
      // For approve tab: show "Approve" for Waiting, show status text for Approved/Rejected
      if (status === 'Waiting') return 'Approve';
      if (status === 'Approved') return 'Approved';
      if (status === 'Rejected') return 'Rejected';
      return 'Approve';
    }
    if (tab === 'issue-amount') return 'Issue Amount';
    return 'View';
  };

  // Fetch applications based on active tab
  React.useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const params: Record<string, unknown> = {
          page: currentPage,
          pageSize: pageSize,
        };

        // Add search filters if provided
        if (searchQuery) {
          params.mainCategory = 'Name';
          params.key = searchQuery;
        }

        // Add academic year filter if selected (matching old app: intAcyearId != 0)
        if (academicYearId && academicYearId > 0) {
          params.academicYearId = academicYearId;
        }

        let response: { data: unknown[]; total: number; page: number; pageSize: number } | unknown[] = [];

        switch (activeTab) {
          case 'overview':
            response = await processManagement.getOverviewApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              selectedStatusText: undefined,
              fromDate: undefined,
              toDate: undefined,
            });
            break;
          case 'documents':
            response = await processManagement.getDocumentsApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'verify':
            response = await processManagement.getVerifyApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'suggest':
            response = await processManagement.getSuggestApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'approve':
            response = await processManagement.getApproveApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'issue-amount':
            response = await processManagement.getIssueAmountApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          default:
            response = { data: [], total: 0, page: 1, pageSize: 5 };
        }

        // Handle both old format (array) and new format (object with data, total, page, pageSize)
        if (Array.isArray(response)) {
          const mappedData = (response as Record<string, unknown>[]).map(mapApiResponseToApplicationData);
          setApplications(mappedData);
          setTotalItems(mappedData.length);
        } else {
          const apiResponse = response as { data: unknown[]; total: number; page: number; pageSize: number };
          const mappedData = (apiResponse.data as Record<string, unknown>[]).map(mapApiResponseToApplicationData);
          setApplications(mappedData);
          setTotalItems(apiResponse.total || 0);
        }
      } catch (err) {
        showError('Failed to Load Applications', err instanceof Error ? err.message : 'Failed to fetch applications');
        setApplications([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchApplications();
  }, [activeTab, searchQuery, academicYearId, currentPage, pageSize, showError]);

  // Fetch academic years on component mount
  React.useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        setLoadingAcademicYears(true);
        const years = await reports.getAcademicYears();
        setAcademicYears(Array.isArray(years) ? years : []);
      } catch (err) {
        showError('Failed to Load Academic Years', err instanceof Error ? err.message : 'Failed to fetch academic years');
        setAcademicYears([]);
      } finally {
        setLoadingAcademicYears(false);
      }
    };
    void fetchAcademicYears();
  }, [showError]);

  // Reset to page 1 when tab changes, search query changes, or academic year changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, academicYearId]);

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
    setSelectedPdfUrl(`https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/${item.applicationNo}.pdf`);
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

  // Handle process action
  const handleProcess = React.useCallback((item: ApplicationData) => {
    const actionLabel = item.processActionLabel;

    if (actionLabel === "Issue Amount") {
      setSelectedIssueAmountApplication(item);
      setIssueAmountModalOpen(true);
    } else if (actionLabel === "Approved") {
      // For "Approved" status, directly open the PDF
      setSelectedPdfUrl(`https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/${item.applicationNo}.pdf`);
      setSelectedPdfApplicationNo(item.applicationNo);
      setPdfViewerOpen(true);
    } else if (actionLabel === "Approve") {
      // For "Approve" action, open the approval modal
      setSelectedApproveApplication(item);
      setApproveModalOpen(true);
    } else if (actionLabel === "Suggest 1" || actionLabel === "Suggest 2" || actionLabel?.startsWith("Suggest")) {
      setSelectedSuggestApplication(item);
      setSuggestModalOpen(true);
    } else if (actionLabel === "Verified") {
      setSelectedVerifyApplication(item);
      setVerifyModalOpen(true);
    } else {
      console.log("Process action for:", item.applicationNo, item.processActionLabel);
    }
  }, []);

  // Refresh applications after modal actions
  const refreshApplications = React.useCallback(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const params: Record<string, unknown> = {
          page: currentPage,
          pageSize: pageSize,
        };

        // Add search filters if provided
        if (searchQuery) {
          params.mainCategory = 'Name';
          params.key = searchQuery;
        }

        // Add academic year filter if selected (matching old app: intAcyearId != 0)
        if (academicYearId && academicYearId > 0) {
          params.academicYearId = academicYearId;
        }

        let response: { data: unknown[]; total: number; page: number; pageSize: number } | unknown[] = [];

        switch (activeTab) {
          case 'overview':
            response = await processManagement.getOverviewApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              selectedStatusText: undefined,
              fromDate: undefined,
              toDate: undefined,
            });
            break;
          case 'documents':
            response = await processManagement.getDocumentsApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'verify':
            response = await processManagement.getVerifyApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'suggest':
            response = await processManagement.getSuggestApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'approve':
            response = await processManagement.getApproveApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          case 'issue-amount':
            response = await processManagement.getIssueAmountApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
            });
            break;
          default:
            response = { data: [], total: 0, page: 1, pageSize: 5 };
        }

        // Handle both old format (array) and new format (object with data, total, page, pageSize)
        if (Array.isArray(response)) {
          const mappedData = (response as Record<string, unknown>[]).map(mapApiResponseToApplicationData);
          setApplications(mappedData);
          setTotalItems(mappedData.length);
        } else {
          const apiResponse = response as { data: unknown[]; total: number; page: number; pageSize: number };
          const mappedData = (apiResponse.data as Record<string, unknown>[]).map(mapApiResponseToApplicationData);
          setApplications(mappedData);
          setTotalItems(apiResponse.total || 0);
        }
      } catch (err) {
        showError('Failed to Refresh', err instanceof Error ? err.message : 'Failed to refresh applications');
      } finally {
        setLoading(false);
      }
    };
    void fetchApplications();
  }, [activeTab, searchQuery, academicYearId, currentPage, pageSize, showError]);

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
    handleProcess,
  });

  // Data is already paginated from the server
  const paginatedData = applications;
  const totalPages = Math.ceil(totalItems / pageSize);

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
          justifyContent: "space-between",
          marginTop: "11px",
        }}>
          <div>
            <h1 style={{
              fontSize: "1rem",
              lineHeight: "1.375rem",
              fontWeight: 600,
              color: "#242424",

              // marginBottom: "0.5rem",
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
              <DropdownMenuItem
                onClick={() => {
                  setAcademicYear("All Years");
                  setAcademicYearId(undefined);
                }}
                style={{
                  fontWeight: academicYear === "All Years" ? "bold" : "normal",
                  color: academicYear === "All Years" ? "#242424" : "#616161",
                  backgroundColor: "transparent",
                }}
                className="!text-[#242424]"
              >
                All Years
              </DropdownMenuItem>
              {loadingAcademicYears ? (
                <DropdownMenuItem 
                  style={{ color: "#616161", backgroundColor: "transparent" }}
                  className="!text-[#616161]"
                >
                  Loading...
                </DropdownMenuItem>
              ) : (
                academicYears.map((yearData) => {
                  // API returns: { ScholarshipYear_Id: "16", ScholarshipYear_Code: "2025" }
                  const yearIdRaw = yearData.ScholarshipYear_Id;
                  const yearId = yearIdRaw ? (typeof yearIdRaw === 'string' ? parseInt(yearIdRaw, 10) : yearIdRaw) : undefined;
                  const yearLabel = yearData.ScholarshipYear_Code || (yearId ? String(yearId) : '');
                  const isSelected = academicYearId === yearId;
                  const keyValue = yearId ?? yearLabel;
                  
                  return (
                    <DropdownMenuItem
                      key={String(keyValue)}
                      onClick={() => {
                        setAcademicYear(yearLabel);
                        setAcademicYearId(yearId ?? undefined);
                      }}
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                        color: isSelected ? "#242424" : "#616161",
                        backgroundColor: "transparent",
                      }}
                      className={isSelected ? "!text-[#242424]" : "!text-[#616161]"}
                    >
                      {yearLabel}
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* Tabs and Search Section */}
      <div style={{
        backgroundColor: "#fafafa",

        borderBottom: "1px solid #e0e0e0", // Added border here as requested
        marginBottom: "0px",
        height: "2.75rem",
        width: "100%",
        flexShrink: 0,
        paddingTop: "13px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          // padding: "1px 24px",
          height: "100%", // Fill the 44px height
        }}>
          {/* Tabs on the left */}
          <ProcessTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Search and Actions on the right */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            paddingRight: "24px",
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

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="outline"
                  aria-label="Filter"
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
                  <FilterRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => console.log("Application No clicked")}>
                  Application No
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Aadhaar ID clicked")}>
                  Aadhaar ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Mobile No clicked")}>
                  Mobile No
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Name clicked")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Student ID clicked")}>
                  Student ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

      {/* Table Section - Scrollable */}
      <div
        id="table-scroll-container"
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
          overflow: "auto",
          backgroundColor: "#fafafa",
          minHeight: 0,
          maxHeight: "100%",
        }}
        className="custom-scrollbar"
        onScroll={(e) => {
          // Sync horizontal scroll with footer scrollbar
          const footerScroll = document.getElementById('footer-scroll-sync');
          if (footerScroll) {
            footerScroll.scrollLeft = e.currentTarget.scrollLeft;
          }
        }}
      >
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
            .footer-scrollbar::-webkit-scrollbar {
              height: 8px;
            }
            .footer-scrollbar::-webkit-scrollbar-track {
              background: #f5f5f5;
            }
            .footer-scrollbar::-webkit-scrollbar-thumb {
              background-color: #d1d1d1;
              border-radius: 4px;
            }
            .footer-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #a8a8a8;
            }
          `}
        </style>

        <div style={{ minWidth: "fit-content" }}>
          <Table
            columns={columns}
            data={paginatedData}
            disableScroll={true}
          />
        </div>
      </div>

      {/* Static Footer with Pagination and Horizontal Scrollbar */}
      <div style={{
        flexShrink: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
      }}>
        {/* Pagination */}
        <div style={{
          padding: "12px 24px",
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
            className="w-full !flex-row"
          />
        </div>

        {/* Horizontal Scrollbar Sync */}
        <div
          id="footer-scroll-sync"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            height: "12px",
          }}
          className="footer-scrollbar"
          onScroll={(e) => {
            // Sync scroll with table container
            const tableContainer = document.getElementById('table-scroll-container');
            if (tableContainer) {
              tableContainer.scrollLeft = e.currentTarget.scrollLeft;
            }
          }}
        >
          <div style={{
            height: "1px",
            width: "fit-content",
            minWidth: "100%",
          }}
            ref={(el) => {
              // Match the width of the table content
              if (el) {
                const tableContainer = document.getElementById('table-scroll-container');
                if (tableContainer && tableContainer.firstChild) {
                  const tableWidth = (tableContainer.firstChild as HTMLElement).scrollWidth;
                  el.style.width = `${tableWidth}px`;
                }
              }
            }}
          />
        </div>
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
        onClose={() => {
          setUploadPanelOpen(false);
          void refreshApplications(); // Refresh the applications list after closing
        }}
        data={selectedUploadApplication}
        onUploadComplete={refreshApplications}
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

      <VerifyModal
        open={verifyModalOpen}
        onOpenChange={setVerifyModalOpen}
        data={selectedVerifyApplication}
        onPreviousScholarshipHistory={() => {
          // Open scholarship history modal when button is clicked
          if (selectedVerifyApplication) {
            setSelectedScholarshipHistoryApplication(selectedVerifyApplication);
            setScholarshipHistoryModalOpen(true);
          }
        }}
      />

      <SuggestModal
        open={suggestModalOpen}
        onOpenChange={setSuggestModalOpen}
        data={selectedSuggestApplication}
        onSuggestSuccess={(applicationNo) => {
          // Open PDF viewer with the suggested application's PDF
          setSelectedPdfUrl(`https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/${applicationNo}.pdf`);
          setSelectedPdfApplicationNo(applicationNo);
          setPdfViewerOpen(true);
        }}
      />

      <ApproveModal
        open={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        data={selectedApproveApplication}
        onApproveSuccess={(applicationNo) => {
          // Open PDF viewer with the approved application's PDF
          setSelectedPdfUrl(`https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/${applicationNo}.pdf`);
          setSelectedPdfApplicationNo(applicationNo);
          setPdfViewerOpen(true);
        }}
      />

      <IssueAmountModal
        open={issueAmountModalOpen}
        onOpenChange={setIssueAmountModalOpen}
        data={selectedIssueAmountApplication}
        onIssueSuccess={refreshApplications}
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
