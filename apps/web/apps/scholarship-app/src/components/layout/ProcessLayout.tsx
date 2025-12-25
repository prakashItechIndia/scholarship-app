import {
    HomeRegular,
    PersonRegular,
    QuestionCircleRegular,
    SearchRegular,
    SettingsRegular,
    LockClosedRegular,
    DismissRegular,
    TaskListSquareAdd24Regular,
    PeopleTeam24Regular,
    DocumentDataRegular,
    DocumentOnePageSparkleRegular,
    AlertBadgeRegular,
    ArrowExit24Regular,
    KeyRegular,
} from "@fluentui/react-icons";
import { Button, TopNavProps, Popover, PopoverTrigger, PopoverContent, Modal } from "@shared/components";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarLogo } from "../common";
import { ProfilePopover } from "../common/ProfilePopover";
import { PageLayout, SideNavConfig } from "./PageLayout";
import { usePermissions } from "../../contexts/PermissionContext";

interface ProcessLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

interface ScholarshipUser {
  userId?: number;
  userName?: string;
  userType?: string;
  roleId?: number;
  [key: string]: unknown;
}

interface ScholarshipAuthData {
  email: string;
  cardcode?: string;
  rememberMe?: boolean;
  timestamp?: number;
  user?: ScholarshipUser;
}

export const ProcessLayout: React.FC<ProcessLayoutProps> = ({ children, hideSidebar = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
  const [settingsPopoverOpen, setSettingsPopoverOpen] = React.useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<ScholarshipAuthData | null>(null);

  // Get user data from localStorage
  React.useEffect(() => {
    const loadUserData = () => {
      try {
        const authData = localStorage.getItem('scholarship_auth');
        if (authData) {
          const parsed = JSON.parse(authData) as ScholarshipAuthData;
          setUserData(parsed);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
    // Listen for storage changes (e.g., when user logs in from another tab)
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  // Get user name and role from user data
  const userName = userData?.user?.userName || userData?.email || 'User';
  const userRole = userData?.user?.userType || 'User';
  
  // Get permissions
  const { hasPermission } = usePermissions();

  // Define all menu items with their screen URLs
  const allMenuItems = [
      {
        icon: <HomeRegular className="w-5 h-5" />,
        label: "Home",
        screenUrl: "/home",
        path: "/home",
        active: location.pathname === "/home" || location.pathname === "/admin-dashboard",
        onClick: () => { void navigate("/home"); },
      },
      {
        icon: <DocumentOnePageSparkleRegular  className="w-5 h-5" />,
        label: "Process",
        screenUrl: "/process",
        path: "/process",
        active: location.pathname === "/process",
        onClick: () => { void navigate("/process"); },
      },
      {
        icon: <TaskListSquareAdd24Regular className="w-5 h-5" />,
        label: "Roles",
        screenUrl: "/role-management",
        path: "/role-management",
        active: location.pathname === "/role-management",
        onClick: () => { void navigate("/role-management"); },
      },
      {
        icon: <PeopleTeam24Regular className="w-5 h-5" />,
        label: "Users",
        screenUrl: "/user-management",
        path: "/user-management",
        active: location.pathname === "/user-management",
        onClick: () => { void navigate("/user-management"); },
      },
      {
        icon: <DocumentDataRegular className="w-5 h-5" />,
        label: "Reports",
        screenUrl: "/reports",
        path: "/reports",
        active: location.pathname === "/reports",
        onClick: () => { void navigate("/reports"); },
      },
    ];

  // Filter menu items based on permissions
  // If no permissions loaded yet, show all items (will be filtered once permissions load)
  const filteredMenuItems = allMenuItems.filter(item => {
    // If permissions are not loaded, show item (will be hidden once permissions load)
    // Otherwise, check if user has permission for this screen
    // return hasPermission(item.screenUrl);
    return true;
  });

  const sideNavConfig: SideNavConfig = {
    // logo,
    expanded: false,
    items: filteredMenuItems,
    footerItems: [
      {
        icon: <QuestionCircleRegular className="w-5 h-5" />,
        label: "Help",
        active: location.pathname === "/help",
        onClick: () => { void navigate("/help"); },
      },
      {
        icon: (
          <ProfilePopover
            userName={userName}
            userRole={userRole}
            open={settingsPopoverOpen}
            onOpenChange={setSettingsPopoverOpen}
            onLogout={() => setLogoutModalOpen(true)}
          >
            <SettingsRegular className="w-5 h-5" />
          </ProfilePopover>
        ),
        label: "Settings",
        active: location.pathname === "/settings",
        onClick: () => { setSettingsPopoverOpen(true); },
      },
    ],
  };

  // Handle logout
  const handleLogout = () => {
    // Clear scholarship auth data
    localStorage.removeItem('scholarship_auth');
    localStorage.removeItem('scholarship_session_token');
    sessionStorage.removeItem('scholarship_session_token');
    sessionStorage.removeItem('scholarship_auth');
    
    // Redirect to sign in
    void navigate('/user-login');
  };

  const topNavConfig: TopNavProps = {
    left: <NavbarLogo />,
    right: (
      <div className="flex items-center gap-6">
        <div
          onClick={() => console.log("Search clicked")}
          aria-label="Search"
        >
          <SearchRegular className="w-5 h-5 text-gray-600" />
        </div>
        <div
          onClick={() => console.log("Notifications clicked")}
        >
          <AlertBadgeRegular className="w-5 h-5 text-gray-600" />
        </div>
        {/* Vertical separator */}
        <div className="h-6 w-px bg-gray-300"></div>
        <ProfilePopover
          userName={userName}
          userRole={userRole}
          open={profilePopoverOpen}
          onOpenChange={setProfilePopoverOpen}
          onLogout={() => setLogoutModalOpen(true)}
        >
          <div className="w-9 h-9 rounded-full bg-[#C8D1FA] flex items-center justify-center cursor-pointer">
            <PersonRegular className="w-5 h-5 text-[#2C3C85]" />
          </div>
        </ProfilePopover>
      </div>
    ),
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  return (
    <>
      <PageLayout 
        sideNav={hideSidebar ? null : sideNavConfig} 
        topNav={topNavConfig}
        contentClassName={hideSidebar ? "p-0" : undefined}
      >
        {children}
      </PageLayout>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        size="sm"
        className="max-w-md"
        title={
          <div 
            className="relative w-full flex items-center justify-between"
            style={{
              padding: "20px 24px 16px 24px",
            }}
          >
            <span 
              style={{
                fontSize: "18px",
                lineHeight: "24px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Logout
            </span>
            <Button
              variant="ghost"
              onClick={() => setLogoutModalOpen(false)}
              style={{
                width: "32px",
                height: "32px",
                padding: 0,
                minWidth: "auto",
                backgroundColor: "transparent",
                border: "none",
              }}
              className="hover:bg-gray-100 rounded"
              aria-label="Close"
            >
              <DismissRegular className="w-5 h-5" style={{ color: "#707070" }} />
            </Button>
          </div>
        }
        footer={
          <div 
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 0,
              padding: 0,
            }}
          >
            <Button
              variant="default"
              onClick={handleLogoutConfirm}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#2453C3",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Logout
            </Button>
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#ffffff",
                color: "#242424",
                border: "1px solid #d1d1d1",
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div style={{ padding: "0 24px" }}>
          <p 
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: "#707070",
              fontFamily: "'Inter', sans-serif",
              margin: 0,
            }}
          >
            Are you sure to logout from current session?
          </p>
        </div>
      </Modal>
    </>
  );
};

