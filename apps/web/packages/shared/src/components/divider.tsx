import * as React from "react";
import { Separator } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface DividerProps {
  className?: string;
  vertical?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, vertical, ...props }, ref) => {
    return (
      <Separator
        componentRef={ref as any}
        vertical={vertical}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };

