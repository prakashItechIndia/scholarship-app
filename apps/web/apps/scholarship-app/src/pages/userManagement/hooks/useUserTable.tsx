import * as React from "react";
import { User } from "../types";
import {
  MoreVerticalRegular,
  ArrowUp20Regular,
  ArrowDown20Regular,
  EditRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";

interface UseUserTableProps {
  handleEdit: (item: User) => void;
  handleDelete: (item: User) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (item: User, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  data?: User[];
}

export const useUserTable = ({
  handleEdit,
  handleDelete,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  data = [],
}: UseUserTableProps) => {
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
    const renderActions = (item: User) => (
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
              <MoreVerticalRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              icon={<EditRegular style={{ width: "16px", height: "16px" }} />}
              label="Edit User Profile"
              onClick={() => handleEdit(item)}
            />
            <DropdownMenuItem
              icon={<DeleteRegular style={{ width: "16px", height: "16px" }} />}
              label="Delete User Profile"
              onClick={() => handleDelete(item)}
              style={{ color: "#c50f1f" }}
              className="hover:text-red-700"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    // Status badge renderer
    const renderStatus = (status: string) => (
      <span
        style={{
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 500,
          color: status === "Active" ? "#16a34a" : "#dc2626",
          backgroundColor: status === "Active" ? "#dcfce7" : "#fee2e2",
          padding: "4px 12px",
          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
          display: "inline-block",
        }}
      >
        {status}
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

    return [
      {
        key: "checkbox",
        name: "",
        fieldName: "checkbox",
        minWidth: 48,
        maxWidth: 48,
        isSortable: false,
        onRender: (item?: User) => (
          <input
            type="checkbox"
            checked={item ? selectedRows.has(item.id) : false}
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
        key: "name",
        name: "Name",
        fieldName: "name",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Name"),
        onRender: (item: User) => renderText(item.name),
      },
      {
        key: "userRole",
        name: "User Role",
        fieldName: "userRole",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Role"),
        onRender: (item: User) => renderText(item.userRole),
      },
      {
        key: "userType",
        name: "User Type",
        fieldName: "userType",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Type"),
        onRender: (item: User) => renderText(item.userType),
      },
      {
        key: "mobileNumber",
        name: "Mobile Number",
        fieldName: "mobileNumber",
        minWidth: 150,
        isSortable: false,
        onRender: (item: User) => renderText(item.mobileNumber),
      },
      {
        key: "emailId",
        name: "Email Id",
        fieldName: "emailId",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Email Id"),
        onRender: (item: User) => renderText(item.emailId),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status"),
        onRender: (item: User) => renderStatus(item.status),
      },
      {
        key: "actions",
        name: "Actions",
        fieldName: "actions",
        minWidth: 80,
        maxWidth: 80,
        isSortable: false,
        onRender: renderActions,
      },
    ];
  }, [handleEdit, handleDelete, selectedRows, onRowSelect, onSelectAll, data]);

  return { columns };
};

