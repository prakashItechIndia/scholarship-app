import * as React from "react";
import { cn } from "../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown";
import { Divider } from "./divider";

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  title?: string;
  search?: React.ReactNode;
  company?: {
    name?: string;
    logoUrl?: string;
    onMoreClick?: () => void;
  };
  userMenuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
  userAvatar?: {
    name?: string;
    role?: string;
    imageUrl?: string;
    badge?: React.ReactNode;
  };
  onGridClick?: () => void;
}

export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  (
    {
      left,
      center,
      right,
      title,
      search,
      company,
      userMenuItems,
      userAvatar,
      onGridClick,
      className,
      ...props
    },
    ref
  ) => {
    const defaultLeft = company ? (
      <div className="flex items-center gap-4">
        <div className="relative w-8 h-8 rounded overflow-hidden">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name || "Company"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {company.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "C"}
            </div>
          )}
        </div>
        {company.name && <span className="text-sm font-semibold">{company.name}</span>}
        {company.onMoreClick && (
          <div
            className="flex items-center justify-center w-4 h-4 cursor-pointer text-gray-500"
            onClick={company.onMoreClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                company.onMoreClick?.();
              }
            }}
          >
            ⋯
          </div>
        )}
      </div>
    ) : null;

    const defaultRight = (
      <>
        {userAvatar && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" style={{ padding: 0, minWidth: "auto", height: "auto" }}>
                  <div className="flex items-center gap-2">
                    <Avatar name={userAvatar.name} size="sm">
                      {userAvatar.imageUrl && (
                        <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.name || ""} />
                      )}
                      {!userAvatar.imageUrl && (
                        <AvatarFallback>
                          {userAvatar.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col gap-0">
                      {userAvatar.name && (
                        <span className="text-xs font-semibold">{userAvatar.name}</span>
                      )}
                      {userAvatar.role && (
                        <span className="text-[10px] text-gray-500">{userAvatar.role}</span>
                      )}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              {userMenuItems && userMenuItems.length > 0 ? (
                <DropdownMenuContent>
                  {userMenuItems.map((item, index) => (
                    <DropdownMenuItem key={index} onClick={item.onClick} icon={item.icon}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent />
              )}
            </DropdownMenu>
            <div className="h-8 w-px">
              <Divider vertical />
            </div>
          </>
        )}
        {onGridClick && (
          <div
            className="flex items-center justify-center w-6 h-6 cursor-pointer text-gray-500"
            onClick={onGridClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onGridClick();
              }
            }}
          >
            ⚏
          </div>
        )}
      </>
    );

    return (
      <header
        ref={ref}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "52px",
          minHeight: "52px",
          paddingLeft: "0px",
          paddingRight: "16px",
          paddingTop: "8px",
          paddingBottom: "8px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 50,
          marginLeft: 0,
        }}
        className={cn(className)}
        {...props}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
          {left || defaultLeft}
          {title && !center && (
            <h1 style={{ fontSize: "16px", fontWeight: 600 }}>{title}</h1>
          )}
        </div>
        {center && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px" }}>
            {center}
          </div>
        )}
        {title && center && (
          <h1 style={{ fontSize: "16px", fontWeight: 600 }}>{title}</h1>
        )}
        {search && (
          <div style={{ maxWidth: "400px", width: "100%" }}>{search}</div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, justifyContent: "flex-end" }}>
          {right || defaultRight}
        </div>
      </header>
    );
  }
);
TopNav.displayName = "TopNav";

