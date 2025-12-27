import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  TableSkeleton,
  Button,
  Modal,
  PageActionButtons,
  Card,
} from "@shared/components";
import { Role } from "./types";
import { useRoleTable } from "./hooks/useRoleTable";
import { roleManagement } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

const RoleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Fetch roles from API
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await roleManagement.getAllRoles();
        // Map API response to Role interface
        // Filter out "Student" role (case-insensitive) as it's for user flow, not admin flow
        const mappedRoles: Role[] = data
          ?.filter((role: { roleName: string }) => 
            role.roleName?.toLowerCase() !== 'student'
          )
          ?.map((role: {
          id: string | number;
          roleName: string;
          userType: string;
          status: string;
          isActive: number;
        }) => ({
          id: String(role.id),
          roleName: role.roleName,
          userType: role.userType,
          status: role.status,
          roleType: role.userType.toLowerCase().replace(' ', ''),
          description: '',
          permissions: [],
        }));
        setRoles(mappedRoles);
        // Sync roles to sessionStorage for validation in form
        sessionStorage.setItem("allRoles", JSON.stringify(mappedRoles));
      } catch (err) {
        showError('Failed to Load Roles', err instanceof Error ? err.message : 'Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };
    void fetchRoles();
  }, [showError]);

  // Refresh roles after form save (check sessionStorage)
  React.useEffect(() => {
    const lastSavedRole = sessionStorage.getItem("lastSavedRole");
    const roleAction = sessionStorage.getItem("roleAction");
    
    if (lastSavedRole && roleAction) {
      // Reload roles from API instead of using sessionStorage
      const fetchRoles = async () => {
        try {
          const data = await roleManagement.getAllRoles();
          // Filter out "Student" role (case-insensitive) as it's for user flow, not admin flow
          const mappedRoles: Role[] = data
            ?.filter((role: { roleName: string }) => 
              role.roleName?.toLowerCase() !== 'student'
            )
            ?.map((role: {
            id: string | number;
            roleName: string;
            userType: string;
            status: string;
            isActive: number;
          }) => ({
            id: String(role.id),
            roleName: role.roleName,
            userType: role.userType,
            status: role.status,
            roleType: role.userType.toLowerCase().replace(' ', ''),
            description: '',
            permissions: [],
          }));
          setRoles(mappedRoles);
          sessionStorage.setItem("allRoles", JSON.stringify(mappedRoles));
          success('Success', roleAction === 'add' ? 'Role created successfully' : 'Role updated successfully');
        } catch (err) {
          showError('Failed to Refresh', err instanceof Error ? err.message : 'Failed to refresh roles');
        }
      };
      void fetchRoles();
      
      // Clear sessionStorage
      sessionStorage.removeItem("lastSavedRole");
      sessionStorage.removeItem("roleAction");
    }
  }, [success, showError]);

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
        const allIds = new Set(paginatedData?.map(item => item.id));
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

  const handleDelete = async () => {
    if (selectedRole) {
      try {
        setDeleteError(null);
        const roleId = parseInt(selectedRole.id, 10);
        
        // ROL-004: Check if role has assigned users (prevent deletion)
        const checkResult = await roleManagement.checkRoleHasUsers(roleId);
        if (checkResult.hasUsers) {
          setDeleteError("Cannot delete role. Users are currently assigned to this role.");
          return;
        }

        // Delete role via API
        await roleManagement.deleteRole(roleId);
        
        // Remove role from list
        setRoles(roles.filter((role) => role.id !== selectedRole.id));
        setDeleteModalOpen(false);
        setSelectedRole(null);
        setDeleteError(null);
        success('Success', 'Role deleted successfully');
        
        // Reset to page 1 if current page becomes empty
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete role';
        setDeleteError(errorMessage);
        showError('Delete Failed', errorMessage);
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
      {loading ? (
        <Card
          variant="elevated"
          style={{
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            borderRadius: 0,
            width: "100%",
            margin: 0,
            padding: "24px",
            boxShadow: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <div style={{ overflowX: "auto", width: "100%" }}>
            <TableSkeleton
              columnCount={3}
              rowCount={5}
              columnWidths={[300, 200, 150]}
              showCheckbox={true}
            />
          </div>
        </Card>
      ) : (
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
      )}

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

