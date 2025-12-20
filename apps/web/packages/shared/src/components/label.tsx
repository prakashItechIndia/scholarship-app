import * as React from "react";
import { Label as FluentLabel, ILabelProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface LabelProps extends Omit<ILabelProps, "styles"> {
  required?: boolean;
  children?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <FluentLabel
        componentRef={ref as any}
        className={cn("font-semibold text-sm text-gray-700 mb-1.5 block", className)}
        {...props}
      >
        {children}
        {required && <span className="text-[#B10E1C] ml-1">*</span>}
      </FluentLabel>
    );
  }
);

Label.displayName = "Label";

export { Label };
