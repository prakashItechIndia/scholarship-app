import * as React from "react";
import { Button as FluentButton, ButtonProps as FluentButtonProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export type ButtonProps = Omit<FluentButtonProps, "size" | "appearance"> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "text";
  size?: "default" | "sm" | "lg" | "icon";
  appearance?: FluentButtonProps["appearance"];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, appearance, ...props }, ref) => {
    // Map variant to Fluent UI appearance if not explicitly provided
    const fluentAppearance = appearance || (variant === "default" ? "primary" : variant === "outline" ? "outline" : variant === "secondary" ? "secondary" : variant === "ghost" ? "subtle" : "primary");
    
    // Map size to Fluent UI size if not explicitly provided
    // For "icon" size, use "small" and let className handle the icon styling
    const fluentSize = size === "sm" ? "small" : size === "lg" ? "large" : size === "icon" ? "small" : "medium";

    return (
      <FluentButton
        ref={ref}
        appearance={fluentAppearance}
        size={fluentSize}
        className={cn(className)}
        {...props}
      >
        {children}
      </FluentButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
