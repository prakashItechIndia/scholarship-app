import {
    AlertRegular,
    DataBarVerticalRegular,
    DocumentAddRegular,
    HomeRegular,
    PersonRegular,
    QuestionCircleRegular,
    SearchRegular,
    SettingsRegular,
    LockClosedRegular,
    SignOutRegular,
    DismissRegular,
    WrenchScrewdriverRegular,
    ClipboardTaskRegular,
} from "@fluentui/react-icons";
import { Button, TopNavProps, Popover, PopoverTrigger, PopoverContent, Modal } from "@shared/components";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const userName = "Saravanan";
  const userEmail = "saravanan@gmail.com";

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
    left: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
          LM
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            LEO MUTHU Scholarship
          </span>
          <span className="text-xs text-gray-600">
            An Initiative of ARAM Foundation
          </span>
        </div>
      </div>
    ),
    right: (
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Search clicked")}
          aria-label="Search"
          className="w-10 h-10"
        >
          <SearchRegular className="w-5 h-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Notifications clicked")}
          aria-label="Notifications"
          className="w-10 h-10 relative"
        >
          <AlertRegular className="w-5 h-5 text-gray-600" />
          {/* Notification badge dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-gray-900 rounded-full"></span>
        </Button>
        {/* Vertical separator */}
        <div className="h-6 w-px bg-gray-300"></div>
        <Popover open={profilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
          <PopoverTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 p-0"
              aria-label="User menu"
            >
              <PersonRegular className="w-5 h-5 text-blue-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 rounded-lg shadow-md bg-white z-[9999]">
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#115ea3] flex items-center justify-center text-white text-base font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm leading-5 font-semibold text-gray-900 font-inter">
                    {userName}
                  </span>
                  <span className="text-xs leading-4 font-normal text-gray-500 font-inter">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("My Profile clicked");
                  // Navigate to profile page
                }}
                className="w-full justify-start gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <PersonRegular className="w-5 h-5 text-gray-500" />
                <span className="text-sm leading-5 font-normal text-gray-900">
                  My Profile 
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  console.log("Change Password clicked");
                  // Navigate to change password page
                }}
                className="w-full justify-start gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <LockClosedRegular className="w-5 h-5 text-gray-500" />
                <span className="text-sm leading-5 font-normal text-gray-900">
                  Change Password
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full justify-start gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <SignOutRegular className="w-5 h-5 text-red-600" />
                <span className="text-sm leading-5 font-normal text-red-600">
                  Logout
                </span>
              </Button>
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
              size="icon"
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

