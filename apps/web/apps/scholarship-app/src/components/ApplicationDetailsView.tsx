import * as React from "react";
import { Card, Button } from "@shared/components";
import {
  DocumentRegular,
  ArrowDownRegular,
  EditRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  DismissCircleRegular,
} from "@fluentui/react-icons";

interface ApplicationDetailsData {
  applicationNo: string;
  studentName: string;
  classStudying?: string;
  institutionName?: string;
  fatherAnnualIncome?: string;
  mobileNumber?: string;
  fatherOccupation?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  status?: string;
  uploadedDate?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedDate: string;
    status: string;
  }>;
  [key: string]: unknown;
}

interface ApplicationDetailsViewProps {
  data: ApplicationDetailsData | null;
  onEdit?: () => void;
  onDownload?: (documentUrl: string) => void;
  onViewDocument?: (documentUrl: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { 
    bgColor: string; 
    textColor: string; 
    borderColor: string; 
    icon: React.ReactNode 
  }> = {
    Verified: {
      bgColor: "#f1faf1",
      textColor: "#0e700e",
      borderColor: "#9fd89f",
      icon: <CheckmarkCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
    Pending: {
      bgColor: "#fff9f5",
      textColor: "#bc4b09",
      borderColor: "#fdcfb4",
      icon: <ClockRegular style={{ width: "16px", height: "16px" }} />,
    },
    Approved: {
      bgColor: "#ebf3fc",
      textColor: "#115ea3",
      borderColor: "#b4d6fa",
      icon: <CheckmarkCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
    Rejected: {
      bgColor: "#fdf3f4",
      textColor: "#b10e1c",
      borderColor: "#eeacb2",
      icon: <DismissCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
  };

  const config = statusConfig[status] || {
    bgColor: "#f5f5f5",
    textColor: "#424242",
    borderColor: "#d1d1d1",
    icon: null,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "10000px",
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 500,
        border: `1px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {config.icon}
      {status}
    </span>
  );
};

const ApplicationDetailsView: React.FC<ApplicationDetailsViewProps> = ({
  data,
  onEdit,
  onDownload,
  onViewDocument,
}) => {
  if (!data) {
    return (
      <div style={{
        padding: "24px",
        textAlign: "center",
        color: "#616161",
        fontFamily: "'Inter', sans-serif",
      }}>
        No application data available
      </div>
    );
  }

  const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; fullWidth?: boolean }> = ({ 
    label, 
    value, 
    fullWidth = false 
  }) => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      ...(fullWidth ? { gridColumn: "1 / -1" } : {}),
    }}>
      <label style={{
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 500,
        color: "#616161",
        fontFamily: "'Inter', sans-serif",
      }}>
        {label}
      </label>
      <div style={{
        fontSize: "14px",
        lineHeight: "20px",
        color: "#242424",
        fontFamily: "'Inter', sans-serif",
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "16px",
        borderBottom: "1px solid #e0e0e0",
      }}>
        <div>
          <h2 style={{
            fontSize: "24px",
            lineHeight: "32px",
            fontWeight: 700,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}>
            {data.studentName}
          </h2>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Application No: {data.applicationNo}
          </p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          {data.status && <StatusBadge status={data.status} />}
          {onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <EditRegular style={{ width: "16px", height: "16px" }} />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <Card variant="outline" style={{ padding: "24px" }}>
        <h3 style={{
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "16px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Personal Information
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px 24px",
        }}>
          <DetailRow label="Full Name" value={data.studentName} />
          <DetailRow label="Date of Birth" value={data.dateOfBirth || "-"} />
          <DetailRow label="Gender" value={data.gender || "-"} />
          <DetailRow label="Mobile Number" value={data.mobileNumber || "-"} />
          <DetailRow label="Email Address" value={data.email || "-"} />
          <DetailRow label="Class Studying" value={data.classStudying || "-"} />
          <DetailRow 
            label="Address" 
            value={data.address || "-"} 
            fullWidth 
          />
          <DetailRow label="City" value={data.city || "-"} />
          <DetailRow label="District" value={data.district || "-"} />
          <DetailRow label="State" value={data.state || "-"} />
          <DetailRow label="Pincode" value={data.pincode || "-"} />
        </div>
      </Card>

      {/* Academic Information Section */}
      <Card variant="outline" style={{ padding: "24px" }}>
        <h3 style={{
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "16px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Academic Information
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px 24px",
        }}>
          <DetailRow label="Institution Name" value={data.institutionName || "-"} fullWidth />
          <DetailRow label="Class Studying" value={data.classStudying || "-"} />
        </div>
      </Card>

      {/* Family Information Section */}
      <Card variant="outline" style={{ padding: "24px" }}>
        <h3 style={{
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "16px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Family Information
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px 24px",
        }}>
          <DetailRow label="Father Occupation" value={data.fatherOccupation || "-"} />
          <DetailRow label="Father Annual Income" value={data.fatherAnnualIncome || "-"} />
        </div>
      </Card>

      {/* Documents Section */}
      {data.documents && data.documents.length > 0 && (
        <Card variant="outline" style={{ padding: "24px" }}>
          <h3 style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "16px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Documents
          </h3>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {data.documents.map((doc, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#fafafa",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flex: 1,
                }}>
                  <DocumentRegular style={{ 
                    width: "20px", 
                    height: "20px", 
                    color: "#0f6cbd" 
                  }} />
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}>
                    <span style={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#242424",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {doc.name}
                    </span>
                    <span style={{
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#616161",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {doc.type} • Uploaded on {doc.uploadedDate}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <StatusBadge status={doc.status} />
                  {onViewDocument && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDocument(doc.url)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      View
                    </Button>
                  )}
                  {onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(doc.url)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <ArrowDownRegular style={{ width: "16px", height: "16px" }} />
                      <span style={{ fontSize: "12px" }}>Download</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Verification Information Section */}
      {(data.verifiedBy || data.verifiedDate) && (
        <Card variant="outline" style={{ padding: "24px" }}>
          <h3 style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "16px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Verification Information
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px 24px",
          }}>
            <DetailRow label="Verified By" value={data.verifiedBy || "-"} />
            <DetailRow label="Verified Date" value={data.verifiedDate || "-"} />
            <DetailRow label="Uploaded Date" value={data.uploadedDate || "-"} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApplicationDetailsView;

