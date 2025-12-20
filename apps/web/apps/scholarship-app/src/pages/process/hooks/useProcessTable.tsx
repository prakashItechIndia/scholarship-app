import * as React from "react";
import { ApplicationData } from "../types";
import StatusBadge from "../components/StatusBadge";
import {
  MoreVerticalRegular,
  ArrowUp20Regular,
  ArrowDown20Regular,
  EyeRegular,
  EditRegular,
  DeleteRegular,
  DocumentRegular,
} from "@fluentui/react-icons";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";

interface UseProcessTableProps {
  activeTab: string;
  handleView: (item: ApplicationData) => void;
  handleEdit: (item: ApplicationData) => void;
  handleDelete: (item: ApplicationData) => void;
  handleViewPDF: (item: ApplicationData) => void;
  handleViewDocument?: (item: ApplicationData) => void;
}

export const useProcessTable = ({
  activeTab,
  handleView,
  handleEdit,
  handleDelete,
  handleViewPDF,
  handleViewDocument,
}: UseProcessTableProps) => {
  const getColumnsForTab = React.useCallback((tab: string) => {
    const baseColumns = [
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
    ];

    // Helper function to create sortable header
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

    // Action column renderer
    const renderActions = (item: ApplicationData) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              style={{
                width: "32px",
                height: "32px",
                padding: 0,
              }}
              aria-label="More options"
            >
              <MoreVerticalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              icon={<EyeRegular style={{ width: "16px", height: "16px" }} />}
              label="View Details"
              onClick={() => handleView(item)}
            />
            <DropdownMenuItem
              icon={<EditRegular style={{ width: "16px", height: "16px" }} />}
              label="Edit"
              onClick={() => handleEdit(item)}
            />
            <DropdownMenuItem
              icon={<DocumentRegular style={{ width: "16px", height: "16px" }} />}
              label="View Documents"
              onClick={() => {
                // Always open the drawer with document list, not PDF modal
                if (handleViewDocument) {
                  handleViewDocument(item);
                }
              }}
            />
            <DropdownMenuItem
              icon={<DeleteRegular style={{ width: "16px", height: "16px" }} />}
              label="Delete"
              onClick={() => handleDelete(item)}
              style={{ color: "#c50f1f" }}
              className="hover:text-red-700"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    // Application No renderer - only this element should trigger PDF viewer
    const renderApplicationNo = (item: ApplicationData) => (
      <span 
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling to row
          handleViewPDF(item);
        }}
        onMouseDown={(e) => {
          e.stopPropagation(); // Also stop on mousedown
        }}
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#0f6cbd",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          display: "inline-block",
        }}
        className="hover:underline"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            handleViewPDF(item);
          }
        }}
      >
        {item.applicationNo}
      </span>
    );

    // Common text renderer
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

    switch (tab) {
      case "overview":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Application No."),
            onRender: renderApplicationNo,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Student Name"),
            onRender: (item: ApplicationData) => renderText(item.studentName),
          },
          {
            key: "classStudying",
            name: "Class Studying",
            fieldName: "classStudying",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Class Studying"),
            onRender: (item: ApplicationData) => renderText(item.classStudying),
          },
          {
            key: "institutionName",
            name: "Institution Name",
            fieldName: "institutionName",
            minWidth: 220,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Institution Name"),
            onRender: (item: ApplicationData) => renderText(item.institutionName),
          },
          {
            key: "fatherAnnualIncome",
            name: "Father Annual Income",
            fieldName: "fatherAnnualIncome",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Father Annual Income"),
            onRender: (item: ApplicationData) => renderText(item.fatherAnnualIncome),
          },
          {
            key: "mobileNumber",
            name: "Mobile Number",
            fieldName: "mobileNumber",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Mobile Number"),
            onRender: (item: ApplicationData) => renderText(item.mobileNumber),
          },
          {
            key: "fatherOccupation",
            name: "Father Occupation",
            fieldName: "fatherOccupation",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Father Occupation"),
            onRender: (item: ApplicationData) => renderText(item.fatherOccupation),
          },
          {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Status"),
            onRender: (item: ApplicationData) => (
              <StatusBadge status={item.status ?? "Pending"} />
            ),
          },
          {
            key: "actions",
            name: "Actions",
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 100,
            isSortable: false,
            onRenderHeader: () => (
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Actions
              </span>
            ),
            onRender: renderActions,
          },
        ];

      case "documents":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Application No."),
            onRender: renderApplicationNo,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Student Name"),
            onRender: (item: ApplicationData) => renderText(item.studentName),
          },
          {
            key: "documentType",
            name: "Document Type",
            fieldName: "documentType",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Document Type"),
            onRender: (item: ApplicationData) => renderText(item.documentType),
          },
          {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Status"),
            onRender: (item: ApplicationData) => (
              <StatusBadge status={item.status ?? "Pending"} />
            ),
          },
          {
            key: "uploadedDate",
            name: "Uploaded Date",
            fieldName: "uploadedDate",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Uploaded Date"),
            onRender: (item: ApplicationData) => renderText(item.uploadedDate),
          },
          {
            key: "verifiedBy",
            name: "Verified By",
            fieldName: "verifiedBy",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Verified By"),
            onRender: (item: ApplicationData) => renderText(item.verifiedBy),
          },
          {
            key: "actions",
            name: "Actions",
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 100,
            isSortable: false,
            onRenderHeader: () => (
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Actions
              </span>
            ),
            onRender: renderActions,
          },
        ];

      case "verify":
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Application No."),
            onRender: renderApplicationNo,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Student Name"),
            onRender: (item: ApplicationData) => renderText(item.studentName),
          },
          {
            key: "verificationStatus",
            name: "Verification Status",
            fieldName: "verificationStatus",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Verification Status"),
            onRender: (item: ApplicationData) => (
              <StatusBadge status={item.verificationStatus ?? "Pending"} />
            ),
          },
          {
            key: "verifiedDate",
            name: "Verified Date",
            fieldName: "verifiedDate",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Verified Date"),
            onRender: (item: ApplicationData) => renderText(item.verifiedDate),
          },
          {
            key: "verifiedBy",
            name: "Verified By",
            fieldName: "verifiedBy",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Verified By"),
            onRender: (item: ApplicationData) => renderText(item.verifiedBy),
          },
          {
            key: "actions",
            name: "Actions",
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 100,
            isSortable: false,
            onRenderHeader: () => (
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Actions
              </span>
            ),
            onRender: renderActions,
          },
        ];

      default:
        return [
          ...baseColumns,
          {
            key: "applicationNo",
            name: "Application No.",
            fieldName: "applicationNo",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Application No."),
            onRender: renderApplicationNo,
          },
          {
            key: "studentName",
            name: "Student Name",
            fieldName: "studentName",
            minWidth: 180,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Student Name"),
            onRender: (item: ApplicationData) => renderText(item.studentName),
          },
          {
            key: "actions",
            name: "Actions",
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 100,
            isSortable: false,
            onRenderHeader: () => (
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Actions
              </span>
            ),
            onRender: renderActions,
          },
        ];
    }
  }, [activeTab, handleView, handleEdit, handleDelete, handleViewPDF, handleViewDocument]);

  const columns = React.useMemo(
    () => getColumnsForTab(activeTab),
    [activeTab, getColumnsForTab]
  );

  return { columns };
};

