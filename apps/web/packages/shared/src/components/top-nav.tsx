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
    const defaultRight = (
      <>
        {userAvatar && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button appearance="subtle" style={{ padding: 0, minWidth: "auto", height: "auto" }}>
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
        className={cn(
          "flex items-center justify-between w-full h-[58px] min-h-[52px] pl-0 pr-4 py-2 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 m-0",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="ml-4">{left||''}</div>
          {title && !center && (
            <h1 className="text-base font-semibold">{title}</h1>
          )}
        </div>
        {center && (
          <div className="flex items-center justify-center flex-1 gap-4">
            {center}
          </div>
        )}
        {title && center && (
          <h1 className="text-base font-semibold">{title}</h1>
        )}
        {search && (
          <div className="max-w-[400px] w-full">{search}</div>
        )}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {right || defaultRight}
        </div>
      </header>
    );
  }
);
TopNav.displayName = "TopNav";

