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
  FilterRegular,
  MoreVerticalRegular,
  SearchRegular,
  ChevronDownRegular,
  ArrowDownloadRegular,
  DocumentRegular as DocumentIcon,
} from "@fluentui/react-icons";
import { User } from "./types";
import { useUserTable } from "./hooks/useUserTable";
import { userManagement } from "../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch users from API
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userManagement.getAllUsers();
        // Map API response to User interface
        // Helper function to map role to user type
        const getuserTypeFromRole = (roleName: string): "Administrator" | "Manager" | "Standard User" => {
          const adminRoles = ['CEO', 'Super Admin', 'Supreme Admin', 'Document Super Admin'];
          const managerRoles = ['Scholarship Admin', 'Document Admin'];
          
          if (adminRoles.some(adminRole => roleName.toLowerCase().includes(adminRole.toLowerCase()))) {
            return 'Administrator';
          }
          if (managerRoles.some(managerRole => roleName.toLowerCase().includes(managerRole.toLowerCase()))) {
            return 'Manager';
          }
          return 'Standard User';
        };

        // Filter out users with "Student" role (case-insensitive) as they are for user flow, not admin flow
        const mappedUsers: User[] = data
          ?.filter((user: { Role_Name: string }) => 
            user.Role_Name?.toLowerCase() !== 'student'
          )
          ?.map((user: {
          ID: number;
          User_ID: string;
          User_Name: string;
          Role_Name: string;
          Role_Id: number;
          Mobile_Number: string;
          EMail_Id: string;
          ActiveStatus: string;
        }) => ({
          id: user.User_ID,
          name: user.User_Name || user.User_ID,
          userRole: user.Role_Name || '',
          userType: getuserTypeFromRole(user.Role_Name || ''),
          mobileNumber: user.Mobile_Number || '',
          emailId: user.EMail_Id || user.User_ID,
          status: user.ActiveStatus === 'Active' ? 'Active' : 'Inactive',
        }));
        setUsers(mappedUsers);
        // Sync users to sessionStorage for validation in form
        sessionStorage.setItem("allUsers", JSON.stringify(mappedUsers));
      } catch (err) {
        showError('Failed to Load Users', err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    void fetchUsers();
  }, [showError]);

  // Refresh users after form save (check sessionStorage)
  React.useEffect(() => {
    const userAction = sessionStorage.getItem("userAction");
    
    if (userAction) {
      // Reload users from API instead of using sessionStorage
      const fetchUsers = async () => {
        try {
          const data = await userManagement.getAllUsers();
          // Helper function to map role to user type
          const getuserTypeFromRole = (roleName: string): "Administrator" | "Manager" | "Standard User" => {
            const adminRoles = ['CEO', 'Super Admin', 'Supreme Admin', 'Document Super Admin'];
            const managerRoles = ['Scholarship Admin', 'Document Admin'];
            
            if (adminRoles.some(adminRole => roleName.toLowerCase().includes(adminRole.toLowerCase()))) {
              return 'Administrator';
            }
            if (managerRoles.some(managerRole => roleName.toLowerCase().includes(managerRole.toLowerCase()))) {
              return 'Manager';
            }
            return 'Standard User';
          };

          // Filter out users with "Student" role (case-insensitive) as they are for user flow, not admin flow
          const mappedUsers: User[] = data
            ?.filter((user: { Role_Name: string }) => 
              user.Role_Name?.toLowerCase() !== 'student'
            )
            ?.map((user: {
            ID: number;
            User_ID: string;
            User_Name: string;
            Role_Name: string;
            Role_Id: number;
            Mobile_Number: string;
            EMail_Id: string;
            ActiveStatus: string;
          }) => ({
            id: user.User_ID,
            name: user.User_Name || user.User_ID,
            userRole: user.Role_Name || '',
            userType: getuserTypeFromRole(user.Role_Name || ''),
            mobileNumber: user.Mobile_Number || '',
            emailId: user.EMail_Id || user.User_ID,
            status: user.ActiveStatus === 'Active' ? 'Active' : 'Inactive',
          }));
          setUsers(mappedUsers);
          sessionStorage.setItem("allUsers", JSON.stringify(mappedUsers));
          success('Success', userAction === 'add' ? 'User created successfully' : 'User updated successfully');
        } catch (err) {
          showError('Failed to Refresh', err instanceof Error ? err.message : 'Failed to refresh users');
        }
      };
      void fetchUsers();
      
      // Clear sessionStorage
      sessionStorage.removeItem("lastSavedUser");
      sessionStorage.removeItem("userAction");
    }
  }, [success, showError]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }
    const query = searchQuery.toLowerCase();
    return users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [users, searchQuery]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  // Get table columns
  const { columns } = useUserTable({
    handleEdit: (item: User) => {
      void navigate(`/user-management/edit/${item.id}`);
    },
    handleDelete: (item: User) => {
      setSelectedUser(item);
      setDeleteModalOpen(true);
    },
    selectedRows,
    onRowSelect: (item: User, selected: boolean) => {
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

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddUser = () => {
    void navigate("/user-management/add");
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        // USR-004: Deactivated users shall be retained in system for audit purposes
        // Delete user via API (sets IsDeleted = 1)
        await userManagement.deleteUser(selectedUser.id);
        
        // Remove user from list
        setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
        setDeleteModalOpen(false);
        setSelectedUser(null);
        success('Success', 'User deleted successfully');
        
        // Reset to page 1 if current page becomes empty
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
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
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Title and Action Section */}
      <div style={{ padding: "24px 1.5rem", flexShrink: 0 }}>
        {/* Top Row: Title on left, Add User button on right */}
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
              Manage User
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
            onClick={handleAddUser}
            style={{
              backgroundColor: "#0f6cbd",
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
            Add User
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
                  onClick={() => {}}
                  style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DocumentIcon style={{ width: "16px", height: "16px" }} />
                    Excel
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {}}
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
                  Name
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
                  User Name
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {}}
                  style={{
                    fontWeight: "normal",
                    color: "#616161",
                  }}
                >
                  Mobile Number
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {}}
                  style={{
                    fontWeight: "normal",
                    color: "#616161",
                  }}
                >
                  Email ID
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
              columnCount={6}
              rowCount={5}
              columnWidths={[150, 180, 150, 150, 150, 120]}
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
        title="Delete User Profile"
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
            Are you sure you want to delete this user profile?
          </p>
          {selectedUser && (
            <>
              <p style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}>
                User: {selectedUser.name}
              </p>
              <p style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Email: {selectedUser.emailId}
              </p>
            </>
          )}
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
            fontStyle: "italic",
          }}>
            Note: User will be deactivated (status set to Inactive) and retained for audit purposes.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;

