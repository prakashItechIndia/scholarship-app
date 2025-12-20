import * as React from "react";
import { Divider as FluentDivider, DividerProps as FluentDividerProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface DividerProps extends FluentDividerProps {
  className?: string;
  vertical?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, vertical, ...props }, ref) => {
    return (
      <FluentDivider
        ref={ref}
        vertical={vertical}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };
