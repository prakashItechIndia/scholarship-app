import * as React from "react";
import {
  Popover,
  PopoverSurface,
  PopoverTrigger,
  type PopoverProps,
} from "@fluentui/react-components";
import { cn } from "../lib/utils";

// Re-export Fluent UI Popover components directly
export { Popover, PopoverSurface, PopoverTrigger };
export type { PopoverProps };

// PopoverContent is an alias for PopoverSurface with default styling
// Fluent UI's PopoverSurface already has default styles (shadow, border, background, etc.)
// We only add custom className if provided, without overriding Fluent UI defaults
export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "end" | "center";
  }
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverSurface 
      ref={ref} 
      tabIndex={-1}
      className={cn(className)} 
      {...props}
    >
      {children}
    </PopoverSurface>
  );
});

PopoverContent.displayName = "PopoverContent";
