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
  background: "linear-gradient(to bottom, #020763, #040b80, #07119e)",
  overflowY: "auto",
  overflowX: "hidden",
  position: "fixed",
  // top: 0,
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
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            width: "100%",
            paddingTop: "16px",
            paddingBottom: "16px",
            alignItems: expanded ? "stretch" : "center",
          }}
        >
          {children}
        </nav>
        {footer && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          width: "100%",
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "6px",
          paddingRight: "6px",
          borderRadius: "8px",
          cursor: "pointer",
          position: "relative",
          backgroundColor: active ? "#0e1cdd" : "transparent",
          transition: "background-color 0.2s",
          ...style,
        }}
        className={cn(className)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "rgba(14, 28, 221, 0.2)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        {...props}
      >
        {icon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              color: "#ffffff",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <span
          style={{
            fontSize: "10px",
            lineHeight: "10px",
            color: "#ffffff",
            fontWeight: 400,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {label}
        </span>
        {badge && <span style={{ flexShrink: 0 }}>{badge}</span>}
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
