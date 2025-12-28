import * as React from "react";
import {
  PersonRegular,
  KeyRegular,
  ArrowExit24Regular,
} from "@fluentui/react-icons";
import { Popover, PopoverTrigger, PopoverContent, PopoverProps } from "@shared/components";

export interface ProfilePopoverProps {
  userName: string;
  userRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  children: React.ReactNode;
  sidebarWidth?: number;
  positioning?: PopoverProps["positioning"];
}

export const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  userName,
  userRole,
  open,
  onOpenChange,
  onLogout,
  onChangePassword,
  children,
  sidebarWidth = 0,
  positioning = {
    position: "below",
    align: "end",
    offset: { crossAxis: 0, mainAxis: 4 },
  },
}) => {

  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Simple positioning adjustment
  React.useEffect(() => {
    if (!open || sidebarWidth <= 0) return;

    const adjustPosition = () => {
      // Find the popover element
      const popoverElement = popoverRef.current?.closest('[data-popper-placement]') as HTMLElement;
      if (popoverElement) {
        const rect = popoverElement.getBoundingClientRect();
        if (rect.left < sidebarWidth) {
          popoverElement.style.left = `${sidebarWidth}px`;
        }
      }
    };

    const timeoutId = setTimeout(adjustPosition, 50);
    return () => clearTimeout(timeoutId);
  }, [open, sidebarWidth]);

  return (
    <Popover
      open={open}
      onOpenChange={(_, data) => {
        const openState = (data as { open?: boolean })?.open ?? false;
        onOpenChange(openState);
      }}
      positioning={positioning}
    >
      <PopoverTrigger disableButtonEnhancement>
        {children as React.ReactElement}
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="w-[280px]"
        style={{
          borderRadius: "8px",
        }}
      >
        {/* User Info Section */}
        <div
          className="pb-3"
          style={{
            borderBottom: "1px solid #E0E0E0",
            marginLeft: "-16px",
            marginRight: "-16px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0"
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
                  lineHeight: "20px",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#424242",
                }}
              >
                {userName}
              </span>
              <span
                className="text-xs font-normal text-gray-500 truncate"
                style={{
                  lineHeight: "20px",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#424242",
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
              onOpenChange(false);
              console.log("My Profile clicked");
              // Navigate to profile page
            }}
            className="w-full flex items-center gap-2 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <PersonRegular className="w-5 h-5 flex-shrink-0" style={{ color: "#424242" }} />
            <span
              className="text-sm font-normal text-gray-900"
              style={{
                lineHeight: "20px",
                fontSize: "13px",
                fontWeight: 400,
                color: "#424242",
              }}
            >
              My Profile
            </span>
          </button>

          <div
            style={{
              borderBottom: "1px solid #E0E0E0",
              marginLeft: "-16px",
              marginRight: "-16px",
            }}
          >
            <button
              onClick={() => {
                onOpenChange(false);
                onChangePassword();
              }}
              className="w-full flex items-center gap-2 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
              style={{
                fontFamily: "'Inter', sans-serif",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <KeyRegular className="w-5 h-5 flex-shrink-0" style={{ color: "#424242" }} />
              <span
                className="text-sm font-normal text-gray-900"
                style={{
                  lineHeight: "20px",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#424242",
                }}
              >
                Change Password
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              onOpenChange(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus:bg-gray-50"
            style={{
              fontFamily: "'Inter', sans-serif",
              paddingBottom: 0,
            }}
          >
            <ArrowExit24Regular className="w-5 h-5 flex-shrink-0" style={{ color: "#B10E1C" }} />
            <span
              className="text-sm font-normal text-gray-900"
              style={{
                lineHeight: "20px",
                fontSize: "13px",
                fontWeight: 400,
                color: "#424242",
              }}
            >
              Logout
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
