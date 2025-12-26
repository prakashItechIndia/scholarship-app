import * as React from "react";
import { DatePicker as FluentDatePicker, IDatePickerProps } from "@fluentui/react";
import { useDarkMode } from "../hooks/useDarkMode";
import { getThemeTokens } from "../config/theme";

export interface DatePickerProps extends IDatePickerProps {
  value?: Date;
  onSelectDate?: (date: Date | null | undefined) => void;
  errorMessage?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ errorMessage, textField, ...props }, ref) => {
    const isDark = useDarkMode();
    
    // Internal styles - maintained within component for consistency (matching Input component exactly)
    const tokens = React.useMemo(() => getThemeTokens(isDark ? 'dark' : 'light'), [isDark]);
    
    const internalStyles = React.useMemo(() => {
      // Use theme tokens for colors
      const borderColor = errorMessage 
        ? (tokens as any).colorStatusDangerBorder2
        : tokens.colorNeutralStroke1;
      
      const backgroundColor = tokens.colorNeutralBackground1;
      const textColor = tokens.colorNeutralForeground1;
      
      return {
        root: {
          margin: 0,
          padding: 0,
        },
        textField: {
          root: {
            margin: 0,
            padding: 0,
          },
          fieldGroup: {
            height: "45px",
            minHeight: "45px",
            maxHeight: "45px",
            borderRadius: tokens.borderRadiusLarge,
            backgroundColor,
            border: `1px solid ${borderColor}`,
            margin: 0,
            padding: 0,
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
            maxHeight: "45px",
            lineHeight: "45px",
            fontSize: tokens.fontSizeBase300,
            color: textColor,
            margin: 0,
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "12px",
            paddingRight: "12px",
          },
        },
      } as any;
    }, [errorMessage, tokens]);

    return (
      <div className="relative w-full" style={{ marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}>
        <FluentDatePicker
          componentRef={ref as any}
          {...props}
          styles={{
            ...internalStyles,
            ...(props.styles as any),
          }}
          className="!m-0 !p-0"
          textField={{
            ...(typeof textField === 'object' ? textField : {}),
          } as any}
          {...props}
        />
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

DatePicker.displayName = "DatePicker";

export { DatePicker };
