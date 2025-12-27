import * as React from "react";
import { Role } from "../types";
import {
  MoreHorizontalRegular,
  ArrowSortRegular,
  PersonEditRegular,
  PersonDeleteRegular,
} from "@fluentui/react-icons";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";

interface UseRoleTableProps {
  handleEdit: (item: Role) => void;
  handleDelete: (item: Role) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (item: Role, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  data?: Role[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (fieldName: string) => void;
}

// Export functions for edit and delete actions
export const handleEditRole = (item: Role, onEdit: (item: Role) => void) => {
  onEdit(item);
};

export const handleDeleteRole = (item: Role, onDelete: (item: Role) => void) => {
  onDelete(item);
};

// Export function for sortable header with ArrowSortRegular icon
export const renderSortableHeader = (
  name: string,
  fieldName: string,
  currentSortBy?: string,
  currentSortOrder?: 'asc' | 'desc',
  onSort?: (fieldName: string) => void
) => {
  const isActive = currentSortBy === fieldName;
  const isAsc = isActive && currentSortOrder === 'asc';
  const isDesc = isActive && currentSortOrder === 'desc';
  
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
        lineHeight: "20px",
        fontWeight: 600,
        color: "#424242",
        fontFamily: "'Inter', sans-serif",
      }}>
        {name}
      </span>
      <ArrowSortRegular style={{ 
        width: "16px", 
        height: "16px", 
        color: isActive ? "#0f6cbd" : "#616161",
        transform: isDesc ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
      }} />
    </div>
  );
};

export const useRoleTable = ({
  handleEdit,
  handleDelete,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  data = [],
  sortBy,
  sortOrder,
  onSort,
}: UseRoleTableProps) => {
  const columns = React.useMemo(() => {
    // Helper function to create sortable header
    const createSortableHeader = (name: string, fieldName: string) => 
      renderSortableHeader(name, fieldName, sortBy, sortOrder, onSort);

    // Action column renderer
    const renderActions = (item: Role) => (
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
              label="Edit Role"
              onClick={() => handleEditRole(item, handleEdit)}
            />
            <DropdownMenuItem
              icon={<PersonDeleteRegular style={{ width: "16px", height: "16px" }} />}
              label="Delete Role"
              onClick={() => handleDeleteRole(item, handleDelete)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    // Status badge renderer
    const renderStatus = (status: string) => {
      debugger
      return  <div
        style={{
          fontSize: "10px",
          lineHeight: "16px",
          fontWeight: "semi-bold",
          color: status === "Active" ? "#107C10" : "#616161",
          backgroundColor: status === "Active" ? "#EBF9EB" : "#F0F0F0",
          border: `1px solid ${status === "Active" ? "#B3E0B3" : "#D1D1D1"}`,
          padding: "4px 30px",
          borderRadius: "12px",
          display: "inline-block",
        }}
      >
        {status}
      </div>
    }

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
        width: 200,
        minWidth: 200,
        maxWidth: 200,
        cellPaddingLeft: 40,
        cellPaddingRight: 8,
        isSortable: false,
        onRender: (item?: Role) => (
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
        key: "roleName",
        name: "User Role",
        fieldName: "roleName",
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        cellPaddingLeft: 8,
        cellPaddingRight: 8,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Role", "roleName"),
        onRender: (item: Role) => renderText(item.roleName),
      },
      {
        key: "roleType",
        name: "User Type",
        fieldName: "roleType",
        width: 250,
        minWidth: 250,
        maxWidth: 250,
        cellPaddingLeft: 8,
        cellPaddingRight: 8,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("User Type", "roleType"),
        onRender: (item: Role) => renderText(item.roleType),
      },
      // {
      //   key: "description",
      //   name: "Description",
      //   fieldName: "description",
      //   minWidth: 250,
      //   isSortable: false,
      //   onRender: (item: Role) => renderText(item.description),
      // },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        width: 200,
        minWidth: 200,
        maxWidth: 200,
        cellPaddingLeft: 8,
        cellPaddingRight: 8,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status", "status"),
        onRender: (item: Role) => renderStatus(item.status),
      },
      {
        key: "actions",
        name: "",
        fieldName: "actions",
        width: 80,
        minWidth: 80,
        maxWidth: 80,
        cellPaddingLeft: 8,
        cellPaddingRight: 8,
        isSortable: false,
        onRender: renderActions,
      },
      {
        key: "spacer",
        name: "",
        fieldName: "spacer",
        width: "auto",
        minWidth: 100,
        cellPaddingLeft: 0,
        cellPaddingRight: 0,
        isSortable: false,
        onRender: () => <span></span>,
      },
    ];
  }, [handleEdit, handleDelete, selectedRows, onRowSelect, onSelectAll, data, sortBy, sortOrder, onSort]);

  return { columns };
};

