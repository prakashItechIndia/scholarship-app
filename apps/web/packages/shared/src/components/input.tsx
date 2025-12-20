import * as React from "react";
import { Input as FluentInput, InputProps as FluentInputProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";
import { useDarkMode } from "../hooks/useDarkMode";
import { getThemeTokens } from "../config/theme";

export interface InputProps extends Omit<FluentInputProps, "type" | "onChange" | "value"> {
  variant?: "default" | "outline" | "filled" | "underline";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  iconClassName?: string;
  type?: "text" | "number" | "email" | "password" | "search" | "tel" | "url" | "date" | "time";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      prefixIcon,
      suffixIcon,
      iconClassName,
      type,
      value,
      onChange,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon;
    const isDark = useDarkMode();

    // Get theme tokens for styling
    const tokens = React.useMemo(() => getThemeTokens(isDark ? 'dark' : 'light'), [isDark]);

    const borderColor = React.useMemo(() => {
      return errorMessage 
        ? (tokens as any).colorStatusDangerBorder2 || "#d13438"
        : tokens.colorNeutralStroke1 || "#d1d5db";
    }, [tokens, errorMessage]);

    const contentAfter = suffixIcon ? (
      <span className={cn("flex items-center", iconClassName)}>{suffixIcon}</span>
    ) : undefined;

    const contentBefore = prefixIcon ? (
      <span className={cn("flex items-center", iconClassName)}>{prefixIcon}</span>
    ) : undefined;

    // Calculate padding - if no prefix/suffix, use 12px, otherwise use 32px for icon space
    const paddingLeft = hasPrefix ? "32px" : "12px";
    const paddingRight = hasSuffix ? "32px" : "12px";

    return (
      <div className="relative w-full">
        {errorMessage && (
          <div 
            className="text-xs mb-1" 
            style={{ 
              fontSize: tokens.fontSizeBase200, 
              color: (tokens as any).colorStatusDangerForeground3 || "#d13438" 
            }}
          >
            {errorMessage}
          </div>
        )}
        <div
          style={{
            position: "relative",
          }}
        >
          <FluentInput
            ref={ref}
            type={type}
            value={value ?? ""}
            onChange={onChange as any}
            contentBefore={contentBefore}
            contentAfter={contentAfter}
            className={cn(className)}
            style={{
              width: "100%",
              border: `1px solid ${borderColor}`,
              borderRadius: tokens.borderRadiusLarge,
              backgroundColor: tokens.colorNeutralBackground1,
              color: tokens.colorNeutralForeground1,
              fontSize: tokens.fontSizeBase300,
              height: "45px",
              minHeight: "45px",
              paddingLeft: paddingLeft,
              paddingRight: paddingRight,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
