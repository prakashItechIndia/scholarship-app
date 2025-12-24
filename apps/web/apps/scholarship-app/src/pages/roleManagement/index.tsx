import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  Button,
  Modal,
  PageActionButtons,
} from "@shared/components";
import { Role } from "./types";
import { mockRoles } from "./constants";
import { useRoleTable } from "./hooks/useRoleTable";

const RoleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [roles, setRoles] = React.useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Sync roles to sessionStorage for validation in form
  React.useEffect(() => {
    sessionStorage.setItem("allRoles", JSON.stringify(roles));
  }, [roles]);

  // Check for saved role from form page
  React.useEffect(() => {
    const lastSavedRole = sessionStorage.getItem("lastSavedRole");
    const roleAction = sessionStorage.getItem("roleAction");
    
    if (lastSavedRole && roleAction) {
      const savedRole = JSON.parse(lastSavedRole) as Role;
      
      if (roleAction === "add") {
        // Add new role
        setRoles((prev) => [...prev, savedRole]);
      } else if (roleAction === "edit") {
        // Update existing role
        setRoles((prev) =>
          prev.map((role) => (role.id === savedRole.id ? savedRole : role))
        );
      }
      
      // Clear sessionStorage
      sessionStorage.removeItem("lastSavedRole");
      sessionStorage.removeItem("roleAction");
    }
  }, []);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return roles.slice(startIndex, endIndex);
  }, [roles, currentPage, pageSize]);

  // Get table columns
  const { columns } = useRoleTable({
    handleEdit: (item: Role) => {
      void navigate(`/role-management/edit/${item.id}`);
    },
    handleDelete: (item: Role) => {
      setSelectedRole(item);
      setDeleteError(null);
      setDeleteModalOpen(true);
    },
    selectedRows,
    onRowSelect: (item: Role, selected: boolean) => {
      const newSelected = new Set(selectedRows);
      if (selected) {
        newSelected.add(item.id);
      } else {
        newSelected.delete(item.id);
      }
      setSelectedRows(newSelected);
    },
    onSelectAll: (selected: boolean) => {
      if (selected) {
        const allIds = new Set(paginatedData.map(item => item.id));
        setSelectedRows(allIds);
      } else {
        setSelectedRows(new Set());
      }
    },
    data: paginatedData,
  });

  const totalItems = roles.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddRole = () => {
    void navigate("/role-management/add");
  };

  const handleDelete = () => {
    if (selectedRole) {
      // ROL-004: Check if role has assigned users (prevent deletion)
      // In a real app, this would check from API
      const hasAssignedUsers = false; // Mock: would check from API
      
      if (hasAssignedUsers) {
        setDeleteError("Cannot delete role. Users are currently assigned to this role.");
        return;
      }

      // Remove role from list
      setRoles(roles.filter((role) => role.id !== selectedRole.id));
      setDeleteModalOpen(false);
      setSelectedRole(null);
      setDeleteError(null);
      
      // Reset to page 1 if current page becomes empty
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };


  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
    }}>
      {/* Title and Action Buttons */}
      <div style={{ padding: "16px 24px 0px 24px" }}>
        <PageActionButtons
          title={
            <div style={{  }}>
              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#242424",
                // fontFamily: "'Inter', sans-serif",
                lineHeight: "22px",
              }}>
                Role and Permissions
              </div>
              <div style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
                marginTop: "2px",
                lineHeight: "22px",
              }}>
                Maintain Roles, Rights, and User Information
              </div>
            </div>
          }
          primaryButtonLabel="Add Role"
          onPrimaryAction={handleAddRole}
          onMoreClick={() => {
            // Handle more options click - can be extended later
            console.log("More options clicked");
          }}
        />
      </div>

      {/* Table Section - Full Width */}
      <DataTable
        columns={columns}
        data={paginatedData}
        fullWidth={true}
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showFirstLast: true,
          showPageSize: true,
          showPageNumbers: true,
          maxPageButtons: 7,
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Role"
        size={"md" as const}
        footer={
          <>
            <Button appearance="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={handleDelete}
              style={{ backgroundColor: "#c50f1f" }}
            >
              Delete
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Are you sure you want to delete this role?
          </p>
          {selectedRole && (
            <p style={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}>
              Role: {selectedRole.roleName}
            </p>
          )}
          {deleteError && (
            <p style={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "#dc2626",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}>
              {deleteError}
            </p>
          )}
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
            fontStyle: "italic",
          }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagementPage;

