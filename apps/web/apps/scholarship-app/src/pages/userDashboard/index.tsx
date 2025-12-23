import { useNavigate } from "react-router-dom";
import { Button, Card, DocumentIcon, MoreIcon, ReopenIcon, PrintIcon, FilterIcon } from "@shared/components";
import {
  AddRegular,
} from "@fluentui/react-icons";
import { WelcomeBanner } from "../../components/common";
import React from "react";

interface ApplicationCardData {
  applicationNo: string;
  status: "Registered" | "Completed" | "Pending" | "Rejected";
  studentName: string;
  studied: string;
  fatherName: string;
  applied: string;
  scholarshipNumber?: string;
  mobileNo: string;
  preparedBy?: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const isCompleted = status === "Completed";
  const isRegistered = status === "Registered";

  // Based on image: blue for Registered, green for Completed
  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "10000px", // Pill shape
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    backgroundColor: isCompleted ? "#f1faf1" : isRegistered ? "#ebf3fc" : "#f5f5f5",
    color: isCompleted ? "#0e700e" : isRegistered ? "#115ea3" : "#424242",
    border: `1px solid ${isCompleted ? "#9fd89f" : isRegistered ? "#b4d6fa" : "#d1d1d1"}`,
  };

  return <span style={badgeStyle}>{status}</span>;
};

const ApplicationCard: React.FC<{ data: ApplicationCardData }> = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReopen = () => {
    console.log("Reopen application:", data.applicationNo);
    setIsDropdownOpen(false);
  };

  const handlePrint = () => {
    console.log("Print document:", data.applicationNo);
    setIsDropdownOpen(false);
  };

  return (
    <Card
      variant="outline"
      style={{
        padding: 0,
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        position: "relative",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        height: "100%",
        overflow: "hidden",
        gap: 0,
      }}
    >
      {/* Top Section - 50% height with background color */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAFAFA",
          padding: "20px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          height: "85%",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {/* Header with Application No, Status, and Icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DocumentIcon
              width={16}
              height={16}
              style={{
                color: "#616161",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Application No.
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "24px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {data.applicationNo}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
            <StatusBadge status={data.status} />
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={handleToggleDropdown}
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  marginRight: "-5px",
                }}
                aria-label="Options"
              >
                <MoreIcon
                  width={26}
                  height={26}
                  style={{border: "1px solid #e0e0e0", backgroundColor: '#ffffff',borderRadius: '20%'}}
                />
              </button>
              
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    minWidth: "200px",
                    padding: "4px",
                  }}
                >
                  <button
                    onClick={handleReopen}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#242424",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <ReopenIcon width={16} height={16} />
                    <span style={{ whiteSpace: "nowrap" }}>Reopen application</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#242424",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <PrintIcon width={16} height={16} />
                    <span>Print Document</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - 50% height */}
      <div
        style={{
          padding: "20px",
          paddingTop: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* Application Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* First Row - 3 items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            <DetailRow label="Student Name" value={data.studentName} />
            <DetailRow label="Studied" value={data.studied} />
            <DetailRow label="Father Name" value={data.fatherName} />
          </div>
          {/* Second Row - 3 items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            <DetailRow label="Applied" value={data.applied} />
            <DetailRow
              label="Scholarship Number"
              value={data.scholarshipNumber || "-"}
            />
            <DetailRow label="Mobile No." value={data.mobileNo} />
          </div>
          {/* Third Row - 1 item */}
          <div>
            <DetailRow label="Prepared By" value={data.preparedBy || "-"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: 500,
          color: "#707070",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - replace with actual data from API
  const userName = "Saravanan";
  const applications: ApplicationCardData[] = [
    {
      applicationNo: "AF2510001",
      status: "Registered",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "01/06/2025",
      scholarshipNumber: "",
      mobileNo: "91 9876543210",
      preparedBy: "",
    },
    {
      applicationNo: "AF25100025",
      status: "Completed",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "25/01/2025",
      scholarshipNumber: "25LMSS1009",
      mobileNo: "91 9876543210",
      preparedBy: "Admin",
    },
    {
      applicationNo: "AF2510001",
      status: "Registered",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "01/06/2025",
      scholarshipNumber: "",
      mobileNo: "91 9876543210",
      preparedBy: "",
    },
    {
      applicationNo: "AF25100025",
      status: "Completed",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "25/01/2025",
      scholarshipNumber: "25LMSS1009",
      mobileNo: "91 9876543210",
      preparedBy: "Admin",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fafafa",
        // padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Welcome Section */}
      <WelcomeBanner userName={userName} />

      {/* Application Status Section */}
      <div style={{  }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div style={{ paddingBottom: "18px" }}>
            <h2
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                fontWeight: 600,
                color: "#242424",
                marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
                paddingLeft: "24px",
                
              }}
            >
              Your Application Status
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
                paddingLeft: "24px",
              }}
            >
              Track the progress of your submitted application
            </p>
          </div>
          <div className="flex items-center gap-1 mt-4 md:mt-0 px-6 md:px-0 md:mr-0 mb-6 md:mb-0">
            <Button
              variant="default"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                backgroundColor: "#2453C3",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "0",
              }}
              onClick={() => navigate("/registration")}
            >
              <AddRegular style={{ width: "18px", height: "18px" }} />
              Create New Application
            </Button>
            <Button
              variant="ghost"
              style={{
                width: "36px",
                height: "36px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                marginLeft: "0",
              }}
              onClick={() => console.log("More options")}
              aria-label="More options"
            >
              <FilterIcon
                width={32}
                height={32}
                style={{ marginLeft: "13px" }}
              />
            </Button>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[18px] px-6">
          {applications.map((app) => (
            <ApplicationCard key={app.applicationNo} data={app} />
          ))}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default UserDashboard;

