import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableSkeleton,
  Button,
  Modal,
  Pagination,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import {
  MoreVerticalRegular,
  DocumentRegular as DocumentIcon,
  SearchRegular,
  FilterRegular,
} from "@fluentui/react-icons";
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [totalItems, setTotalItems] = React.useState(0);

  // Fetch roles from API with sorting and pagination
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await roleManagement.getAllRoles({
          sortBy,
          sortOrder,
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
        });
        
        // Handle both array response (backward compatible) and paginated response
        const data = Array.isArray(response) ? response : (response.data || response.items || []);
        const total = Array.isArray(response) ? response.length : (response.total || response.count || data.length);
        
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
        setTotalItems(total);
        // Sync roles to sessionStorage for validation in form
        sessionStorage.setItem("allRoles", JSON.stringify(mappedRoles));
      } catch (err) {
        showError('Failed to Load Roles', err instanceof Error ? err.message : 'Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };
    void fetchRoles();
  }, [showError, sortBy, sortOrder, currentPage, pageSize, searchQuery]);

  // Refresh roles after form save (check sessionStorage)
  React.useEffect(() => {
    const lastSavedRole = sessionStorage.getItem("lastSavedRole");
    const roleAction = sessionStorage.getItem("roleAction");
    
    if (lastSavedRole && roleAction) {
      // Reload roles from API instead of using sessionStorage
      const fetchRoles = async () => {
        try {
          const response = await roleManagement.getAllRoles({
            sortBy,
            sortOrder,
            page: currentPage,
            pageSize,
            search: searchQuery || undefined,
          });
          const data = Array.isArray(response) ? response : (response.data || response.items || []);
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
  }, [success, showError, sortBy, sortOrder, currentPage, pageSize, searchQuery]);

  // Reset to page 1 when search query or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  // Handle sort
  const handleSort = (fieldName: string) => {
    if (sortBy === fieldName) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortBy(fieldName);
      setSortOrder('asc');
    }
  };

  // Handle export
  const handleExport = async (format: 'excel' | 'word') => {
    try {
      setLoading(true);
      const blob = await roleManagement.exportRoles(format, {
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      });

      const extension = format === 'excel' ? 'xlsx' : 'docx';
      const filename = `Roles_Export_${new Date().toISOString().split('T')[0]}.${extension}`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      success('Export Successful', `Roles exported as ${filename} successfully`);
    } catch (err) {
      showError('Export Failed', err instanceof Error ? err.message : 'Failed to export roles');
    } finally {
      setLoading(false);
    }
  };

  // Use roles directly from API (already paginated and sorted on backend)
  const paginatedData = roles;

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
    sortBy,
    sortOrder,
    onSort: handleSort,
  });

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
      backgroundColor: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Title and Action Section */}
      <div style={{ padding: "24px 1.5rem", flexShrink: 0 }}>
        {/* Top Row: Title on left, Add Role button on right */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{
              fontSize: "16px",
              lineHeight: "22px",
              fontWeight: 600,
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
            }}>
              Role and Permissions
            </h1>
            <p style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 400,
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
            }}>
              Maintain Roles, Rights, and User Information
            </p>
          </div>
          <Button
            onClick={handleAddRole}
            style={{
              backgroundColor: "#2453C3",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              height: "32px",
            }}
          >
            Add Role
          </Button>
        </div>

        {/* Second Row: Search on left, Action buttons on right */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
        }}>
          {/* Search field on the left */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", border: "1px solid #D1D1D1", borderRadius: "8px" }}>
            <SearchRegular style={{ 
              position: "absolute", 
              left: "8px", 
              width: "16px", 
              height: "16px", 
              color: "#616161",
              pointerEvents: "none"
            }} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              style={{
                width: "200px",
                height: "32px",
                paddingLeft: "32px",
                paddingRight: "12px",
                borderRadius: "8px",
                border: "1px solid #FFFFFF00",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {/* Action buttons on the right */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="outline"
                  aria-label="More options"
                  style={{
                    width: "32px",
                    minWidth: "32px",
                    maxWidth: "32px",
                    height: "32px",
                    padding: 0,
                    borderColor: "#d1d5db",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <MoreVerticalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => void handleExport('excel')}
                  style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DocumentIcon style={{ width: "16px", height: "16px" }} />
                    Excel
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => void handleExport('word')}
                  style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DocumentIcon style={{ width: "16px", height: "16px" }} />
                    Word
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  appearance="outline"
                  aria-label="Filter"
                  style={{
                    width: "32px",
                    minWidth: "32px",
                    maxWidth: "32px",
                    height: "32px",
                    padding: 0,
                    borderColor: "#d1d5db",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <FilterRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => {}}
                  style={{
                    fontWeight: "normal",
                    color: "#616161",
                  }}
                >
                  Role Name
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {}}
                  style={{
                    fontWeight: "normal",
                    color: "#616161",
                  }}
                >
                  User Type
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {}}
                  style={{
                    fontWeight: "normal",
                    color: "#616161",
                  }}
                >
                  Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div
        id="table-scroll-container"
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
          overflow: "auto",
          backgroundColor: "#fafafa",
          minHeight: 0,
          maxHeight: "100%",
        }}
        className="custom-scrollbar"
        onScroll={(e) => {
          // Sync horizontal scroll with footer scrollbar
          const footerScroll = document.getElementById('footer-scroll-sync');
          if (footerScroll) {
            footerScroll.scrollLeft = e.currentTarget.scrollLeft;
          }
        }}
      >
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #d1d1d1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #a8a8a8;
            }
            .footer-scrollbar::-webkit-scrollbar {
              height: 8px;
            }
            .footer-scrollbar::-webkit-scrollbar-track {
              background: #f5f5f5;
            }
            .footer-scrollbar::-webkit-scrollbar-thumb {
              background-color: #d1d1d1;
              border-radius: 4px;
            }
            .footer-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #a8a8a8;
            }
          `}
        </style>

        <div style={{ minWidth: "fit-content" }}>
          {loading ? (
            <TableSkeleton
              columnCount={3}
              rowCount={5}
              columnWidths={[300, 200, 150]}
              showCheckbox={true}
            />
          ) : (
            <Table
              columns={columns}
              data={paginatedData}
              disableScroll={true}
            />
          )}
        </div>
      </div>

      {/* Static Footer with Pagination and Horizontal Scrollbar */}
      <div style={{
        flexShrink: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
      }}>
        {/* Pagination */}
        {!loading && (
          <div style={{
            padding: "12px 24px",
            backgroundColor: "#FAFAFA",
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
              }}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              showFirstLast={true}
              showPageSize={true}
              showPageNumbers={true}
              maxPageButtons={7}
              className="w-full !flex-row"
            />
          </div>
        )}

        {/* Horizontal Scrollbar Sync */}
        <div
          id="footer-scroll-sync"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            height: "12px",
          }}
          className="footer-scrollbar"
          onScroll={(e) => {
            // Sync scroll with table container
            const tableContainer = document.getElementById('table-scroll-container');
            if (tableContainer) {
              tableContainer.scrollLeft = e.currentTarget.scrollLeft;
            }
          }}
        >
          <div style={{
            height: "1px",
            width: "fit-content",
            minWidth: "100%",
          }}
            ref={(el) => {
              // Match the width of the table content
              if (el) {
                const tableContainer = document.getElementById('table-scroll-container');
                if (tableContainer && tableContainer.firstChild) {
                  const tableWidth = (tableContainer.firstChild as HTMLElement).scrollWidth;
                  el.style.width = `${tableWidth}px`;
                }
              }
            }}
          />
        </div>
      </div>

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

