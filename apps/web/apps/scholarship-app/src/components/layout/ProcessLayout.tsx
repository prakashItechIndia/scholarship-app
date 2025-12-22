import {
  AlertRegular,
  ClipboardTaskRegular,
  DataBarVerticalRegular,
  DismissRegular,
  DocumentAddRegular,
  HomeRegular,
  LockClosedRegular,
  PersonRegular,
  QuestionCircleRegular,
  SearchRegular,
  SettingsRegular,
  SignOutRegular,
  WrenchScrewdriverRegular,
} from "@fluentui/react-icons";
import { Button, Modal, Popover, PopoverContent, PopoverTrigger, TopNavProps } from "@shared/components";
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
        icon: <DocumentAddRegular className="w-5 h-5" />,
        label: "Process",
        active: location.pathname === "/process",
        onClick: () => { void navigate("/process"); },
      },
      {
        icon: <WrenchScrewdriverRegular className="w-5 h-5" />,
        label: "Setup",
        active: location.pathname === "/setup",
        onClick: () => { void navigate("/setup"); },
      },
      {
        icon: <ClipboardTaskRegular className="w-5 h-5" />,
        label: "Task",
        active: location.pathname === "/task",
        onClick: () => { void navigate("/task"); },
      },
      {
        icon: <DataBarVerticalRegular className="w-5 h-5" />,
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
      <div className="flex items-center gap-3">
        <div
          onClick={() => console.log("Search clicked")}
          aria-label="Search"
        >
          <SearchRegular className="w-5 h-5 text-gray-600" />
        </div>
        <div
          onClick={() => console.log("Notifications clicked")}
        >
          <AlertRegular className="w-5 h-5 text-gray-600" />
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
            
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            {/* User Info Section - Light gray background */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <PersonRegular className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span 
                    className="text-sm font-semibold text-gray-900 truncate" 
                    style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
                  >
                    {userName}
                  </span>
                  <span 
                    className="text-xs font-normal text-gray-500 truncate" 
                    style={{ fontFamily: "Inter, sans-serif", lineHeight: "16px" }}
                  >
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("My Profile clicked");
                  // Navigate to profile page
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
              >
                <PersonRegular className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span 
                  className="text-sm font-normal text-gray-900" 
                  style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
                >
                  My Profile
                </span>
              </button>
              
              <div className="h-px bg-gray-200 mx-0"></div>

              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("Change Password clicked");
                  // Navigate to change password page
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
              >
                <LockClosedRegular className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span 
                  className="text-sm font-normal text-gray-900" 
                  style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
                >
                  Change Password
                </span>
              </button>
              
              <div className="h-px bg-gray-200 mx-0"></div>

              <button
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 active:bg-red-100 transition-colors text-left focus:outline-none focus:bg-red-50"
              >
                <SignOutRegular className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span 
                  className="text-sm font-normal text-red-600" 
                  style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
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
        title={
          <div className="relative w-full">
            <span className="text-lg leading-6 font-semibold text-gray-900 font-inter">
              Logout
            </span>
            <Button
              variant="ghost"
              onClick={() => setLogoutModalOpen(false)}
              className="absolute top-0 right-0 w-8 h-8 hover:bg-gray-100 rounded"
              aria-label="Close"
            >
              <DismissRegular className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              className="px-4 py-2 text-sm leading-5 font-medium font-inter border-gray-300 text-gray-900"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleLogout}
              className="px-4 py-2 text-sm leading-5 font-medium font-inter bg-[#115ea3] text-white border-none"
            >
              Logout
            </Button>
          </>
        }
      >
        <p className="text-sm leading-5 font-normal text-gray-500 font-inter m-0">
          Are you sure to logout from current session?
        </p>
      </Modal>
    </>
  );
};

