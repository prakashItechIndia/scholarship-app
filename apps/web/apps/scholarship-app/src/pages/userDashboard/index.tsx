import { useNavigate } from "react-router-dom";
import { Button, Card, CardSkeleton, DocumentIcon, MoreIcon, ReopenIcon, PrintIcon, FilterIcon } from "@shared/components";
import {
  AddRegular,
} from "@fluentui/react-icons";
import { WelcomeBanner } from "../../components/common";
import React, { useEffect, useState } from "react";
import { scholarshipApplication } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface ApplicationCardData {
  applicationNo: string;
  status: "Draft" | "Registered" | "Completed" | "In Progress" | "Rejected" | "Approved";
  studentName: string;
  studied: string;
  fatherName: string;
  applied: string;
  scholarshipNumber?: string;
  mobileNo: string;
  preparedBy?: string;
  applicationId?: string; // For API calls
  rawData?: unknown; // Store raw API data for details view
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  // BRD Section 7.3: Status colors
  // Draft (Gray), Completed (Blue), In Progress (Yellow), Rejected (Red), Approved (Green)
  const getStatusStyle = (status: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "10000px", // Pill shape
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
    };

    switch (status) {
      case "Draft":
        return {
          ...baseStyle,
          backgroundColor: "#f5f5f5",
          color: "#424242",
          border: "1px solid #d1d1d1",
        };
      case "Completed":
        return {
          ...baseStyle,
          backgroundColor: "#ebf3fc", // Blue
          color: "#115ea3",
          border: "1px solid #b4d6fa",
        };
      case "In Progress":
        return {
          ...baseStyle,
          backgroundColor: "#fef3c7", // Yellow
          color: "#92400e",
          border: "1px solid #fde68a",
        };
      case "Rejected":
        return {
          ...baseStyle,
          backgroundColor: "#fee2e2", // Red
          color: "#991b1b",
          border: "1px solid #fecaca",
        };
      case "Approved":
        return {
          ...baseStyle,
          backgroundColor: "#f1faf1", // Green
          color: "#0e700e",
          border: "1px solid #9fd89f",
        };
      case "Registered":
      default:
        return {
          ...baseStyle,
          backgroundColor: "#ebf3fc", // Blue (same as Completed per BRD)
          color: "#115ea3",
          border: "1px solid #b4d6fa",
        };
    }
  };

  return <span style={getStatusStyle(status)}>{status}</span>;
};

const ApplicationCard: React.FC<{ 
  data: ApplicationCardData;
  onViewDetails?: (data: ApplicationCardData) => void;
  onContinueDraft?: (data: ApplicationCardData) => void;
  onDownloadReceipt?: (data: ApplicationCardData) => void;
}> = ({ data, onViewDetails, onContinueDraft, onDownloadReceipt }) => {
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
    // Reopen Application: For 'Registered' status applications, resume from where left off
    if (data.status === "Registered" && onContinueDraft) {
      onContinueDraft(data);
    }
    setIsDropdownOpen(false);
  };

  const handlePrint = () => {
    // Print Documents: For submitted applications
    if (onDownloadReceipt) {
      onDownloadReceipt(data);
    }
    setIsDropdownOpen(false);
  };

  const handleCardClick = () => {
    // View Details: Click on any application card to see full application information
    if (onViewDetails) {
      onViewDetails(data);
    }
  };

  return (
    <Card
      variant="outline"
      onClick={handleCardClick}
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
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDropdown();
                }}
                type="button"
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
                  {data.status === "Registered" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReopen();
                      }}
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
                      <span style={{ whiteSpace: "nowrap" }}>Reopen Application</span>
                    </button>
                  )}
                  {(data.status === "Completed" || data.status === "Approved" || data.status === "In Progress") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint();
                      }}
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
                      <span>Print Documents</span>
                    </button>
                  )}
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
  const { error: showError, info } = useToast();
  const [applications, setApplications] = useState<ApplicationCardData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationCardData[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "applicationNo">("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        
        // Get email from localStorage or auth context
        const authData = localStorage.getItem('scholarship_auth');
        const email = authData ? JSON.parse(authData).email : null;
        
        if (!email) {
          // Redirect to login if no email found
          navigate('/user-login');
          return;
        }

        // Fetch applications from API
        const response = await scholarshipApplication.getApplications(email);
        
        // Transform API response to ApplicationCardData format
        const transformedApplications: ApplicationCardData[] = Array.isArray(response) 
          ? response.map((app: any) => ({
              applicationNo: app.Application_Id || app.applicationId || '',
              status: app.Status || 'Registered',
              studentName: app.Applicant_Name || app.Student_Name || app.fullName || '',
              studied: app.Institution_Name || app.institutionName || '',
              fatherName: app.Father_Name || app.Guardian_Name || '',
              applied: app.Data_Date 
                ? (() => {
                    try {
                      const date = new Date(app.Data_Date);
                      if (isNaN(date.getTime())) {
                        // If date is invalid, try parsing as string
                        const dateStr = String(app.Data_Date);
                        const parsed = new Date(dateStr);
                        return isNaN(parsed.getTime()) 
                          ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : parsed.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      }
                      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    } catch {
                      return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                  })()
                : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              scholarshipNumber: app.Scholarship_No || app.scholarshipNumber || '',
              mobileNo: app.Mobile_Number || app.mobileNumber || '',
              preparedBy: app.Prepared_By || app.preparedBy || '',
            }))
          : [];

        setApplications(transformedApplications);
        setFilteredApplications(transformedApplications);
        
        // Set user name from first application or use email
        if (transformedApplications.length > 0 && transformedApplications[0].studentName) {
          setUserName(transformedApplications[0].studentName.split(' ')[0]);
        } else {
          setUserName(email.split('@')[0]);
        }
      } catch (error: unknown) {
        console.error('Error fetching applications:', error);
        showError('Failed to Load Applications', 'Unable to fetch your applications. Please try again.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchApplications();
  }, [navigate]);


  // Filter and sort applications
  React.useEffect(() => {
    let filtered = [...applications];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.applied).getTime() - new Date(a.applied).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "applicationNo":
          return a.applicationNo.localeCompare(b.applicationNo);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, filterStatus, sortBy]);

  // Handlers for user actions
  const handleViewDetails = (data: ApplicationCardData) => {
    // Fetch full application details
    void scholarshipApplication.getApplication(data.applicationNo)
      .then((details) => {
        // TODO: Open modal or navigate to details page with full application data
        console.log("View details for:", data.applicationNo, details);
        // For now, we can show an alert or navigate to a details page
        // You can implement a modal similar to the process page
      })
      .catch((error) => {
        console.error("Error fetching application details:", error);
        showError('Failed to Load Details', 'Unable to fetch application details. Please try again.');
      });
  };

  const handleContinueDraft = (data: ApplicationCardData) => {
    // Navigate to registration with application data to continue editing
    navigate("/registration", { 
      state: { 
        applicationId: data.applicationNo,
        continueDraft: true 
      } 
    });
  };

  const handleDownloadReceipt = (data: ApplicationCardData) => {
    // TODO: Implement receipt download
    // This would typically call an API endpoint to generate/download PDF
    info('Coming Soon', 'Receipt download feature will be available soon.');
  };

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
                marginLeft: "24px",
              }}
              onClick={() => navigate("/registration")}
            >
              <AddRegular style={{ width: "18px", height: "18px" }} />
              Create New Application
            </Button>
            <div ref={filterRef} style={{ position: "relative" }}>
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
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label="Filter and Sort"
              >
                <FilterIcon
                  width={32}
                  height={32}
                  style={{ marginLeft: "13px" }}
                />
              </Button>
              
              {/* Filter/Sort Dropdown - BRD Section 7.4 */}
              {isFilterOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                  minWidth: "250px",
                  padding: "16px",
                }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#242424",
                      marginBottom: "8px",
                      display: "block",
                    }}>Filter by Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="Draft">Draft</option>
                      <option value="Registered">Registered</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#242424",
                      marginBottom: "8px",
                      display: "block",
                    }}>Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "status" | "applicationNo")}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="date">Date (Newest First)</option>
                      <option value="status">Status</option>
                      <option value="applicationNo">Application Number</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[18px] px-6">
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton
                  key={index}
                  variant="elevated"
                  showIcon={false}
                  showHeader={true}
                  contentSections={3}
                />
              ))}
            </>
          ) : filteredApplications.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#616161' }}>
              {applications.length === 0 
                ? "No applications found. Create a new application to get started."
                : "No applications match the selected filter."}
            </div>
          ) : (
            filteredApplications.map((app) => (
              <ApplicationCard 
                key={app.applicationNo} 
                data={app}
                onViewDetails={handleViewDetails}
                onContinueDraft={handleContinueDraft}
                onDownloadReceipt={handleDownloadReceipt}
              />
            ))
          )}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default UserDashboard;

