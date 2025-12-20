import * as React from "react";
import { TextField, ITextFieldProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface InputProps extends Omit<ITextFieldProps, "type" | "onChange" | "value" | "styles" | "className"> {
  variant?: "default" | "outline" | "filled" | "underline";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  iconClassName?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      ...props
    },
    ref
  ) => {
    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon;

    const handleChange = React.useCallback(
      (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (onChange && newValue !== undefined) {
          // Create a synthetic event for compatibility
          const syntheticEvent = {
            target: { value: newValue },
            currentTarget: { value: newValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      },
      [onChange]
    );

    // Internal styles - maintained within component for consistency
    const internalStyles = React.useMemo(() => {
      const borderColor = errorMessage ? "#B10E1C" : "#d1d5db"; // Red border when error, gray otherwise
      
      const baseStyles: any = {
        fieldGroup: {
          height: "45px",
          minHeight: "45px",
          borderRadius: "6px",
          backgroundColor: "#ffffff",
          border: `1px solid ${borderColor}`,
        },
        fieldGroupFocused: {
          border: `1px solid ${borderColor}`, // Keep same border on focus (no color change)
          outline: 'none', // Remove default focus outline
          boxShadow: 'none', // Remove any box shadow on focus
        },
        fieldGroupHover: {
          border: `1px solid ${borderColor}`, // Keep error border on hover
        },
        field: {
          height: "45px",
          minHeight: "45px",
          lineHeight: "45px",
          fontSize: "14px",
        },
        errorMessage: {
          fontSize: "12px",
          color: "#B10E1C",
        },
      };
      
      if (hasPrefix || hasSuffix) {
        baseStyles.fieldGroup = {
          ...baseStyles.fieldGroup,
          paddingLeft: hasPrefix ? "32px" : undefined,
          paddingRight: hasSuffix ? "32px" : undefined,
        };
        baseStyles.fieldGroupFocused = {
          ...baseStyles.fieldGroupFocused,
          paddingLeft: hasPrefix ? "32px" : undefined,
          paddingRight: hasSuffix ? "32px" : undefined,
        };
        baseStyles.fieldGroupHover = {
          ...baseStyles.fieldGroupHover,
          paddingLeft: hasPrefix ? "32px" : undefined,
          paddingRight: hasSuffix ? "32px" : undefined,
        };
      }
      
      return baseStyles;
    }, [hasPrefix, hasSuffix, errorMessage]);

    if (hasPrefix || hasSuffix) {
      return (
        <div className="relative w-full">
          {prefixIcon && (
            <div
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none",
                iconClassName
              )}
            >
              {prefixIcon}
            </div>
          )}
          <TextField
            componentRef={ref as any}
            type={type}
            value={value ?? ""}
            onChange={handleChange}
            errorMessage={errorMessage}
            styles={internalStyles}
            {...props}
          />
          {suffixIcon && (
            <div className={cn("absolute right-2 top-1/2 -translate-y-1/2 z-10", iconClassName)}>
              {suffixIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <TextField
        componentRef={ref as any}
        type={type}
        value={value ?? ""}
        onChange={handleChange}
        errorMessage={errorMessage}
        styles={internalStyles}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
