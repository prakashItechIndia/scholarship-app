import * as React from "react";
import { Combobox, Option, ComboboxProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";
import { useDarkMode } from "../hooks/useDarkMode";
import { getThemeTokens } from "../config/theme";

export interface SelectProps extends Omit<ComboboxProps, "onChange" | "value"> {
  options?: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  selectedKey?: string | number;
  placeholder?: string;
  errorMessage?: string;
}

const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  ({ className, onValueChange, options = [], selectedKey, placeholder, errorMessage, ...props }, ref) => {
    const isDark = useDarkMode();

    // Get the selected option's label for display
    const selectedOption = React.useMemo(() => {
      if (!selectedKey || options.length === 0) {
        return null;
      }
      const keyStr = String(selectedKey);
      return options.find(opt => String(opt.value) === keyStr);
    }, [selectedKey, options]);

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
          <Combobox
            ref={ref}
            className={cn(className)}
            placeholder={placeholder}
            value={selectedOption?.label || ''}
            selectedOptions={selectedOption ? [String(selectedOption.value)] : []}
            onOptionSelect={handleChange}
            size="small"
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: "10%",
              border: `1px solid ${borderColor}`,
              borderRadius: tokens.borderRadiusLarge,
              backgroundColor: tokens.colorNeutralBackground1,
              color: tokens.colorNeutralForeground1,
              fontSize: tokens.fontSizeBase300,
              height: "32px",
              minHeight: "30px",
              maxHeight: "40px",
              // paddingLeft: "12px",
              // paddingRight: "12px",
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
          </Combobox>
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
