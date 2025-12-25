import * as React from "react";
import { ScholarshipReportData } from "../types";
import {
  ArrowSort20Regular,
  MoreHorizontalRegular,
  PrintRegular, // Assuming PrintRegular exists? Yes usually.
} from "@fluentui/react-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // Tooltip, // if needed
} from "@shared/components";

interface UseReportsTableProps {
  onRowSelect?: (item: ScholarshipReportData, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectedRows?: Set<string>;
  data?: ScholarshipReportData[];
  onViewPdf?: (item: ScholarshipReportData) => void;
}

export const useReportsTable = ({
  onRowSelect,
  onSelectAll,
  selectedRows = new Set(),
  data = [],
  onViewPdf,
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
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          {name}
        </span>
        <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
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
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0f6cbd", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            {item?.applicationNo}
          </span>
        ),
      },
      {
        key: "aadhaarId",
        name: "Aadhaar Id",
        fieldName: "aadhaarId",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Aadhaar Id"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>
            {item?.aadhaarId}
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
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>
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
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>
            {item?.studentId}
          </span>
        ),
      },
      {
        key: "classStudying",
        name: "Class Studying",
        fieldName: "classStudying",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Class Studying"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>
            {item?.classStudying}
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
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>
            {item?.institutionName}
          </span>
        ),
      },
      {
        key: "fatherName",
        name: "Father Name",
        fieldName: "fatherName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.fatherName}</span>
        ),
      },
      {
        key: "fatherOfficeName",
        name: "Father Office Name",
        fieldName: "fatherOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Office Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.fatherOfficeName}</span>
        ),
      },
      {
        key: "motherName",
        name: "Mother Name",
        fieldName: "motherName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mother Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.motherName}</span>
        ),
      },
      {
        key: "motherOfficeName",
        name: "Mother Office Name",
        fieldName: "motherOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mother Office Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.motherOfficeName}</span>
        ),
      },
      {
        key: "guardianName",
        name: "Guardian Name",
        fieldName: "guardianName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Guardian Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.guardianName}</span>
        ),
      },
      {
        key: "guardianOfficeName",
        name: "Guardian Office Name",
        fieldName: "guardianOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Guardian Office Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.guardianOfficeName}</span>
        ),
      },
      {
        key: "gender",
        name: "Gender",
        fieldName: "gender",
        minWidth: 100,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Gender"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.gender}</span>
        ),
      },
      {
        key: "checkInFavor",
        name: "Check In Favor",
        fieldName: "checkInFavor",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Check In Favor"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.checkInFavor}</span>
        ),
      },
      {
        key: "approvedAmount",
        name: "Approved Amount",
        fieldName: "approvedAmount",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Approved Amount"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.approvedAmount}</span>
        ),
      },
      {
        key: "issuedAmount",
        name: "Issued Amount",
        fieldName: "issuedAmount",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Issued Amount"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.issuedAmount}</span>
        ),
      },
      {
        key: "scholarshipId",
        name: "Scholarship Id",
        fieldName: "scholarshipId",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship Id"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.scholarshipId}</span>
        ),
      },
      {
        key: "ddCheckNo",
        name: "DD Check No",
        fieldName: "ddCheckNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("DD Check No"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.ddCheckNo}</span>
        ),
      },
      {
        key: "donateDate",
        name: "Donate Date",
        fieldName: "donateDate",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Donate Date"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.donateDate}</span>
        ),
      },
      {
        key: "bankName",
        name: "Bank Name",
        fieldName: "bankName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Bank Name"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.bankName}</span>
        ),
      },
      {
        key: "appliedDate",
        name: "Applied Date",
        fieldName: "appliedDate",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Applied Date"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.appliedDate}</span>
        ),
      },
      {
        key: "scholarshipYear",
        name: "Scholarship Year",
        fieldName: "scholarshipYear",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship Year"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.scholarshipYear}</span>
        ),
      },
      {
        key: "scholarshipFor",
        name: "Scholarship For",
        fieldName: "scholarshipFor",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship For"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.scholarshipFor}</span>
        ),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status"),
        onRender: (item?: ScholarshipReportData) => (
          <span style={{ fontSize: "14px", lineHeight: "20px", color: "#242424", fontFamily: "'Inter', sans-serif" }}>{item?.status}</span>
        ),
      },
      {
        key: "actions",
        name: "", // Action column has no header text usually, or "Actions"
        fieldName: "actions",
        minWidth: 50,
        isSortable: false,
        onRender: (item?: ScholarshipReportData) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button appearance="subtle" style={{ minWidth: "auto", padding: "4px" }}>
                <MoreHorizontalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                icon={<PrintRegular style={{ width: "20px", height: "20px" }} />}
                label="Print Details"
                onClick={() => item && onViewPdf && onViewPdf(item)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [selectedRows, onRowSelect, onSelectAll, data]);

  return { columns };
};

