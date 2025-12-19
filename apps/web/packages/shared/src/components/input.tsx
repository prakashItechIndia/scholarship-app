import * as React from "react";
import { TextField, ITextFieldProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface InputProps extends Omit<ITextFieldProps, "type" | "onChange" | "value"> {
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
      className,
      variant = "default",
      prefixIcon,
      suffixIcon,
      iconClassName,
      type,
      value,
      onChange,
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
            className={cn(className)}
            styles={{
              fieldGroup: {
                paddingLeft: hasPrefix ? "32px" : undefined,
                paddingRight: hasSuffix ? "32px" : undefined,
              },
            }}
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
        className={cn(className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

