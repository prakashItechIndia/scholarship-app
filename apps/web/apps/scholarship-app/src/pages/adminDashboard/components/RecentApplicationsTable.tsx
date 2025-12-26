import * as React from "react";
import { Card, DataTable } from "@shared/components";
import { RecentApplication } from "../types";
import {
  ArrowSort20Regular,
} from "@fluentui/react-icons";

interface RecentApplicationsTableProps {
  data?: RecentApplication[];
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({
  data = [],
}) => {
  const columns = React.useMemo(() => {
    const createSortableHeader = (name: string, isSortable: boolean = true) => (
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
        }}
        className="hover:opacity-80"
      >
        <span style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#424242",
          fontFamily: "'Inter', sans-serif",
        }}>
          {name}
        </span>
        {isSortable && <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />}
      </div>
    );

    const renderStatus = (status: string) => (
      <span
        style={{
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 500,
          color: status === "Registered" ? "#0E1CDD" : "#0f6cbd",
          backgroundColor: status === "Registered" ? "#E4EEFF" : "#e6f2ff",
          border: status === "Registered" ? "1px solid #AFCAFF" : "none",
          padding: "4px 30px",
          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
          display: "inline-block",
        }}
      >
        {status}
      </span>
    );

    const renderText = (value: string | undefined) => (
      <span style={{
        fontSize: "13px",
        lineHeight: "19px",
        color: "#242424",
        fontWeight: 400,
        fontFamily: "'Inter', sans-serif",
      }}>
        {value || "-"}
      </span>
    );

    return [
      {
        key: "checkbox",
        name: "",
        fieldName: "checkbox",
        minWidth: 48,
        maxWidth: 48,
        isSortable: false,
        onRenderHeader: () => (
          <input
            type="checkbox"
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        ),
        onRender: () => (
          <input
            type="checkbox"
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        ),
      },
      {
        key: "applicationNo",
        name: "Application No.",
        fieldName: "applicationNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Application No."),
        onRender: (item: RecentApplication) => renderText(item.applicationNo),
      },
      {
        key: "studentName",
        name: "Student Name",
        fieldName: "studentName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Student Name"),
        onRender: (item: RecentApplication) => renderText(item.studentName),
      },
      {
        key: "classStudying",
        name: "Class Studying",
        fieldName: "classStudying",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Class Studying"),
        onRender: (item: RecentApplication) => renderText(item.classStudying),
      },
      {
        key: "institutionName",
        name: "Institution Name",
        fieldName: "institutionName",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Institution Name"),
        onRender: (item: RecentApplication) => renderText(item.institutionName),
      },
      {
        key: "mobileNumber",
        name: "Mobile Number",
        fieldName: "mobileNumber",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mobile Number"),
        onRender: (item: RecentApplication) => renderText(item.mobileNumber),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status"),
        onRender: (item: RecentApplication) => renderStatus(item.status),
      },
      {
        key: "scholarshipId",
        name: "Scholarship",
        fieldName: "scholarshipId",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship"),
        onRender: (item: RecentApplication) => renderText(item.scholarshipId),
      },
    ];
  }, []);

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
    }}>
      <div style={{
        marginBottom: "16px",
      }}>
        <h3 style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "4px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Recent Applications
        </h3>
        <p style={{
          fontSize: "12px",
          lineHeight: "16px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
        }}>
          Overview of latest scholarship applications.
        </p>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        cardStyle={{ 
          boxShadow: "none", 
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      />
    </Card>
  );
};

