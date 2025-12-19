import * as React from "react";
import {
  SideNav,
  SideNavItem,
  TopNav,
  Tabs,
  TabsTrigger,
  Table,
  Pagination,
  Search,
  Select,
} from "@shared/components";
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
  classStudying: string;
  institutionName: string;
  fatherAnnualIncome: string;
  mobileNumber: string;
  fatherOccupation: string;
}

// Sample data matching the image
const sampleData: ApplicationData[] = [
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

const ProcessPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState("2024-2025");

  const totalItems = 123; // Total items from pagination
  const totalPages = Math.ceil(totalItems / pageSize);

  // Table columns configuration
  const columns = [
    {
      key: "checkbox",
      name: "",
      fieldName: "checkbox",
      minWidth: 40,
      maxWidth: 40,
      onRender: () => (
        <input
          type="checkbox"
          className="cursor-pointer"
          style={{ width: "16px", height: "16px" }}
        />
      ),
    },
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

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return sampleData;
    const query = searchQuery.toLowerCase();
    return sampleData.filter(
      (item) =>
        item.applicationNo.toLowerCase().includes(query) ||
        item.studentName.toLowerCase().includes(query) ||
        item.classStudying.toLowerCase().includes(query) ||
        item.institutionName.toLowerCase().includes(query) ||
        item.mobileNumber.includes(query)
    );
  }, [searchQuery]);

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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9fafb", width: "100%" }}>
      {/* Top Navigation - Starts from left edge (x=0) */}
      <TopNav
          left={
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "72px", marginLeft: 0 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(to bottom right, #3b82f6, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                LM
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                  LEO MUTHU Scholarship
                </span>
                <span style={{ fontSize: "12px", color: "#4b5563" }}>
                  An Initiative of ARAM Foundation
                </span>
              </div>
            </div>
          }
          right={
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label="Search"
              >
                <SearchRegular style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label="Notifications"
              >
                <AlertRegular style={{ width: "20px", height: "20px" }} />
              </button>
              <div style={{ minWidth: "140px" }}>
                <Select
                  value={academicYear}
                  onValueChange={setAcademicYear}
                  options={[
                    { value: "2024-2025", label: "Academic year" },
                    { value: "2023-2024", label: "2023-2024" },
                    { value: "2022-2023", label: "2022-2023" },
                  ]}
                />
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                aria-label="User menu"
              >
                U
              </button>
            </div>
          }
        />

      {/* Side Navigation - Overlays on top of TopNav */}
      <SideNav
        logo={logo}
        expanded={false}
        footer={
          <>
            <SideNavItem
              icon={<QuestionCircleRegular />}
              label="Help"
              active={false}
              onClick={() => console.log("Navigate to Help")}
            />
            <SideNavItem
              icon={<SettingsRegular />}
              label="Settings"
              active={false}
              onClick={() => console.log("Navigate to Settings")}
            />
          </>
        }
      >
        <SideNavItem
          icon={<HomeRegular />}
          label="Home"
          active={false}
          onClick={() => console.log("Navigate to Home")}
        />
        <SideNavItem
          icon={<DocumentAddRegular />}
          label="Process"
          active={true}
          onClick={() => console.log("Navigate to Process")}
        />
        <SideNavItem
          icon={<PeopleRegular />}
          label="Roles"
          active={false}
          onClick={() => console.log("Navigate to Roles")}
        />
        <SideNavItem
          icon={<PersonRegular />}
          label="Users"
          active={false}
          onClick={() => console.log("Navigate to Users")}
        />
        <SideNavItem
          icon={<DataBarVerticalRegular />}
          label="Reports"
          active={false}
          onClick={() => console.log("Navigate to Reports")}
        />
      </SideNav>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%", marginLeft: "56px" }}>
        {/* Page Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {/* Title Section */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
              Overview
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              High-Level View of Document Details and Progress
            </p>
          </div>

          {/* Tabs and Search Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "400px" }}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="verify">Verify</TabsTrigger>
                <TabsTrigger value="suggest">Suggest</TabsTrigger>
                <TabsTrigger value="approve">Approve</TabsTrigger>
                <TabsTrigger value="issue-amount">Issue Amount</TabsTrigger>
              </Tabs>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <Search
                  searchPlaceHolder="Search"
                  searchValue={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#4b5563",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  aria-label="Filter"
                >
                  <FilterRegular style={{ width: "20px", height: "20px" }} />
                </button>
                <button
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#4b5563",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  aria-label="More options"
                >
                  <MoreVerticalRegular style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={paginatedData}
                className="w-full"
              />
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessPage;

