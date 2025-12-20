import * as React from "react";
import { Popover as FluentPopover, PopoverSurface, PopoverTrigger, PopoverProps as FluentPopoverProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface PopoverProps extends Omit<FluentPopoverProps, "open" | "onOpenChange"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Popover = ({ open, onOpenChange, children, ...props }: PopoverProps) => {
  return (
    <FluentPopover
      open={open}
      onOpenChange={(_, data) => onOpenChange?.(data.open || false)}
      {...props}
    >
      {children}
    </FluentPopover>
  );
};

Popover.displayName = "Popover";

const PopoverTriggerComponent = PopoverTrigger;
PopoverTriggerComponent.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "end" | "center";
  }
>(({ className, children, align, ...props }, ref) => {
  return (
    <PopoverSurface ref={ref} className={cn("z-50 w-72 rounded-md border bg-white p-4 shadow-md", className)} {...props}>
      {children}
    </PopoverSurface>
  );
});

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTriggerComponent as PopoverTrigger, PopoverContent };
