import * as React from "react";
import { SideNav, SideNavItem, TopNav, TopNavProps } from "@shared/components";
import { cn } from "@shared/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { userManagement } from "@/services/scholarship.service";
import { apiClient } from "../../shared/api-client";

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
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = React.useState<{
    name?: string;
    role?: string;
    imageUrl?: string;
  } | null>(null);

  const hasSideNav = sideNav !== null && sideNav !== undefined;
  const hasTopNav = topNav !== null && topNav !== undefined;

  const sidebarWidth = hasSideNav 
    ? (sideNav?.expanded ? 256 : 56)
    : 0;

  // Fetch user profile when authenticated
  React.useEffect(() => {
    let blobUrl: string | null = null;

    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user?.email) {
        setUserProfile(null);
        return;
      }

      try {
        // Fetch user details including Profile_Image_Path
        const userData = await userManagement.getUserById(user.email);
        
        const profileImagePath =
          (userData as { PROFILE_IMAGE_PATH?: string }).PROFILE_IMAGE_PATH ||
          (userData as { Profile_Image_Path?: string }).Profile_Image_Path ||
          (userData as { profile_image_path?: string }).profile_image_path;

        const userName =
          (userData as { USER_NAME?: string }).USER_NAME ||
          (userData as { User_Name?: string }).User_Name ||
          (userData as { user_name?: string }).user_name ||
          (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email);

        const userRole =
          (userData as { ROLE_NAME?: string }).ROLE_NAME ||
          (userData as { Role_Name?: string }).Role_Name ||
          (userData as { role_name?: string }).role_name ||
          user.role ||
          'User';

        // Construct profile image URL if profile image exists
        let profileImageUrl: string | undefined;
        if (profileImagePath) {
          try {
            // Try to load profile image as blob URL
            const response = await apiClient.get(
              `/user-management/user/${encodeURIComponent(user.email)}/profile-image`,
              {
                responseType: 'blob',
              },
            );
            const contentType = (response.headers['content-type'] as string) || 'image/jpeg';
            const blob = new Blob([response.data as BlobPart], { type: contentType });
            blobUrl = URL.createObjectURL(blob);
            profileImageUrl = blobUrl;
          } catch (imageError) {
            // If image loading fails, just don't set imageUrl
            console.warn('Failed to load profile image:', imageError);
          }
        }

        setUserProfile({
          name: userName,
          role: userRole,
          imageUrl: profileImageUrl,
        });
      } catch (error) {
        console.warn('Failed to fetch user profile:', error);
        // Fallback to basic user info from auth context
        setUserProfile({
          name: (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email) || 'User',
          role: user.role || 'User',
        });
      }
    };

    void fetchUserProfile();

    // Cleanup: revoke blob URL when component unmounts or user changes
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isAuthenticated, user]);

  // Merge user profile into topNav props
  const topNavWithProfile = React.useMemo(() => {
    if (!hasTopNav || !topNav) return topNav;

    // If topNav already has userAvatar, use it; otherwise add from fetched profile
    if (topNav.userAvatar || !userProfile) {
      return topNav;
    }

    return {
      ...topNav,
      userAvatar: {
        name: userProfile.name,
        role: userProfile.role,
        imageUrl: userProfile.imageUrl,
      },
    };
  }, [topNav, userProfile, hasTopNav]);

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
      {hasTopNav && topNavWithProfile && <TopNav {...topNavWithProfile} />}

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

