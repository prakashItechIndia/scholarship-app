import * as React from "react";
import { Button as FluentButton, ButtonProps as FluentButtonProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export type ButtonProps = Omit<FluentButtonProps, "appearance"> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "text";
  appearance?: FluentButtonProps["appearance"];
};

const Button = React.forwardRef<React.ComponentRef<typeof FluentButton>, ButtonProps>(
  ({ className='bg-[#2453C3]', variant, size, children, appearance, ...props }, ref) => {
    return (
      <FluentButton
        ref={ref}
        appearance={appearance}
        size={size}
        className={cn(className)}
        {...(props as FluentButtonProps)}
      >
        {children}
      </FluentButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
