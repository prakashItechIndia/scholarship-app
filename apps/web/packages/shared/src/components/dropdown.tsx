import * as React from "react";
import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface DropdownMenuProps extends Omit<MenuProps, "open" | "onOpenChange" | "children"> {
  children: React.ReactElement | [React.ReactElement, React.ReactElement];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = ({ children, open, onOpenChange, ...props }: DropdownMenuProps) => {
  return (
    <Menu open={open} onOpenChange={(_, data) => onOpenChange?.(data.open || false)} {...props}>
      {children}
    </Menu>
  );
};

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = MenuTrigger;
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <MenuPopover>
      <MenuList ref={ref} className={cn(className)} {...props}>
        {children}
      </MenuList>
    </MenuPopover>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactElement; label?: string }
>(({ className, children, icon, label, onClick, ...props }, ref) => {
  return (
    <MenuItem
      ref={ref}
      icon={icon}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {label || children}
    </MenuItem>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
