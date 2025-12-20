import * as React from "react";
import { Dropdown, IDropdownProps, IDropdownOption } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface SelectProps extends Omit<IDropdownProps, "onChange" | "options" | "styles"> {
  options?: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  selectedKey?: string | number;
  placeholder?: string;
  errorMessage?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, onValueChange, options = [], selectedKey, placeholder, errorMessage, ...props }, ref) => {
    const handleChange = React.useCallback(
      (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (onValueChange && option) {
          onValueChange(String(option.key));
        }
      },
      [onValueChange]
    );

    const dropdownOptions: IDropdownOption[] = options.map((opt) => ({
      key: opt.value,
      text: opt.label,
    }));

    // Internal styles - maintained within component for consistency (matching Input component)
    const internalStyles = React.useMemo(() => {
      const borderColor = errorMessage ? "#B10E1C" : "#d1d5db"; // Red border when error, gray otherwise
      
      return {
        dropdown: {
          width: "100%",
        },
        root: {
          width: "100%",
        },
        title: {
          height: "45px",
          minHeight: "45px",
          lineHeight: "45px",
          borderRadius: "6px",
          border: `1px solid ${borderColor}`, // Use border shorthand for consistency
          backgroundColor: "#ffffff",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
        },
        titleHovered: {
          border: `1px solid ${borderColor}`, // Keep same border on hover
        },
        titleFocused: {
          border: `1px solid ${borderColor}`, // Keep same border on focus (no color change)
          outline: 'none', // Remove default focus outline
          boxShadow: 'none', // Remove any box shadow on focus
        },
        caretDown: {
          fontSize: "14px",
          lineHeight: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        dropdownItem: {
          fontSize: "14px",
        },
        errorMessage: {
          fontSize: "12px",
          color: "#B10E1C",
        },
      } as any;
    }, [errorMessage]);

    return (
      <Dropdown
        componentRef={ref as any}
        className={cn(className)}
        options={dropdownOptions}
        selectedKey={selectedKey}
        onChange={handleChange}
        placeholder={placeholder}
        errorMessage={errorMessage}
        styles={internalStyles}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export { Select };
