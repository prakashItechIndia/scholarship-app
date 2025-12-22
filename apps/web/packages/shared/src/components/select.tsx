import * as React from "react";
import { Dropdown, Option, DropdownProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";
import { useDarkMode } from "../hooks/useDarkMode";
import { getThemeTokens } from "../config/theme";

export interface SelectProps extends Omit<DropdownProps, "onChange" | "value"> {
  options?: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  selectedKey?: string | number;
  placeholder?: string;
  errorMessage?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, onValueChange, options = [], selectedKey, placeholder, errorMessage, ...props }, ref) => {
    const isDark = useDarkMode();
    
    const handleChange = React.useCallback(
      (_event: any, data: { optionValue?: string; optionText?: string }) => {
        if (onValueChange && data.optionValue) {
          onValueChange(data.optionValue);
        }
      },
      [onValueChange]
    );

    // Get theme tokens for styling
    const tokens = React.useMemo(() => getThemeTokens(isDark ? 'dark' : 'light'), [isDark]);

    const borderColor = React.useMemo(() => {
      return errorMessage 
        ? (tokens as any).colorStatusDangerBorder2 || "#d13438"
        : tokens.colorNeutralStroke1 || "#d1d5db";
    }, [tokens, errorMessage]);

    return (
      <div className="relative w-full" style={{ marginTop: 0, paddingTop: 0 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <Dropdown
            ref={ref}
            className={cn(className)}
            placeholder={placeholder}
            selectedOptions={selectedKey ? [String(selectedKey)] : []}
            onOptionSelect={handleChange}
            style={{
              width: "100%",
              border: `1px solid ${borderColor}`,
              borderRadius: tokens.borderRadiusLarge,
              backgroundColor: tokens.colorNeutralBackground1,
              color: tokens.colorNeutralForeground1,
              fontSize: tokens.fontSizeBase300,
              height: "45px",
              minHeight: "45px",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
            {...props}
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Dropdown>
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

Select.displayName = "Select";

export { Select };
