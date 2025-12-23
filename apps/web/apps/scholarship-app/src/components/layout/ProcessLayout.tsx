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
} from "@fluentui/react-icons";
import { Button, TopNavProps, Popover, PopoverTrigger, PopoverContent, Modal } from "@shared/components";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarLogo } from "../common";
import { PageLayout, SideNavConfig } from "./PageLayout";

interface ProcessLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export const ProcessLayout: React.FC<ProcessLayoutProps> = ({ children, hideSidebar = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);

  // Mock user data - replace with actual user data from context/API
  const userName = "Aakash";
  const userRole = "Administrator";

  const sideNavConfig: SideNavConfig = {
    // logo,
    expanded: false,
    items: [
      {
        icon: <HomeRegular className="w-5 h-5" />,
        label: "Home",
        active: location.pathname === "/home" || location.pathname === "/admin-dashboard",
        onClick: () => { void navigate("/home"); },
      },
      {
        icon: <DocumentOnePageSparkleRegular  className="w-5 h-5" />,
        label: "Process",
        active: location.pathname === "/process",
        onClick: () => { void navigate("/process"); },
      },
      {
        icon: <TaskListSquareAdd24Regular className="w-5 h-5" />,
        label: "Setup",
        active: location.pathname === "/setup",
        onClick: () => { void navigate("/setup"); },
      },
      {
        icon: <PeopleTeam24Regular className="w-5 h-5" />,
        label: "Task",
        active: location.pathname === "/task",
        onClick: () => { void navigate("/task"); },
      },
      {
        icon: <DocumentDataRegular className="w-5 h-5" />,
        label: "Reports",
        active: location.pathname === "/reports",
        onClick: () => { void navigate("/reports"); },
      },
    ],
    footerItems: [
      {
        icon: <QuestionCircleRegular className="w-5 h-5" />,
        label: "Help",
        active: location.pathname === "/help",
        onClick: () => { void navigate("/help"); },
      },
      {
        icon: <SettingsRegular className="w-5 h-5" />,
        label: "Settings",
        active: location.pathname === "/settings",
        onClick: () => { void navigate("/settings"); },
      },
    ],
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
        <Popover 
          open={profilePopoverOpen} 
          onOpenChange={(_, data) => {
            const openState = (data as { open?: boolean })?.open ?? false;
            setProfilePopoverOpen(openState);
          }}
        >
          <PopoverTrigger disableButtonEnhancement>
            
              <div className="w-9 h-9 rounded-full bg-[#C8D1FA] flex items-center justify-center">
                <PersonRegular className="w-5 h-5 text-[#2C3C85]" />
              </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[280px] p-0"
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* User Info Section - Light gray background */}
            <div 
              className="p-4"
              style={{
                // backgroundColor: "#F5F5F5",
                borderBottom: "1px solid #E0E0E0",
                marginLeft: 0,
                marginRight: 0,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "#E5E5E5",
                  }}
                >
                  <PersonRegular className="w-6 h-6" style={{ color: "#707070" }} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span 
                    className="text-sm font-semibold text-gray-900 truncate" 
                    style={{ 
                      fontFamily: "'Inter', sans-serif", 
                      lineHeight: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {userName}
                  </span>
                  <span 
                    className="text-xs font-normal text-gray-500 truncate" 
                    style={{ 
                      fontFamily: "'Inter', sans-serif", 
                      lineHeight: "16px",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div>
              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("My Profile clicked");
                  // Navigate to profile page
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <PersonRegular className="w-5 h-5 flex-shrink-0" style={{ color: "#424242" }} />
                <span 
                  className="text-sm font-normal text-gray-900" 
                  style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    lineHeight: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  My Profile
                </span>
              </button>

              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("Change Password clicked");
                  // Navigate to change password page
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: "1px solid #E0E0E0",
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <LockClosedRegular className="w-5 h-5 flex-shrink-0" style={{ color: "#424242" }} />
                <span 
                  className="text-sm font-normal text-gray-900" 
                  style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    lineHeight: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  Change Password
                </span>
              </button>

              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  paddingBottom: 0,
                }}
              >
                <ArrowExit24Regular className="w-5 h-5 flex-shrink-0" style={{ color: "#B10E1C" }} />
                <span 
                  className="text-sm font-normal text-gray-900" 
                  style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    lineHeight: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    console.log("Logout confirmed");
    // Add logout logic here (clear tokens, redirect, etc.)
    // navigate("/signin");
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
              onClick={handleLogout}
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

