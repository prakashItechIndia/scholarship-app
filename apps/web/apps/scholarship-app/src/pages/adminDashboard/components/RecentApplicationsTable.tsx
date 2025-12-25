import * as React from "react";
import { Card, Table } from "@shared/components";
import { RecentApplication } from "../types";
import {
  ArrowUp20Regular,
  ArrowDown20Regular,
} from "@fluentui/react-icons";

interface RecentApplicationsTableProps {
  data?: RecentApplication[];
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({
  data = [],
}) => {
  const columns = React.useMemo(() => {
    const createSortableHeader = (name: string) => (
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
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
        }}>
          {name}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ArrowUp20Regular style={{ width: "12px", height: "12px", color: "#616161" }} />
          <ArrowDown20Regular style={{ width: "12px", height: "12px", color: "#616161", marginTop: "-4px" }} />
        </div>
      </div>
    );

    const renderStatus = (status: string) => (
      <span
        style={{
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 500,
          color: "#0f6cbd",
          backgroundColor: "#e6f2ff",
          padding: "4px 12px",
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
        fontSize: "14px",
        lineHeight: "20px",
        color: "#242424",
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
        name: "APPLICATION NO.",
        fieldName: "applicationNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("APPLICATION NO."),
        onRender: (item: RecentApplication) => renderText(item.applicationNo),
      },
      {
        key: "studentName",
        name: "STUDENT NAME",
        fieldName: "studentName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("STUDENT NAME"),
        onRender: (item: RecentApplication) => renderText(item.studentName),
      },
      {
        key: "classStudying",
        name: "COURSE/STREAM",
        fieldName: "classStudying",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("COURSE/STREAM"),
        onRender: (item: RecentApplication) => renderText(item.courseStream || item.classStudying),
      },
      {
        key: "institutionName",
        name: "INSTITUTION NAME",
        fieldName: "institutionName",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("INSTITUTION NAME"),
        onRender: (item: RecentApplication) => renderText(item.institutionName),
      },
      {
        key: "roomNumber",
        name: "ROOM NUMBER",
        fieldName: "roomNumber",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("ROOM NUMBER"),
        onRender: (item: RecentApplication) => renderText(item.roomNumber),
      },
      {
        key: "status",
        name: "STATUS",
        fieldName: "status",
        minWidth: 120,
        isSortable: false,
        onRender: (item: RecentApplication) => renderStatus(item.status),
      },
      {
        key: "scholarshipId",
        name: "SCHOLARSHIP ID",
        fieldName: "scholarshipId",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("SCHOLARSHIP ID"),
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
          fontSize: "18px",
          lineHeight: "24px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "4px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Recent Applications
        </h3>
        <p style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          Overview of latest scholarship applications.
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table columns={columns} data={data} />
      </div>
    </Card>
  );
};

