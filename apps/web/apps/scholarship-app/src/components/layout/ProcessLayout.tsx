import {
    AlertRegular,
    DataBarVerticalRegular,
    DocumentAddRegular,
    HomeRegular,
    PeopleRegular,
    PersonRegular,
    QuestionCircleRegular,
    SearchRegular,
    SettingsRegular,
} from "@fluentui/react-icons";
import { Button, Select, TopNavProps } from "@shared/components";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout, SideNavConfig } from "./PageLayout";

interface ProcessLayoutProps {
  children: React.ReactNode;
}

export const ProcessLayout: React.FC<ProcessLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [academicYear, setAcademicYear] = React.useState("2024-2025");

  const sideNavConfig: SideNavConfig = {
    // logo,
    expanded: false,
    items: [
      {
        icon: <HomeRegular />,
        label: "Home",
        active: location.pathname === "/home",
        onClick: () => { void navigate("/home"); },
      },
      {
        icon: <DocumentAddRegular />,
        label: "Process",
        active: location.pathname === "/process",
        onClick: () => { void navigate("/process"); },
      },
      {
        icon: <PeopleRegular />,
        label: "Roles",
        active: location.pathname === "/roles",
        onClick: () => { void navigate("/roles"); },
      },
      {
        icon: <PersonRegular />,
        label: "Users",
        active: location.pathname === "/users",
        onClick: () => { void navigate("/users"); },
      },
      {
        icon: <DataBarVerticalRegular />,
        label: "Reports",
        active: location.pathname === "/reports",
        onClick: () => { void navigate("/reports"); },
      },
    ],
    footerItems: [
      {
        icon: <QuestionCircleRegular />,
        label: "Help",
        active: location.pathname === "/help",
        onClick: () => { void navigate("/help"); },
      },
      {
        icon: <SettingsRegular />,
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
        >
          <SearchRegular className="w-5 h-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Notifications clicked")}
          aria-label="Notifications"
        >
          <AlertRegular className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="min-w-[140px]">
          <Select
            selectedKey={academicYear}
            onValueChange={setAcademicYear}
            options={[
              { value: "2024-2025", label: "Academic year" },
              { value: "2023-2024", label: "2023-2024" },
              { value: "2022-2023", label: "2022-2023" },
            ]}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("User menu clicked")}
          className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          aria-label="User menu"
        >
          U
        </Button>
      </div>
    ),
  };

  return (
    <PageLayout sideNav={sideNavConfig} topNav={topNavConfig}>
      {children}
    </PageLayout>
  );
};

