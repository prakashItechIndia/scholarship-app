import * as React from "react";
import { Button, Card } from "@shared/components";
import {
  DocumentRegular,
  AddRegular,
  MoreHorizontalRegular,
  SubtractRegular,
} from "@fluentui/react-icons";

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
  return (
    <Card
      variant="outline"
      style={{
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      {/* Header with Application No, Status, and Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DocumentRegular
            style={{
              width: "16px",
              height: "16px",
              color: "#616161",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Application No.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatusBadge status={data.status} />
          <button
            style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Options"
          >
            <SubtractRegular
              style={{
                width: "16px",
                height: "16px",
                color: "#616161",
              }}
            />
          </button>
        </div>
      </div>

      {/* Application Number */}
      <div style={{ marginBottom: "20px" }}>
        <span
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 600,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {data.applicationNo}
        </span>
      </div>

      {/* Application Details */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <DetailRow label="Student Name" value={data.studentName} />
        <DetailRow label="Studied" value={data.studied} />
        <DetailRow label="Father Name" value={data.fatherName} />
        <DetailRow label="Applied" value={data.applied} />
        <DetailRow
          label="Scholarship Number"
          value={data.scholarshipNumber || "-"}
        />
        <DetailRow label="Mobile No." value={data.mobileNo} />
        <DetailRow label="Prepared By" value={data.preparedBy || "-"} />
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
          lineHeight: "16px",
          fontWeight: 500,
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 400,
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
  ];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fafafa",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Welcome Section */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            lineHeight: "36px",
            fontWeight: 700,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Welcome {userName}!
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 400,
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Have a nice day!
        </p>
      </div>

      {/* Application Status Section */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                fontWeight: 600,
                color: "#242424",
                marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
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
              }}
            >
              Track the progress of your submitted application
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#115ea3",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => console.log("Create New Application")}
            >
              <AddRegular style={{ width: "16px", height: "16px" }} />
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
              }}
              onClick={() => console.log("More options")}
              aria-label="More options"
            >
              <MoreHorizontalRegular
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#616161",
                }}
              />
            </Button>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "24px",
          }}
        >
          {applications.map((app) => (
            <ApplicationCard key={app.applicationNo} data={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

