import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  TableSkeleton,
  Button,
  Modal,
  Input,
  PageActionButtons,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Card,
} from "@shared/components";
import {
  Filter24Regular,
  MoreVerticalRegular,
  Search20Regular,
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
      backgroundColor: "#fafafa",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
    }}>
      {/* Title and Action Buttons */}
      <div style={{ padding: "24px 24px 0px 24px" }}>
        <PageActionButtons
          title={
            <div style={{ lineHeight: "1.2" }}>
              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                Manage User
              </div>
              <div style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
                marginTop: "4px",
              }}>
                Maintain Roles, Rights, and User Information
              </div>
            </div>
          }
          primaryButtonLabel="Add User"
          onPrimaryAction={handleAddUser}
        />
      </div>

      {/* Search and Filter Section */}
      <div style={{
        padding: "0 24px 16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // gap: "20px",
      }}>
        <div style={{ border:"#D1D1D1",height:"32px",width:"216px",marginBottom:"4px" }}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search20Regular style={{ width: "18px", height: "15px", color: "#707070" }} />}
            style={{
              
              // paddingLeft: "10px",
              // marginBottom: "40px",
              height:"35px",
              borderRadius:"8px"
            }}
          />
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <Button
            appearance="subtle"
            aria-label="More options"
            style={{
              width: "20px",
              height: "20px",
              minHeight: "35px",
              minWidth: "35px",
              padding: 0,
              border: "1px solid #e0e0e0",
            }}
          >
            <MoreVerticalRegular style={{ width: "16px", height: "16px", color: "#242424  " }} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                appearance="subtle"
                aria-label="Filter options"
                style={{
                  width: "28px",
                  height: "28px",
                  padding: 0,
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "35px",
                  minWidth: "35px",
                }}
              >
                <Filter24Regular width={16} height={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem label="Name" />
              <DropdownMenuItem label="User Type" />
              <DropdownMenuItem label="User Name" />
              <DropdownMenuItem label="Mobile Number" />
              <DropdownMenuItem label="Email ID" />
              <DropdownMenuItem label="Status" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              columnCount={6}
              rowCount={5}
              columnWidths={[150, 180, 150, 150, 150, 120]}
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

