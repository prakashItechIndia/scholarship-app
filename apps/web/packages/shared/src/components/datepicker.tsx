import * as React from "react";
import { DatePicker as FluentDatePicker, IDatePickerProps } from "@fluentui/react";

export interface DatePickerProps extends Omit<IDatePickerProps, "styles"> {
  value?: Date;
  onSelectDate?: (date: Date | null | undefined) => void;
  errorMessage?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ errorMessage, textField, ...props }, ref) => {
    // Internal styles - maintained within component for consistency (matching Input component exactly)
    const internalStyles = React.useMemo(() => {
      const borderColor = errorMessage ? "#B10E1C" : "#d1d5db"; // Red border when error, gray otherwise
      
      return {
        textField: {
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
            border: `1px solid ${borderColor}`, // Keep same border on hover
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
        },
      } as any;
    }, [errorMessage]);

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
