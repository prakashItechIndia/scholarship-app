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
}

// Export functions for edit and delete actions
export const handleEditRole = (item: Role, onEdit: (item: Role) => void) => {
  onEdit(item);
};

export const handleDeleteRole = (item: Role, onDelete: (item: Role) => void) => {
  onDelete(item);
};

// Export function for sortable header with ArrowSortRegular icon
export const renderSortableHeader = (name: string) => (
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
    <ArrowSortRegular style={{ width: "16px", height: "16px", color: "#616161" }} />
  </div>
);

export const useRoleTable = ({
  handleEdit,
  handleDelete,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  data = [],
}: UseRoleTableProps) => {
  const columns = React.useMemo(() => {
    // Helper function to create sortable header
    const createSortableHeader = (name: string) => renderSortableHeader(name);

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
          color: status?.toLowerCase() === "active" ? "#0E700E !important" : "#616161",
          backgroundColor: status?.toLowerCase() === "active" ? "#9FD89F" : "#F0F0F0",
          padding: "4px 30px",
          borderRadius: "12px",
          display: "inline-block",
          border: status?.toLowerCase() === "active" ? "1px solid #0E700E" : "1px solid #E0E0E0",
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
        onRenderHeader: () => createSortableHeader("User Role"),
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
        onRenderHeader: () => createSortableHeader("User Type"),
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
        onRenderHeader: () => createSortableHeader("Status"),
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
  }, [handleEdit, handleDelete, selectedRows, onRowSelect, onSelectAll, data]);

  return { columns };
};

