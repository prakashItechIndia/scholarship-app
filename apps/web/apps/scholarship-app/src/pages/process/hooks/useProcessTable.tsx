import * as React from "react";
import { ApplicationData } from "../types";
import StatusBadge from "../components/StatusBadge";
import {
  MoreHorizontalRegular,
  ArrowSort20Regular,
  ArrowUploadRegular,
  DocumentRegular,
  HistoryRegular,
  PrintRegular,
  HatGraduationRegular,
} from "@fluentui/react-icons";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";

interface UseProcessTableProps {
  activeTab: string;
  handleView: (item: ApplicationData) => void;
  handleEdit: (item: ApplicationData) => void;
  handleDelete: (item: ApplicationData) => void;
  handleViewPDF: (item: ApplicationData) => void;
  handleViewDocument?: (item: ApplicationData) => void;
  handleUpload?: (item: ApplicationData) => void;
  handleViewHistory?: (item: ApplicationData) => void;
  handleViewScholarshipHistory?: (item: ApplicationData) => void;
  handlePrintDetails?: (item: ApplicationData) => void;
  handleProcess?: (item: ApplicationData) => void;
}

export const useProcessTable = ({
  activeTab,
  handleView,
  handleEdit,
  handleDelete,
  handleViewPDF,
  handleViewDocument,
  handleViewHistory,
  handleViewScholarshipHistory,
  handlePrintDetails,
  handleUpload,
  handleProcess,
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
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          {name}
        </span>
        <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
      </div>
    );

    // Generic Action column renderer for Overview, Verify, Suggest, Approve, Issue Amount
    const renderActions = (item: ApplicationData) => {
      const status = item.status || "Review";

      // Define available menu items for reuse
      const menuItemViewHistory = (
        <DropdownMenuItem
          icon={<HistoryRegular style={{ width: "16px", height: "16px" }} />}
          label="View History"
          onClick={() => handleViewHistory && handleViewHistory(item)}
          style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
        />
      );
      const menuItemScholarshipHistory = (
        <DropdownMenuItem
          icon={<HatGraduationRegular style={{ width: "16px", height: "16px" }} />}
          label="Scholarship History"
          onClick={() => handleViewScholarshipHistory && handleViewScholarshipHistory(item)}
          style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
        />
      );
      const menuItemViewDocuments = (
        <DropdownMenuItem
          icon={<DocumentRegular style={{ width: "16px", height: "16px" }} />}
          label="View Documents"
          onClick={() => handleViewDocument && handleViewDocument(item)}
          style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
        />
      );
      const menuItemPrintDetails = (
        <DropdownMenuItem
          icon={<PrintRegular style={{ width: "16px", height: "16px" }} />}
          label="Print Details"
          onClick={() => handlePrintDetails && handlePrintDetails(item)}
          style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
        />
      );

      let menuItems: React.ReactNode[] = [];

      // Logic based on activeTab and Status
      if (activeTab === "verify") {
        if (status === "Verified") {
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory, menuItemViewDocuments];
        }
        // "Documents Submitted" or "Pending" will fall through to PDF viewer
      } else if (activeTab === "suggest") {
        // User said: "sugges 1 and suggest 2 should have View hisgtory,scholrship hstory,view documets"
        // User also said statuses are "Verified" and "Completed" in suggest page.
        if (status === "Verified" || status === "Completed") {
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory, menuItemViewDocuments];
        }
      } else if (activeTab === "approve") {
        // Statuses: Waiting, Approved.
        // Actions: View hisgtory, scholrship hstory
        if (status === "Waiting" || status === "Approved" || status === "Approve") { // handling 'Approve' if data typo
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory];
        }
      } else if (activeTab === "issue-amount") {
        // "Issue Amount" page: "Approved" status -> Click dot = PDF. So NO menu items.
        menuItems = [];
      } else if (activeTab === "overview" || activeTab === "documents") { // Fallback for overview/documents (though documents uses renderDocumentActions)
        if (status === "Registered") {
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory];
        } else if (status === "Completed") {
          // Completed in Overview typically has all 4
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory, menuItemViewDocuments, menuItemPrintDetails];
        }
      } else {
        // Fallback for generic behavior if needed
        if (status === "Registered") {
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory];
        } else if (status === "Completed") {
          menuItems = [menuItemViewHistory, menuItemScholarshipHistory, menuItemViewDocuments, menuItemPrintDetails];
        }
      }

      // If we have menu items, render Dropdown
      if (menuItems.length > 0) {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="subtle"
                  size="small"
                  style={{
                    width: "32px",
                    height: "32px",
                    padding: 0,
                  }}
                  aria-label="More options"
                >
                  <MoreHorizontalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>{item}</React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }

      // Default: Direct PDF Viewer Button
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Button
            appearance="subtle"
            size="small"
            style={{
              width: "32px",
              height: "32px",
              padding: 0,
            }}
            aria-label="View Application"
            onClick={() => handleViewPDF(item)}
          >
            <MoreHorizontalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
          </Button>
        </div>
      );
    };

    // Document Action column renderer with Upload button
    // It also includes the same dropdown menu items as renderActions
    const renderDocumentActions = (item: ApplicationData) => {
      const status = item.status || "Review";
      const isRegistered = status === "Registered";
      const isCompleted = status === "Completed";

      const isMenuAvailable = isRegistered || isCompleted;

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          <Button
            appearance="outline"
            onClick={() => handleUpload && handleUpload(item)}
            icon={<ArrowUploadRegular style={{ width: "16px", height: "16px", color: "#616161" }} />}
            style={{
              color: "#242424",
              borderColor: "#d1d1d1",
              fontWeight: 600,
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Upload
          </Button>

          {isMenuAvailable ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="subtle"
                  size="small"
                  style={{
                    width: "32px",
                    height: "32px",
                    padding: 0,
                  }}
                  aria-label="More options"
                >
                  <MoreHorizontalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isRegistered && (
                  <>
                    <DropdownMenuItem
                      icon={<HistoryRegular style={{ width: "16px", height: "16px" }} />}
                      label="View History"
                      onClick={() => handleViewHistory && handleViewHistory(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                    <DropdownMenuItem
                      icon={<HatGraduationRegular style={{ width: "16px", height: "16px" }} />}
                      label="Scholarship History"
                      onClick={() => handleViewScholarshipHistory && handleViewScholarshipHistory(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                  </>
                )}

                {isCompleted && (
                  <>
                    <DropdownMenuItem
                      icon={<HistoryRegular style={{ width: "16px", height: "16px" }} />}
                      label="View History"
                      onClick={() => handleViewHistory && handleViewHistory(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                    <DropdownMenuItem
                      icon={<HatGraduationRegular style={{ width: "16px", height: "16px" }} />}
                      label="Scholarship History"
                      onClick={() => handleViewScholarshipHistory && handleViewScholarshipHistory(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                    <DropdownMenuItem
                      icon={<DocumentRegular style={{ width: "16px", height: "16px" }} />}
                      label="View Documents"
                      onClick={() => handleViewDocument && handleViewDocument(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                    <DropdownMenuItem
                      icon={<PrintRegular style={{ width: "16px", height: "16px" }} />}
                      label="Print Details"
                      onClick={() => handlePrintDetails && handlePrintDetails(item)}
                      style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                    />
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              appearance="subtle"
              size="small"
              style={{
                width: "32px",
                height: "32px",
                padding: 0,
              }}
              aria-label="View Application"
              onClick={() => handleViewPDF(item)}
            >
              <MoreHorizontalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
            </Button>
          )}
        </div>
      );
    };

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

    // Process Action renderer (Suggest/Approve/Issue)
    const renderProcessAction = (item: ApplicationData) => {
      const label = item.processActionLabel || "Process";
      const isCustomStyled = label.includes("Approve") || label.includes("Issue") || label.includes("Suggest");

      return (
        <Button
          appearance={isCustomStyled ? "subtle" : "primary"}
          onClick={() => handleProcess && handleProcess(item)}
          style={{
            backgroundColor: isCustomStyled ? "transparent" : "#0F6CBD",
            color: isCustomStyled ? "#0F6CBD" : "#ffffff",
            minWidth: "120px",
            height: "32px",
            fontWeight: 600,
            fontSize: "13px",
            border: "none",
          }}
        >
          {label}
        </Button>
      );
    };

    // Common text renderer - now clickable to show PDF
    const renderText = (value: string | undefined, item?: ApplicationData) => (
      <span
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
          cursor: item ? "pointer" : "default",
        }}
        onClick={(e) => {
          if (item && handleViewPDF) {
            e.stopPropagation();
            handleViewPDF(item);
          }
        }}
      >
        {value || "-"}
      </span>
    );

    // Action column definition (reusable)
    const actionColumnDefinition = {
      key: "actions",
      name: "Actions",
      fieldName: "actions",
      minWidth: 48,
      maxWidth: 48,
      isSortable: false,
      onRenderHeader: () => <span />, // Empty header or icon if preferred, but user just said "three horizontal button"
      onRender: renderActions,
    };

    // Columns Definition
    const commonColumns = [
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
        onRender: (item: ApplicationData) => renderText(item.studentName, item),
      },
      {
        key: "classStudying",
        name: "Class Studying",
        fieldName: "classStudying",
        minWidth: 180,
        isResizable: true,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Class Studying"),
        onRender: (item: ApplicationData) => renderText(item.classStudying, item),
      },
      {
        key: "institutionName",
        name: "Institution Name",
        fieldName: "institutionName",
        minWidth: 220,
        isResizable: true,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Institution Name"),
        onRender: (item: ApplicationData) => renderText(item.institutionName, item),
      },
      {
        key: "fatherAnnualIncome",
        name: "Father Annual Income",
        fieldName: "fatherAnnualIncome",
        minWidth: 180,
        isResizable: true,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Annual Income"),
        onRender: (item: ApplicationData) => renderText(item.fatherAnnualIncome, item),
      },
      {
        key: "mobileNumber",
        name: "Mobile Number",
        fieldName: "mobileNumber",
        minWidth: 160,
        isResizable: true,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mobile Number"),
        onRender: (item: ApplicationData) => renderText(item.mobileNumber, item),
      },
      {
        key: "fatherOccupation",
        name: "Father Occupation",
        fieldName: "fatherOccupation",
        minWidth: 180,
        isResizable: true,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Occupation"),
        onRender: (item: ApplicationData) => renderText(item.fatherOccupation, item),
      },
    ];

    switch (tab) {
      case "overview":
        return [
          ...baseColumns,
          ...commonColumns,
          {
            key: "scholarshipNumber",
            name: "Scholarship Number",
            fieldName: "scholarshipNumber",
            minWidth: 160,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Scholarship Number"),
            onRender: (item: ApplicationData) => renderText(item.scholarshipNumber, item),
          },
          {
            key: "scholarship",
            name: "Scholarship",
            fieldName: "scholarship",
            minWidth: 120,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Scholarship"),
            onRender: (item: ApplicationData) => renderText(item.scholarship, item),
          },
          {
            key: "preparedBy",
            name: "Prepared By",
            fieldName: "preparedBy",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Prepared By"),
            onRender: (item: ApplicationData) => renderText(item.preparedBy, item),
          },
          {
            key: "verifiedBy",
            name: "Verified By",
            fieldName: "verifiedBy",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Verified By"),
            onRender: (item: ApplicationData) => renderText(item.verifiedBy, item),
          },
          {
            key: "suggestedBy",
            name: "Suggested By",
            fieldName: "suggestedBy",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Suggested By"),
            onRender: (item: ApplicationData) => renderText(item.suggestedBy, item),
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
              <div
                onClick={() => handleViewPDF && handleViewPDF(item)}
                style={{ cursor: "pointer" }}
              >
                <StatusBadge status={item.status ?? "Pending"} />
              </div>
            ),
          },
          actionColumnDefinition, // Add Actions back
        ];

      case "documents":
        return [
          ...baseColumns,
          ...commonColumns,

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
            minWidth: 160,
            maxWidth: 160,
            isSortable: false,
            onRenderHeader: () => createSortableHeader("Actions"),
            onRender: renderDocumentActions, // Document tab specific logic (upload button)
          },
        ];

      case "verify":
        return [
          ...baseColumns,
          ...commonColumns,
          {
            key: "scholarship",
            name: "Scholarship",
            fieldName: "scholarship",
            minWidth: 120,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Scholarship"),
            onRender: (item: ApplicationData) => renderText(item.scholarship, item),
          },
          {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Status"),
            onRender: (item: ApplicationData) => {
              const status = item.status ?? "Pending";
              // In verify tab, make status badges clickable
              if (activeTab === "verify") {
                if (status === "Verified") {
                  // "Verified" status opens the VerifyModal
                  return (
                    <div
                      onClick={() => handleProcess && handleProcess(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <StatusBadge status={status} />
                    </div>
                  );
                } else {
                  // All other statuses open the PDF viewer
                  return (
                    <div
                      onClick={() => handleViewPDF && handleViewPDF(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <StatusBadge status={status} />
                    </div>
                  );
                }
              }
              return <StatusBadge status={status} />;
            },
          },
          actionColumnDefinition, // Add Actions back
        ];

      case "suggest":
      case "approve":
      case "issue-amount":
        return [
          ...baseColumns,
          ...commonColumns,
          {
            key: "scholarship",
            name: "Scholarship",
            fieldName: "scholarship",
            minWidth: 120,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Scholarship"),
            onRender: (item: ApplicationData) => renderText(item.scholarship, item),
          },
          {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 140,
            isResizable: true,
            isSortable: true,
            onRenderHeader: () => createSortableHeader("Status"),
            onRender: (item: ApplicationData) => {
              const status = item.status ?? "Pending";
              // Make status badges clickable in suggest, approve, and issue-amount tabs
              if (activeTab === "suggest" || activeTab === "approve" || activeTab === "issue-amount") {
                return (
                  <div
                    onClick={() => handleViewPDF && handleViewPDF(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <StatusBadge status={status} />
                  </div>
                );
              }
              return <StatusBadge status={status} />;
            },
          },
          {
            key: "process",
            name: "Process",
            fieldName: "process",
            minWidth: 140,
            isResizable: false,
            isSortable: false,
            onRenderHeader: () => createSortableHeader("Process"),
            onRender: renderProcessAction,
          },
          actionColumnDefinition, // Add Actions back
        ];

      default:
        // Default fallthrough to preserve basic layout
        return [
          ...baseColumns,
          ...commonColumns,
          actionColumnDefinition,
        ];
    }
  }, [
    activeTab,
    handleView,
    handleEdit,
    handleDelete,
    handleViewPDF,
    handleViewDocument,
    handleUpload,
    handleViewHistory,
    handleViewScholarshipHistory,
    handlePrintDetails,
    handleProcess,
  ]);

  const columns = React.useMemo(
    () => getColumnsForTab(activeTab),
    [activeTab, getColumnsForTab]
  );

  return { columns };
};
