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



    const contentAfter = suffixIcon ? (
      <span className={cn("flex items-center", iconClassName)}>{suffixIcon}</span>
    ) : undefined;

    const contentBefore = prefixIcon ? (
      <span className={cn("flex items-center", iconClassName)}>{prefixIcon}</span>
    ) : undefined;

    // Calculate padding - if no prefix/suffix, use 12px, otherwise use 32px for icon space
    const paddingLeft = hasPrefix ? "32px" : "0px";
    const paddingRight = hasSuffix ? "32px" : "0px";

    return (
      <div className="relative w-full" style={{ marginTop: 0, paddingTop: 0 }}>
        <div
          style={{
            position: "relative",
          }}
        >
          <FluentInput
            ref={ref}
            appearance="outline"
            type={type}
            value={value ?? ""}
            onChange={onChange as any}
            contentBefore={contentBefore}
            contentAfter={contentAfter}
            className={cn(className)}
            style={{
              width: "100%",
              // border removed to let appearance="outline" handle it
              borderRadius: tokens.borderRadiusLarge,
              backgroundColor: tokens.colorNeutralBackground1,
              color: tokens.colorNeutralForeground1,
              fontSize: tokens.fontSizeBase300,
              // height: "32px",
              // minHeight: "32px",
              paddingLeft: paddingLeft,
              paddingRight: paddingRight,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
            {...props}
          />
        </div>
        {errorMessage && (
          <div 
            className="text-xs mt-1" 
            style={{ 
              fontSize: tokens.fontSizeBase200, 
              color: (tokens as any).colorStatusDangerForeground3 || "#d13438" 
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
