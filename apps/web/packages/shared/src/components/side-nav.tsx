import * as React from "react";
import { cn } from "../lib/utils";

export interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const getSidebarStyles = (expanded: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  width: expanded ? "256px" : "56px",
  minWidth: expanded ? "256px" : "56px",
  height: "calc(100vh - 52px)",
  maxHeight: "calc(100vh - 52px)",
  top: 52,
  backgroundColor: "#2453C3", // Solid dark blue background
  overflowY: "auto",
  overflowX: "hidden",
  position: "fixed",
  left: 0,
  zIndex: 1000,
  paddingTop: "16px",
  paddingBottom: "10px",
  paddingLeft: expanded ? "16px" : "6px",
  paddingRight: expanded ? "16px" : "6px",
  gap: "10px",
  alignItems: expanded ? "flex-start" : "center",
});

export const SideNav = React.forwardRef<HTMLDivElement, SideNavProps>(
  (
    {
      logo,
      children,
      footer,
      expanded = false,
      onToggleExpand,
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        style={{ ...getSidebarStyles(expanded), ...style }}
        className={cn(className)}
        {...props}
      >
        {logo && (
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              width: "100%",
              alignItems: "center",
              gap: expanded ? "12px" : undefined,
              marginBottom: expanded ? "16px" : undefined,
              justifyContent: expanded ? "flex-start" : "center",
              height: expanded ? "auto" : "32px",
            }}
          >
            {expanded ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                  }}
                >
                  {logo}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#ffffff",
                      lineHeight: "1.2",
                    }}
                  >
                    Shri. Leo Muthu Scholarship (LMS)
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: "1.2",
                    }}
                  >
                    An Initiative of ARAM Foundation
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                }}
              >
                {logo}
              </div>
            )}
          </div>
        )}
        <nav className="flex-1 flex flex-col gap-1.5 w-full pt-4 pb-4 items-center">
          {children}
        </nav>
        {footer && (
          <div className="flex flex-col gap-2 items-center w-full justify-center flex-shrink-0 mt-auto pt-4">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);
SideNav.displayName = "SideNav";

export interface SideNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export const SideNavItem = React.forwardRef<HTMLDivElement, SideNavItemProps>(
  (
    { icon, label, active = false, onClick, badge, className, style, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-full py-1 px-2 rounded-lg cursor-pointer transition-colors",
          active ? "bg-[#0A3FBC] !rounded-md" : "bg-transparent hover:bg-[#0A3FBC]/20",
          className
        )}
        style={style}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        {icon && (
          <div className="flex items-center justify-center w-5 h-5 text-white flex-shrink-0">
            {icon}
          </div>
        )}
        <span className="text-[6px] leading-[10px] text-white font-normal text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {label}
        </span>
        {badge && <span className="flex-shrink-0">{badge}</span>}
      </div>
    );
  }
);
SideNavItem.displayName = "SideNavItem";

export interface SideNavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
}

export const SideNavGroup = React.forwardRef<HTMLDivElement, SideNavGroupProps>(
  ({ label, children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginBottom: "16px",
          ...style,
        }}
        className={cn(className)}
        {...props}
      >
        {label && (
          <div
            style={{
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "4px",
              paddingBottom: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </div>
        )}
        {children}
      </div>
    );
  }
);
SideNavGroup.displayName = "SideNavGroup";
