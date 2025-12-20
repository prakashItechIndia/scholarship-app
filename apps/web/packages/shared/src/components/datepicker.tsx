import * as React from "react";
import { DatePicker as FluentDatePicker, IDatePickerProps } from "@fluentui/react";
import { useDarkMode } from "../hooks/useDarkMode";
import { getThemeTokens } from "../config/theme";

export interface DatePickerProps extends Omit<IDatePickerProps, "styles"> {
  value?: Date;
  onSelectDate?: (date: Date | null | undefined) => void;
  errorMessage?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ errorMessage, textField, ...props }, ref) => {
    const isDark = useDarkMode();
    
    // Internal styles - maintained within component for consistency (matching Input component exactly)
    const internalStyles = React.useMemo(() => {
      // Get theme tokens based on dark mode
      const tokens = getThemeTokens(isDark ? 'dark' : 'light');
      
      // Use theme tokens for colors
      const borderColor = errorMessage 
        ? (tokens as any).colorStatusDangerBorder2
        : tokens.colorNeutralStroke1;
      
      const backgroundColor = tokens.colorNeutralBackground1;
      const textColor = tokens.colorNeutralForeground1;
      
      return {
        textField: {
          fieldGroup: {
            height: "45px",
            minHeight: "45px",
            borderRadius: tokens.borderRadiusLarge,
            backgroundColor,
            border: `1px solid ${borderColor}`,
          },
          fieldGroupFocused: {
            border: `1px solid ${borderColor}`, // Keep same border on focus (no color change)
            outline: 'none', // Remove default focus outline
            boxShadow: 'none', // Remove any box shadow on focus
          },
          fieldGroupHover: {
            border: `1px solid ${borderColor}`, // Keep same border on hover
          },
          field: {
            height: "45px",
            minHeight: "45px",
            lineHeight: "45px",
            fontSize: tokens.fontSizeBase300,
            color: textColor,
          },
          errorMessage: {
            fontSize: tokens.fontSizeBase200,
            color: (tokens as any).colorStatusDangerForeground3,
          },
        },
      } as any;
    }, [errorMessage, isDark]);

    return (
      <FluentDatePicker
        componentRef={ref as any}
        styles={internalStyles}
        textField={{
          errorMessage,
          ...(typeof textField === 'object' ? textField : {}),
        } as any}
        {...props}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
