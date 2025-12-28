import * as React from "react";
import {
  Table,
  TableSkeleton,
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
  ArrowDownloadRegular,
  DocumentRegular as DocumentIcon,
} from "@fluentui/react-icons";
import PDFViewerModal from "../../components/PDFViewerModal";
import ViewDocumentsDrawer from "../../components/ViewDocumentsDrawer";
import ApplicationDetailsView from "../../components/ApplicationDetailsView";
import { ApplicationData } from "./types";
import { useProcessTable } from "./hooks/useProcessTable";
import ProcessTabs from "./components/ProcessTabs";
import DocumentUploadPanel from "./components/DocumentUploadPanel";
import { usePermissions } from "@/contexts/PermissionContext";
import { getScreenNameFromTab } from "./utils/tabPermissions";
import ProcessHistoryModal from "./components/ProcessHistoryModal";
import ScholarshipHistoryModal from "./components/ScholarshipHistoryModal";
import PrintDetailsModal from "./components/PrintDetailsModal";
import ApproveModal from "./components/ApproveModal";
import IssueAmountModal from "./components/IssueAmountModal";
import SuggestModal from "./components/SuggestModal";
import VerifyModal from "./components/VerifyModal";
import { processManagement, reports } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";
import { tabLabels } from "./constants";

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
    subtitle: "Review and Confirm the Requested Funds",
  },
  "issue-amount": {
    title: "Issue Amount",
    subtitle: "Review and Confirm the Issue Amount",
  },
};

type SortOrder = 'asc' | 'desc';
type SortField = string | null;

const ProcessPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [activeTab, setActiveTab] = React.useState("overview");

  // Check if user is Administrator - they have full access
  const isAdministrator = React.useMemo(() => {
    try {
      const authData = localStorage.getItem('scholarship_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.userType === 'Administrator';
      }
    } catch {
      // Ignore errors
    }
    return false;
  }, []);

  // Handle tab change with permission check
  const handleTabChange = React.useCallback((tab: string) => {
    // Administrators can access all tabs
    if (isAdministrator) {
      setActiveTab(tab);
      return;
    }

    // If permissions are loading, allow tab change (will be validated once loaded)
    if (permissionsLoading || !permissions || !permissions.screens) {
      setActiveTab(tab);
      return;
    }

    // Check if user has permission for this tab
    const screenName = getScreenNameFromTab(tab);
    if (!screenName) {
      // If no mapping exists, allow the tab (for backward compatibility)
      setActiveTab(tab);
      return;
    }

    const hasPermission = permissions.screens.some(
      (screen) => screen.screenName === screenName && screen.isActive
    );

    if (hasPermission) {
      setActiveTab(tab);
    } else {
      showError('Access Denied', 'You do not have permission to access this tab.');
    }
  }, [permissions, permissionsLoading, isAdministrator, showError]);

  // Validate current active tab when permissions load
  React.useEffect(() => {
    if (permissionsLoading || isAdministrator) {
      return;
    }

    if (!permissions || !permissions.screens) {
      return;
    }

    const screenName = getScreenNameFromTab(activeTab);
    if (!screenName) {
      return;
    }

    const hasPermission = permissions.screens.some(
      (screen) => screen.screenName === screenName && screen.isActive
    );

    // If user doesn't have permission for current tab, switch to first allowed tab
    if (!hasPermission) {
      const allowedScreenNames = permissions.screens
        .filter((screen) => screen.isActive)
        .map((screen) => screen.screenName);

      // Find first allowed tab
      const firstAllowedTab = tabLabels.find((tab) => {
        const tabScreenName = getScreenNameFromTab(tab.value);
        return tabScreenName && allowedScreenNames.includes(tabScreenName);
      });

      if (firstAllowedTab) {
        setActiveTab(firstAllowedTab.value);
      }
    }
  }, [permissions, permissionsLoading, activeTab, isAdministrator]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10); // Default 10 records per page (BRD requirement)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState("Application No"); // Default search category
  const [sortField, setSortField] = React.useState<SortField>("Application_Id"); // Default sort by Application No (BRD OVW-001)
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc"); // Default descending (BRD OVW-001)
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
  const [academicYear, setAcademicYear] = React.useState("Academic Year");
  const [academicYearId, setAcademicYearId] = React.useState<number | undefined>();
  const [academicYears, setAcademicYears] = React.useState<{ ScholarshipYear_Id?: string | number; ScholarshipYear_Code?: string; [key: string]: unknown }[]>([]);
  const [loadingAcademicYears, setLoadingAcademicYears] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

  // Helper function to map API response to ApplicationData
  const mapApiResponseToApplicationData = (apiData: Record<string, unknown>): ApplicationData => {
    // For verify tab, change "Verify" status to "Document Submitted"
    let status = String(apiData.Status || '');
    if (activeTab === 'verify' && status === 'Verify') {
      status = 'Documents Submitted';
    }
    // For suggest tab, change "Registered" status to "Verified"
    if (activeTab === 'suggest' && status === 'Registered') {
      status = 'Verified';
    }
    
    return {
      applicationNo: String(apiData.Application_Id || ''),
      studentName: String(apiData.Applicant_Name || ''),
      classStudying: String(apiData.Class_Studying || ''),
      institutionName: String(apiData.Institution_Name || ''),
      fatherAnnualIncome: String(apiData.Father_AnnualIncome || ''),
      mobileNumber: String(apiData.Mobile_Number || ''),
      fatherOccupation: String(apiData.Father_Occupation || ''),
      scholarshipNumber: String(apiData.Scholarship_No || '-'),
      status: status,
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
          params.mainCategory = searchCategory;
          params.key = searchQuery;
        }

        // Add academic year filter if selected (matching old app: intAcyearId != 0)
        if (academicYearId && academicYearId > 0) {
          params.academicYearId = academicYearId;
        }

        // Add sorting parameters (BRD OVW-001, OVW-002) - API handles sorting
        if (sortField && sortOrder) {
          params.sortField = sortField;
          params.sortOrder = sortOrder;
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
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
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
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'verify':
            response = await processManagement.getVerifyApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'suggest':
            response = await processManagement.getSuggestApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'approve':
            response = await processManagement.getApproveApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'issue-amount':
            response = await processManagement.getIssueAmountApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          default:
            response = { data: [], total: 0, page: 1, pageSize: 5 };
        }

        // Handle both old format (array) and new format (object with data, total, page, pageSize)
        // API handles sorting, pagination, and search - no client-side processing needed
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
  }, [activeTab, searchQuery, academicYearId, currentPage, pageSize, sortField, sortOrder, showError]);

  // Fetch academic years on component mount
  React.useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        setLoadingAcademicYears(true);
        const years = await reports.getAcademicYears();
        const yearsArray = Array.isArray(years) ? years : [];
        setAcademicYears(yearsArray);
        // Auto-select the first academic year if none is selected
        if (yearsArray.length > 0 && !academicYearId) {
          const firstYear = yearsArray[0];
          const yearIdRaw = firstYear.ScholarshipYear_Id;
          const yearId = yearIdRaw ? (typeof yearIdRaw === 'string' ? parseInt(yearIdRaw, 10) : yearIdRaw) : undefined;
          const yearLabel = firstYear.ScholarshipYear_Code || (yearId ? String(yearId) : '');
          if (yearId && yearLabel) {
            setAcademicYear(yearLabel);
            setAcademicYearId(yearId);
          }
        }
      } catch (err) {
        showError('Failed to Load Academic Years', err instanceof Error ? err.message : 'Failed to fetch academic years');
        setAcademicYears([]);
      } finally {
        setLoadingAcademicYears(false);
      }
    };
    void fetchAcademicYears();
  }, [showError]);

  // Reset to page 1 when tab changes, search query changes, academic year changes, or pageSize changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, searchCategory, academicYearId, pageSize]);

  // Reset sort to default (Application No descending) when tab changes (BRD OVW-001)
  React.useEffect(() => {
    setSortField("Application_Id");
    setSortOrder("desc");
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

  // Handle viewing scholarship issued PDF (merged with uploaded document)
  const handleViewScholarshipPDF = React.useCallback(async (item: ApplicationData) => {
    try {
      // Call API to generate/merge PDF with:
      // - Upper section: Template with scholarship data (dynamically filled)
      // - Middle section: Uploaded document (cheque, etc.)
      // - Lower section: Template with scholarship data (dynamically filled)
      const scholarshipId = item.scholarshipNumber || item.scholarship;
      if (!scholarshipId || scholarshipId === '-') {
        showError('Error', 'Scholarship ID not found');
        return;
      }

      // Call API to get merged PDF
      const mergedPdfUrl = await processManagement.getMergedScholarshipPDF({
        applicationId: item.applicationNo,
        scholarshipId: String(scholarshipId),
      });
      
      setSelectedPdfUrl(mergedPdfUrl);
      setSelectedPdfApplicationNo(item.applicationNo);
      setPdfViewerOpen(true);
    } catch (err) {
      // Fallback to existing PDF if merge fails
      const fallbackUrl = `https://scholarship.leomuthu.com/Registered_Pdf_ScholerShip/${item.applicationNo}.pdf`;
      setSelectedPdfUrl(fallbackUrl);
      setSelectedPdfApplicationNo(item.applicationNo);
      setPdfViewerOpen(true);
      console.warn('Failed to load merged PDF, using fallback:', err);
    }
  }, [showError]);

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
          params.mainCategory = searchCategory;
          params.key = searchQuery;
        }

        // Add academic year filter if selected (matching old app: intAcyearId != 0)
        if (academicYearId && academicYearId > 0) {
          params.academicYearId = academicYearId;
        }

        // Add sorting parameters (BRD OVW-001, OVW-002) - API handles sorting
        if (sortField && sortOrder) {
          params.sortField = sortField;
          params.sortOrder = sortOrder;
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
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
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
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'verify':
            response = await processManagement.getVerifyApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'suggest':
            response = await processManagement.getSuggestApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'approve':
            response = await processManagement.getApproveApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          case 'issue-amount':
            response = await processManagement.getIssueAmountApplications({
              mainCategory: params.mainCategory as string | undefined,
              key: params.key as string | undefined,
              academicYearId: params.academicYearId as number | undefined,
              page: params.page as number,
              pageSize: params.pageSize as number,
              sortField: params.sortField as string | undefined,
              sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            });
            break;
          default:
            response = { data: [], total: 0, page: 1, pageSize: 5 };
        }

        // Handle both old format (array) and new format (object with data, total, page, pageSize)
        // API handles sorting, pagination, and search - no client-side processing needed
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
  }, [activeTab, searchQuery, searchCategory, academicYearId, currentPage, pageSize, sortField, sortOrder, showError]);

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

  // Handle sort change
  const handleSort = React.useCallback((field: string) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field - start with descending to match default behavior
      // This ensures first click applies sorting without incorrect icon behavior
      setSortField(field);
      setSortOrder('desc');
    }
    // Reset to page 1 when sort changes
    setCurrentPage(1);
  }, [sortField, sortOrder]);

  // Handle row selection
  const handleRowSelect = React.useCallback((item: ApplicationData, selected: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(item.applicationNo);
      } else {
        newSet.delete(item.applicationNo);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = React.useCallback((selected: boolean) => {
    if (selected) {
      const allIds = applications.map(app => app.applicationNo);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  }, [applications]);

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
    handleViewScholarshipPDF,
    handleProcess,
    sortField,
    sortOrder,
    onSort: handleSort,
    selectedRows,
    onRowSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    data: applications,
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
              fontSize: "16px",
              lineHeight: "22px",
              fontWeight: 600,
              color: "#242424",

              // marginBottom: "0.5rem",
              fontFamily: "'Inter', sans-serif",
            }}>
              {tabHeaderInfo[activeTab]?.title || "Overview"}
            </h1>
            <p style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 400,
              color: "#242424",
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
                  borderRadius: "6px",

                  backgroundColor: "#fff",
                }}
                iconPosition="after"
                icon={<ChevronDownRegular />}
              >
                {academicYear}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem
                onClick={() => {
                  setAcademicYear("Academic Year");
                  setAcademicYearId(undefined);
                }}
                style={{
                  fontWeight: academicYear === "Academic Year" ? "semi-bold" : "normal",
                  color: academicYear === "Academic Year" ? "#242424" : "#616161",
                  backgroundColor: "#FFFFFF",
                  // border: "1px solid #D1D1D1",

                }}
                className="!text-[#242424]"
              >
                Academic Year
              </DropdownMenuItem> */}
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
        backgroundColor: "#FAFAFA",

        marginBottom: "0px",
        height: "2.75rem",
        width: "100%",
        flexShrink: 0,
        paddingTop: "13px",
        marginTop: "-12px",
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
          <ProcessTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Search and Actions on the right */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            paddingRight: "24px",
            flexShrink: 0,
          }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center",border:"1px solid #D1D1D1",borderRadius:"8px" }}>
              <SearchRegular style={{ 
                position: "absolute", 
                left: "8px", 
                width: "16px", 
                height: "16px", 
                color: "#616161",
                pointerEvents: "none"
              }} />
              <input
                id='search'
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Pagination will reset automatically via useEffect
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Search is already handled by onChange, but we can prevent default
                    e.preventDefault();
                  }
                }}
                style={{
                  width: "200px",
                  height: "32px",
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  border: "1px solid ##FFFFFF00",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  backgroundColor: "#fff",
                }}
              />
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
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Application No")}
                  style={{
                    fontWeight: searchCategory === "Application No" ? "bold" : "normal",
                    color: searchCategory === "Application No" ? "#242424" : "#616161",
                  }}
                >
                  Application No
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Aadhaar ID")}
                  style={{
                    fontWeight: searchCategory === "Aadhaar ID" ? "bold" : "normal",
                    color: searchCategory === "Aadhaar ID" ? "#242424" : "#616161",
                  }}
                >
                  Aadhaar ID
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Mobile No")}
                  style={{
                    fontWeight: searchCategory === "Mobile No" ? "bold" : "normal",
                    color: searchCategory === "Mobile No" ? "#242424" : "#616161",
                  }}
                >
                  Mobile No
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Name")}
                  style={{
                    fontWeight: searchCategory === "Name" ? "bold" : "normal",
                    color: searchCategory === "Name" ? "#242424" : "#616161",
                  }}
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Student Id")}
                  style={{
                    fontWeight: searchCategory === "Student Id" ? "bold" : "normal",
                    color: searchCategory === "Student Id" ? "#242424" : "#616161",
                  }}
                >
                  Student ID
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Status")}
                  style={{
                    fontWeight: searchCategory === "Status" ? "bold" : "normal",
                    color: searchCategory === "Status" ? "#242424" : "#616161",
                  }}
                >
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSearchCategory("Class Studying")}
                  style={{
                    fontWeight: searchCategory === "Class Studying" ? "bold" : "normal",
                    color: searchCategory === "Class Studying" ? "#242424" : "#616161",
                  }}
                >
                  Class / Standard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="outline"
                  aria-label="Download"
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
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={async () => {
                    // Export to Excel
                    try {
                      // For now, we'll create a simple CSV export
                      // In production, this should call an API endpoint
                      const headers = columns.filter(col => col.key !== 'checkbox' && col.key !== 'actions').map(col => col.name || col.key);
                      const rows = applications.map(app => 
                        columns
                          .filter(col => col.key !== 'checkbox' && col.key !== 'actions')
                          .map(col => {
                            const value = (app as Record<string, unknown>)[col.key];
                            return value ? String(value) : '';
                          })
                      );
                      
                      const csvContent = [
                        headers.join(','),
                        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = `process_export_${new Date().toISOString().split('T')[0]}.csv`;
                      link.click();
                      URL.revokeObjectURL(link.href);
                      success('Export Successful', 'Data exported to Excel successfully');
                    } catch (err) {
                      showError('Export Failed', err instanceof Error ? err.message : 'Failed to export data');
                    }
                  }}
                  style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DocumentIcon style={{ width: "16px", height: "16px" }} />
                    Excel
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={async () => {
                    // Export to Word
                    try {
                      // For now, we'll create a simple text export
                      // In production, this should call an API endpoint to generate Word document
                      const headers = columns.filter(col => col.key !== 'checkbox' && col.key !== 'actions').map(col => col.name || col.key);
                      const rows = applications.map(app => 
                        columns
                          .filter(col => col.key !== 'checkbox' && col.key !== 'actions')
                          .map(col => {
                            const value = (app as Record<string, unknown>)[col.key];
                            return value ? String(value) : '';
                          })
                      );
                      
                      let wordContent = headers.join('\t') + '\n';
                      rows.forEach(row => {
                        wordContent += row.join('\t') + '\n';
                      });
                      
                      const blob = new Blob([wordContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = `process_export_${new Date().toISOString().split('T')[0]}.doc`;
                      link.click();
                      URL.revokeObjectURL(link.href);
                      success('Export Successful', 'Data exported to Word successfully');
                    } catch (err) {
                      showError('Export Failed', err instanceof Error ? err.message : 'Failed to export data');
                    }
                  }}
                  style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DocumentIcon style={{ width: "16px", height: "16px" }} />
                    Word
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Table
              columns={columns}
              data={paginatedData}
              disableScroll={true}
              onRowClick={(item) => {
                if (activeTab === 'verify') {
                  setSelectedVerifyApplication(item);
                  setVerifyModalOpen(true);
                }
              }}
            />
          )}
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
          backgroundColor: "#FAFAFA",
        }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              // Reset to page 1 when page size changes (already handled by useEffect)
            }}
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
