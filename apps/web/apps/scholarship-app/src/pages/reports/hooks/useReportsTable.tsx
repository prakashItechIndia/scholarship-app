import * as React from "react";
import { ScholarshipReportData } from "../types";
import {
  ArrowUp20Regular,
  ArrowDown20Regular,
} from "@fluentui/react-icons";

interface UseReportsTableProps {
  onRowSelect?: (item: ScholarshipReportData, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectedRows?: Set<string>;
  data?: ScholarshipReportData[];
}

export const useReportsTable = ({
  onRowSelect,
  onSelectAll,
  selectedRows = new Set(),
  data = [],
}: UseReportsTableProps) => {
  const columns = React.useMemo(() => {
    // Helper function to create sortable header
    const createSortableHeader = (name: string) => (
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
        }}
      >
        <span style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#424242",
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

    return [
      {
        key: "checkbox",
        name: "",
        fieldName: "checkbox",
        minWidth: 48,
        maxWidth: 48,
        isSortable: false,
        onRender: (item?: ScholarshipReportData) => (
          <input
            type="checkbox"
            checked={item ? selectedRows.has(item.applicationNo) : false}
            onChange={(e) => {
              e.stopPropagation();
              if (item && onRowSelect) {
                onRowSelect(item, e.target.checked);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        ),
        onRenderHeader: () => {
          const allSelected = data.length > 0 && selectedRows.size === data.length;
          const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
          return (
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = someSelected;
                }
              }}
              onChange={(e) => {
                e.stopPropagation();
                if (onSelectAll) {
                  onSelectAll(e.target.checked);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                accentColor: "#0f6cbd",
              }}
            />
          );
        },
      },
      {
        key: "applicationNo",
        name: "Application No.",
        fieldName: "applicationNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Application No."),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.applicationNo}
          </span>
        ),
      },
      {
        key: "studentName",
        name: "Student Name",
        fieldName: "studentName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Student Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.studentName}
          </span>
        ),
      },
      {
        key: "studentId",
        name: "Student Id",
        fieldName: "studentId",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Student Id"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.studentId}
          </span>
        ),
      },
      {
        key: "institutionName",
        name: "Institution Name",
        fieldName: "institutionName",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Institution Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.institutionName}
          </span>
        ),
      },
      {
        key: "scholarshipId",
        name: "Scholarship ID",
        fieldName: "scholarshipId",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship ID"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.scholarshipId}
          </span>
        ),
      },
      {
        key: "checkNo",
        name: "Check No",
        fieldName: "checkNo",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Check No"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {item?.checkNo}
          </span>
        ),
      },
    ];
  }, [selectedRows, onRowSelect, onSelectAll, data]);

  return { columns };
};

