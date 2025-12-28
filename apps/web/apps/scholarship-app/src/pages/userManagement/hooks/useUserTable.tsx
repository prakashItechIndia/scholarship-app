import * as React from "react";
import { User } from "../types";
import {
  MoreHorizontalRegular,
  PersonEditRegular,
  PersonDeleteRegular,
  ArrowSortRegular,
} from "@fluentui/react-icons";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";

interface UseUserTableProps {
  handleEdit: (item: User) => void;
  handleDelete: (item: User) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (item: User, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  data?: User[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (fieldName: string) => void;
}

export const useUserTable = ({
  handleEdit,
  handleDelete,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  data = [],
  sortBy,
  sortOrder,
  onSort,
}: UseUserTableProps) => {
  const columns = React.useMemo(() => {
    // Helper function to create sortable header
    const createSortableHeader = (name: string, fieldName: string) => {
      const isActive = sortBy === fieldName;
      const isAsc = isActive && sortOrder === 'asc';
      const isDesc = isActive && sortOrder === 'desc';
      
      return (
        <div 
          onClick={() => onSort?.(fieldName)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          <span style={{
            fontSize: "13px",
            lineHeight: "19px",
            fontWeight: 400,
            color: "#424242",
            fontFamily: "'Inter', sans-serif",
          }}>
            {name}
          </span>
          <ArrowSortRegular style={{ 
            width: "14px", 
            height: "14px", 
            color: isActive ? "#0f6cbd" : "#616161",
            transform: isDesc ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }} />
        </div>
      );
    };

    // Action column renderer
    const renderActions = (item: User) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <DropdownMenuItem
              icon={<PersonEditRegular style={{ width: "16px", height: "16px" }} />}
              label="Edit User Profile"
              onClick={() => handleEdit(item)}
            />
            <DropdownMenuItem
              icon={<PersonDeleteRegular style={{ width: "16px", height: "16px" }} />}
              label="Delete User Profile"
              onClick={() => handleDelete(item)}
              // className="hover:text-red-700"
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
          fontWeight: 600,
          color: status === "Active" ? "#107C10" : "#616161",
          backgroundColor: status === "Active" ? "#EBF9EB" : "#F0F0F0",
          border: `1px solid ${status === "Active" ? "#B3E0B3" : "#D1D1D1"}`,
          padding: "2px 24px",
          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
          display: "inline-block",
          textAlign: "center",
          minWidth: "80px",
        }}
      >
        {status}
      </span>
    );

    // Common text renderer
    const renderText = (value: string | undefined) => (
      <span style={{
        fontSize: "13px",
        lineHeight: "19px",
        color: "#242424",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
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
        onRenderHeader: () => createSortableHeader("Name", "name"),
        onRender: (item: User) => renderText(item.name),
      },
      {
        key: "userRole",
        name: "User Role",
        fieldName: "userRole",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Role", "userRole"),
        onRender: (item: User) => renderText(item.userRole),
      },
      {
        key: "userType",
        name: "User Type",
        fieldName: "userType",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Type", "userType"),
        onRender: (item: User) => renderText(item.userType),
      },
      {
        key: "mobileNumber",
        name: "Mobile Number",
        fieldName: "mobileNumber",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mobile Number", "mobileNumber"),
        onRender: (item: User) => renderText(item.mobileNumber),
      },
      {
        key: "emailId",
        name: "Email Id",
        fieldName: "emailId",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Email Id", "emailId"),
        onRender: (item: User) => renderText(item.emailId),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status", "status"),
        onRender: (item: User) => renderStatus(item.status),
      },
      {
        key: "actions",
        name: "",
        fieldName: "actions",
        minWidth: 80,
        maxWidth: 80,
        isSortable: false,
        onRender: renderActions,
      },
    ];
  }, [handleEdit, handleDelete, selectedRows, onRowSelect, onSelectAll, data, sortBy, sortOrder, onSort]);

  return { columns };
};

