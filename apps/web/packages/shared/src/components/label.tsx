import * as React from "react";
import { Label as FluentLabel, LabelProps as FluentLabelProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface LabelProps extends FluentLabelProps {
  required?: boolean;
  children?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <FluentLabel
        ref={ref}
        className={cn("dark:text-gray-300", className, required && "label-required-red")}
        required={required}
        {...props}
      >
        {required ? <span className="mr-1">{children}</span> : children}
      </FluentLabel>
    );
  }
);

Label.displayName = "Label";

export { Label };
