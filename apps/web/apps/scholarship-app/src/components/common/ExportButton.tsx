import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import {
  ArrowDownload24Regular,
  ChevronDown24Regular,
} from "@fluentui/react-icons";
import { Spinner, SpinnerSize } from "@fluentui/react";

export type ExportFormat = "excel" | "word" | "pdf" | "csv";

export interface ExportOption {
  format: ExportFormat;
  label: string;
  icon?: React.ReactNode;
}

export interface ExportButtonProps {
  /**
   * Array of export options to display in the dropdown
   */
  options?: ExportOption[];
  /**
   * Handler function called when an export option is selected
   */
  onExport: (format: ExportFormat) => void;
  /**
   * Custom button text (default: "Export")
   */
  buttonText?: string;
  /**
   * Custom button style
   */
  buttonStyle?: React.CSSProperties;
  /**
   * Button size - affects height and padding
   */
  size?: "small" | "medium" | "large";
  /**
   * Disable the button
   */
  disabled?: boolean;
  /**
   * Show loading state with spinner
   */
  loading?: boolean;
}

const defaultOptions: ExportOption[] = [
  { format: "excel", label: "Export to Excel" },
  { format: "word", label: "Export to Word" },
];

const sizeStyles = {
  small: {
    height: "32px",
    padding: "0 12px",
    fontSize: "13px",
    iconSize: "16px",
  },
  medium: {
    height: "43px",
    padding: "8px 16px",
    fontSize: "14px",
    iconSize: "16px",
  },
  large: {
    height: "48px",
    padding: "12px 20px",
    fontSize: "16px",
    iconSize: "20px",
  },
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  options = defaultOptions,
  onExport,
  buttonText = "Export",
  buttonStyle,
  size = "medium",
  disabled = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const sizeConfig = sizeStyles[size];
  const isDisabled = disabled || loading;

  const handleExport = (format: ExportFormat) => {
    if (loading) return; // Prevent action during loading
    onExport(format);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen && !loading} onOpenChange={(open) => !loading && setIsOpen(open)}>
      <DropdownMenuTrigger>
        <button
          disabled={isDisabled}
          style={{
            backgroundColor: "#0f6cbd",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: sizeConfig.padding,
            borderRadius: "6px",
            border: "none",
            cursor: isDisabled ? "not-allowed" : "pointer",
            fontSize: sizeConfig.fontSize,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            height: sizeConfig.height,
            opacity: isDisabled ? 0.6 : 1,
            ...buttonStyle,
          }}
        >
          {loading ? (
            <>
              <Spinner
                size={SpinnerSize.small}
                styles={{
                  circle: {
                    borderTopColor: "#FFFFFF",
                    borderBottomColor: "#FFFFFF",
                    borderLeftColor: "#FFFFFF",
                    borderRightColor: "#FFFFFF",
                  },
                }}
              />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <ArrowDownload24Regular
                style={{
                  width: sizeConfig.iconSize,
                  height: sizeConfig.iconSize,
                  color: "#FFFFFF",
                }}
              />
              {buttonText}
              <ChevronDown24Regular
                style={{
                  width: sizeConfig.iconSize,
                  height: sizeConfig.iconSize,
                  color: "#FFFFFF",
                }}
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      {!loading && (
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
            >
              {option.icon && (
                <span style={{ marginRight: "8px" }}>{option.icon}</span>
              )}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ExportButton;

