import * as React from "react";
import { PrimaryButton, DefaultButton, IButtonProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface ButtonProps extends Omit<IButtonProps, "onClick"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "text"
    | "highlight"
    | "cancel"
    | "add";
  size?: "default" | "sm" | "lg" | "icon" | "empty";
  form?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    // Map our custom variants to Fluent UI button types
    const getButtonType = (): "primary" | "default" => {
      switch (variant) {
        case "default":
        case "highlight":
        case "add":
        case "destructive":
          return "primary";
        case "outline":
        case "cancel":
        case "secondary":
        case "ghost":
        case "link":
        case "text":
          return "default";
        default:
          return "primary";
      }
    };

    const buttonType = getButtonType();
    const ButtonComponent = buttonType === "primary" ? PrimaryButton : DefaultButton;

    // Map sizes
    const getStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {};
      
      switch (size) {
        case "sm":
          baseStyles.height = "36px";
          baseStyles.padding = "0 12px";
          break;
        case "lg":
          baseStyles.height = "44px";
          baseStyles.padding = "0 20px";
          break;
        case "icon":
          baseStyles.height = "40px";
          baseStyles.width = "40px";
          baseStyles.padding = "0";
          break;
        case "empty":
          baseStyles.padding = "0";
          break;
        default:
          baseStyles.height = "40px";
          baseStyles.padding = "0 16px";
      }
      
      return baseStyles;
    };

    return (
      <ButtonComponent
        componentRef={ref as any}
        styles={{
          root: getStyles(),
        }}
        className={cn(className)}
        {...(props as any)}
      >
        {children}
      </ButtonComponent>
    );
  },
);

Button.displayName = "Button";

export { Button };

