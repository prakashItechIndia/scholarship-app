import * as React from "react";
import {
  Tabs,
  TabsTrigger,
  Table,
  Pagination,
  Search,
  Select,
  Button,
  Card,
} from "@shared/components";
import { PageLayout } from "../../components/layout";
import {
  HomeRegular,
  DocumentAddRegular,
  PeopleRegular,
  PersonRegular,
  DataBarVerticalRegular,
  QuestionCircleRegular,
  SettingsRegular,
  SearchRegular,
  AlertRegular,
  FilterRegular,
  MoreVerticalRegular,
} from "@fluentui/react-icons";

interface ApplicationData {
  applicationNo: string;
  studentName: string;
  classStudying?: string;
  institutionName?: string;
  fatherAnnualIncome?: string;
  mobileNumber?: string;
  fatherOccupation?: string;
  documentType?: string;
  status?: string;
  uploadedDate?: string;
  verifiedBy?: string;
  verificationStatus?: string;
  verifiedDate?: string;
  [key: string]: unknown;
}

// Sample data for Overview tab
const overviewData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    classStudying: "BE Computer Science",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    classStudying: "BE IT",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
  },
  {
    applicationNo: "AF2510003",
    studentName: "Agathiyan",
    classStudying: "B.Tech",
    institutionName: "Sai Ram Institute of Te...",
    fatherAnnualIncome: "10001-20000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Private Sector",
  },
  {
    applicationNo: "AF2510004",
    studentName: "Viswamithran",
    classStudying: "12th",
    institutionName: "Sai Ram School",
    fatherAnnualIncome: "30001-40000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Chennai Corporation",
  },
  {
    applicationNo: "AF2510005",
    studentName: "Aravind",
    classStudying: "SSLC",
    institutionName: "Govt. School",
    fatherAnnualIncome: "20001-30000",
    mobileNumber: "91 12345 67890",
    fatherOccupation: "Self Employed",
  },
];

// Sample data for Documents tab
const documentsData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    documentType: "Aadhaar",
    status: "Verified",
    uploadedDate: "2024-01-15",
    verifiedBy: "Admin",
  },
  {
    applicationNo: "AF2510002",
    studentName: "Malathi",
    documentType: "PAN",
    status: "Pending",
    uploadedDate: "2024-01-16",
    verifiedBy: "-",
  },
];

// Sample data for Verify tab
const verifyData: ApplicationData[] = [
  {
    applicationNo: "AF2510001",
    studentName: "Kavipriya",
    verificationStatus: "Approved",
    verifiedDate: "2024-01-20",
    verifiedBy: "Admin",
  },
];

// Sample data for other tabs
const suggestData: ApplicationData[] = [];
const approveData: ApplicationData[] = [];
const issueAmountData: ApplicationData[] = [];

// Tab-based data mapping
const tabDataMap: Record<string, ApplicationData[]> = {
  overview: overviewData,
  documents: documentsData,
  verify: verifyData,
  suggest: suggestData,
  approve: approveData,
  "issue-amount": issueAmountData,
};

// Tab-based total items mapping
const tabTotalItemsMap: Record<string, number> = {
  overview: 123,
  documents: 45,
  verify: 30,
  suggest: 15,
  approve: 8,
  "issue-amount": 5,
};

const ProcessPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState("2024-2025");

  // Get current tab's total items
  const totalItems = tabTotalItemsMap[activeTab] || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Table columns configuration based on active tab
  const getColumnsForTab = (tab: string) => {
    const baseColumns = [
      {
        key: "checkbox",
        name: "",
        fieldName: "checkbox",
        minWidth: 40,
        maxWidth: 40,
        onRender: () => (
          <input
            type="checkbox"
            className="cursor-pointer w-4 h-4"
          />
        ),
      },
    ];

    switch (tab) {
      case "overview":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 120,
            isResizable: true,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "classStudying",
            name: "Class Studying",
            fieldName: "classStudying",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "institutionName",
            name: "Institution Name",
            fieldName: "institutionName",
            minWidth: 200,
            isResizable: true,
          },
          {
            key: "fatherAnnualIncome",
            name: "Father Annual Income",
            fieldName: "fatherAnnualIncome",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "mobileNumber",
            name: "Mobile Number",
            fieldName: "mobileNumber",
            minWidth: 130,
            isResizable: true,
          },
          {
            key: "fatherOccupation",
            name: "Father Occupation",
            fieldName: "fatherOccupation",
            minWidth: 150,
            isResizable: true,
          },
        ];

      case "documents":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 120,
            isResizable: true,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "documentType",
            name: "Document Type",
            fieldName: "documentType",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 120,
            isResizable: true,
          },
          {
            key: "uploadedDate",
            name: "Uploaded Date",
            fieldName: "uploadedDate",
            minWidth: 130,
            isResizable: true,
          },
          {
            key: "verifiedBy",
            name: "Verified By",
            fieldName: "verifiedBy",
            minWidth: 150,
            isResizable: true,
          },
        ];

      case "verify":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 120,
            isResizable: true,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "verificationStatus",
            name: "Verification Status",
            fieldName: "verificationStatus",
            minWidth: 150,
            isResizable: true,
          },
          {
            key: "verifiedDate",
            name: "Verified Date",
            fieldName: "verifiedDate",
            minWidth: 130,
            isResizable: true,
          },
          {
            key: "verifiedBy",
            name: "Verified By",
            fieldName: "verifiedBy",
            minWidth: 150,
            isResizable: true,
          },
        ];

      default:
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 120,
            isResizable: true,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 150,
            isResizable: true,
          },
        ];
    }
  };

  const columns = React.useMemo(() => getColumnsForTab(activeTab), [activeTab]);

  // Get current tab's data
  const currentTabData = React.useMemo(() => {
    return tabDataMap[activeTab] || [];
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

  const logo = (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-600 font-semibold text-xs">
      LM
    </div>
  );

  return (
    <PageLayout
      sideNav={{
        logo,
        expanded: false,
        items: [
          {
            icon: <HomeRegular />,
            label: "Home",
            active: false,
            onClick: () => console.log("Navigate to Home"),
          },
          {
            icon: <DocumentAddRegular />,
            label: "Process",
            active: true,
            onClick: () => console.log("Navigate to Process"),
          },
          {
            icon: <PeopleRegular />,
            label: "Roles",
            active: false,
            onClick: () => console.log("Navigate to Roles"),
          },
          {
            icon: <PersonRegular />,
            label: "Users",
            active: false,
            onClick: () => console.log("Navigate to Users"),
          },
          {
            icon: <DataBarVerticalRegular />,
            label: "Reports",
            active: false,
            onClick: () => console.log("Navigate to Reports"),
          },
        ],
        footerItems: [
          {
            icon: <QuestionCircleRegular />,
            label: "Help",
            active: false,
            onClick: () => console.log("Navigate to Help"),
          },
          {
            icon: <SettingsRegular />,
            label: "Settings",
            active: false,
            onClick: () => console.log("Navigate to Settings"),
          },
        ],
      }}
      topNav={{
        left: (
          <div className="flex items-center gap-3 pl-[72px]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
              LM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                LEO MUTHU Scholarship
              </span>
              <span className="text-xs text-gray-600">
                An Initiative of ARAM Foundation
              </span>
            </div>
          </div>
        ),
        right: (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Search clicked")}
              aria-label="Search"
            >
              <SearchRegular className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Notifications clicked")}
              aria-label="Notifications"
            >
              <AlertRegular className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="min-w-[140px]">
              <Select
                selectedKey={academicYear}
                onValueChange={setAcademicYear}
                options={[
                  { value: "2024-2025", label: "Academic year" },
                  { value: "2023-2024", label: "2023-2024" },
                  { value: "2022-2023", label: "2022-2023" },
                ]}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("User menu clicked")}
              className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              aria-label="User menu"
            >
              U
            </Button>
          </div>
        ),
      }}
    >
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-sm text-gray-600">
          High-Level View of Document Details and Progress
        </p>
      </div>

      {/* Tabs and Search Section */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px]">
          <Tabs
            value={activeTab}
            defaultValue="overview"
            onValueChange={setActiveTab}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="suggest">Suggest</TabsTrigger>
            <TabsTrigger value="approve">Approve</TabsTrigger>
            <TabsTrigger value="issue-amount">Issue Amount</TabsTrigger>
          </Tabs>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full max-w-[300px]">
            <Search
              searchPlaceHolder="Search"
              searchValue={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Filter clicked")}
              aria-label="Filter"
            >
              <FilterRegular className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("More options clicked")}
              aria-label="More options"
            >
              <MoreVerticalRegular className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={columns} data={paginatedData} />
        </div>

        {/* Pagination */}
        <div className="px-4 border-t border-gray-200">
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
    </PageLayout>
  );
};

export default ProcessPage;
