import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Pagination,
  Button,
  Card,
  Modal,
  Search,
} from "@shared/components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowDownloadRegular,
  MoreVerticalRegular,
} from "@fluentui/react-icons";
import { User } from "./types";
import { mockUsers } from "./constants";
import { useUserTable } from "./hooks/useUserTable";

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");

  // Sync users to sessionStorage for validation in form
  React.useEffect(() => {
    sessionStorage.setItem("allUsers", JSON.stringify(users));
  }, [users]);

  // Check for saved user from form page
  React.useEffect(() => {
    const lastSavedUser = sessionStorage.getItem("lastSavedUser");
    const userAction = sessionStorage.getItem("userAction");
    
    if (lastSavedUser && userAction) {
      const savedUser = JSON.parse(lastSavedUser) as User;
      
      if (userAction === "add") {
        // Add new user
        setUsers((prev) => [...prev, savedUser]);
      } else if (userAction === "edit") {
        // Update existing user
        setUsers((prev) =>
          prev.map((user) => (user.id === savedUser.id ? savedUser : user))
        );
      }
      
      // Clear sessionStorage
      sessionStorage.removeItem("lastSavedUser");
      sessionStorage.removeItem("userAction");
    }
  }, []);

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
        const allIds = new Set(paginatedData.map(item => item.id));
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

  const handleDelete = () => {
    if (selectedUser) {
      // USR-004: Deactivated users shall be retained in system for audit purposes
      // Instead of deleting, set status to Inactive
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, status: "Inactive" as const } : user
        )
      );
      setDeleteModalOpen(false);
      setSelectedUser(null);
      
      // Reset to page 1 if current page becomes empty
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    // Refresh users list - in real app, this would fetch from API
    setUsers([...mockUsers]);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleExport = () => {
    // Export functionality - in real app, this would export to CSV/Excel
    console.log("Exporting users...", filteredUsers);
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Title Section */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 700,
          color: "#242424",
          marginBottom: "8px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Manage User - Maintain Roles, Rights, and User Information
        </h1>
      </div>

      {/* Search and Action Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "16px",
      }}>
        <div style={{ width: "300px" }}>
          <Search
            searchPlaceHolder="Search users..."
            searchValue={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <Button
            appearance="primary"
            onClick={handleAddUser}
            style={{
              backgroundColor: "#0f6cbd",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AddRegular style={{ width: "16px", height: "16px" }} />
            Add User
          </Button>
          <Button
            appearance="subtle"
            onClick={handleExport}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowDownloadRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
            Export
          </Button>
          <Button
            appearance="subtle"
            onClick={handleRefresh}
            aria-label="Refresh"
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
            }}
          >
            <ArrowClockwiseRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </Button>
          <Button
            appearance="subtle"
            aria-label="More options"
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
            }}
          >
            <MoreVerticalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card variant="elevated" style={{
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
      }}>
        <div style={{ overflowX: "auto" }}>
          <Table columns={columns} data={paginatedData} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: "16px",
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              showFirstLast={true}
              showPageSize={true}
              showPageNumbers={true}
              maxPageButtons={7}
            />
          </div>
        )}
      </Card>

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

