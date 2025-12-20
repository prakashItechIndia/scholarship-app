import * as React from "react";
import { PrimaryButton, DefaultButton, IButtonProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface ButtonProps extends Omit<IButtonProps, "onClick" | "styles"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "text";
  size?: "default" | "sm" | "lg" | "icon";
  form?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, text, ...props }, ref) => {
    // Internal styles - maintained within component for consistency
    const internalStyles = React.useMemo(() => {
      const baseStyles: any = {
        root: {
          height: size === "sm" ? "32px" : size === "lg" ? "48px" : "40px",
          borderRadius: "6px",
          minWidth: size === "sm" ? "70px" : size === "lg" ? "110px" : "90px",
        },
      };

      if (variant === "outline" || variant === "secondary") {
        baseStyles.root.borderColor = "#d1d5db";
      }

      if (variant === "default" || variant === "destructive") {
        baseStyles.root.backgroundColor = variant === "destructive" ? "#dc2626" : "#1d4ed8";
        baseStyles.rootDisabled = {
          backgroundColor: variant === "destructive" ? "#dc2626" : "#1d4ed8",
          opacity: 0.7,
        };
      }

      return baseStyles;
    }, [variant, size]);

    // Map variants to Fluent UI button types
    const ButtonComponent = variant === "default" || variant === "destructive" ? PrimaryButton : DefaultButton;
    const displayText = text || children;

    return (
      <ButtonComponent
        componentRef={ref as any}
        styles={internalStyles}
        {...(props as any)}
      >
        {displayText}
      </ButtonComponent>
    );
  }
);

Button.displayName = "Button";

export { Button };
