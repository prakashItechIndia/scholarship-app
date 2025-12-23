import * as React from "react";
import { SideNav, SideNavItem, TopNav, TopNavProps } from "@shared/components";
import { cn } from "@shared/lib/utils";

/**
 * PageLayout - A reusable layout component that supports dynamic navigation
 * 
 * Usage Examples:
 * 
 * 1. With both SideNav and TopNav:
 * <PageLayout
 *   sideNav={{ items: [...], footerItems: [...] }}
 *   topNav={{ left: <Logo />, right: <UserMenu /> }}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * 
 * 2. With only SideNav:
 * <PageLayout
 *   sideNav={{ items: [...], footerItems: [...] }}
 *   topNav={null}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * 
 * 3. With only TopNav:
 * <PageLayout
 *   sideNav={null}
 *   topNav={{ left: <Logo />, right: <UserMenu /> }}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * 
 * 4. Without any navigation:
 * <PageLayout
 *   sideNav={null}
 *   topNav={null}
 * >
 *   <YourPageContent />
 * </PageLayout>
 */

export interface SideNavConfig {
  logo?: React.ReactNode;
  expanded?: boolean;
  items?: {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    badge?: React.ReactNode;
  }[];
  footerItems?: {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    badge?: React.ReactNode;
  }[];
}

export interface PageLayoutProps {
  children: React.ReactNode;
  sideNav?: SideNavConfig | null;
  topNav?: TopNavProps | null;
  contentClassName?: string;
  containerClassName?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  sideNav,
  topNav,
  contentClassName,
  containerClassName,
}) => {
  const hasSideNav = sideNav !== null && sideNav !== undefined;
  const hasTopNav = topNav !== null && topNav !== undefined;

  const sidebarWidth = hasSideNav 
    ? (sideNav?.expanded ? 256 : 56)
    : 0;

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-gray-50",
        containerClassName
      )}
      style={{  
        width: "100vw",
        maxWidth: "100vw",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {/* Top Navigation - Renders if topNav is provided */}
      {hasTopNav && <TopNav {...topNav} />}

      {/* Side Navigation - Renders if sideNav is provided */}
      {hasSideNav && sideNav && (
        <SideNav
          logo={sideNav.logo}
          expanded={sideNav.expanded ?? false}
          footer={
            sideNav.footerItems && sideNav.footerItems.length > 0 ? (
              <>
                {sideNav.footerItems.map((item, index) => (
                  <SideNavItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    active={item.active}
                    onClick={item.onClick}
                    badge={item.badge}
                  />
                ))}
              </>
            ) : undefined
          }
        >
          {sideNav.items?.map((item, index) => (
            <SideNavItem
              key={index}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={item.onClick}
              badge={item.badge}
            />
          ))}
        </SideNav>
      )}

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginTop: hasTopNav ? '52px' : '0',
          width: `calc(100vw - ${sidebarWidth}px)`,
          maxWidth: `calc(100vw - ${sidebarWidth}px)`,
          height: hasTopNav 
            ? `calc(100vh - 52px)`
            : '100vh',
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        {/* Page Content */}
        <main 
          className={cn("flex-1 overflow-y-auto overflow-x-hidden", contentClassName)}
          style={{
            width: "100%",
            maxWidth: "100%",
            height: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

PageLayout.displayName = "PageLayout";

