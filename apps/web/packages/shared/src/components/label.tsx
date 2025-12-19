import * as React from "react";
import { Label as FluentLabel, ILabelProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface LabelProps extends ILabelProps {
  required?: boolean;
  children?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <FluentLabel
        componentRef={ref as any}
        className={cn("text-sm font-medium", className)}
        {...props}
      >
        {children}
        {required && <span className="text-red-700 ml-1">*</span>}
      </FluentLabel>
    );
  },
);

Label.displayName = "Label";

export { Label };

