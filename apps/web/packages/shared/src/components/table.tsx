import * as React from "react";
import {
  Table as FluentTable,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@fluentui/react-components";
import { cn } from "../lib/utils";

/**
 * Table Component - Wrapper around Fluent UI v9 Table components
 * 
 * Uses Fluent UI v9's Table components which provide:
 * - Semantic HTML table structure
 * - Accessibility support
 * - Customizable styling
 * 
 * @see https://react.fluentui.dev/?path=/docs/components-table--default
 */
export interface TableProps {
  /** Table column definitions */
  columns: {
    key: string;
    name: string;
    fieldName?: string;
    minWidth?: number;
    maxWidth?: number;
    width?: string | number;
    cellPaddingLeft?: string | number;
    cellPaddingRight?: string | number;
    isResizable?: boolean;
    isSortable?: boolean;
    style?: React.CSSProperties;
    headerClassName?: string;
    cellClassName?: string;
    onRender?: (item?: any, index?: number) => React.ReactNode;
    onRenderHeader?: () => React.ReactNode;
  }[];
  /** Table data rows */
  data: any[];
  /** Additional CSS class name */
  className?: string;
  /** Disable internal scrolling */
  disableScroll?: boolean;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, columns, data, disableScroll = false }, ref) => {
    return (
      <div ref={ref} className={cn("relative w-full h-full overflow-auto", className)} style={{ padding: 0, margin: 0 }}>
        <FluentTable style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", margin: 0, padding: 0, tableLayout: "auto" }}>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#FAFAFA" }}>
              {columns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  className={cn(col.headerClassName, "hover:bg-[#FAFAFA] hover:text-[#424242]")}
                  style={{
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    width: col.width,
                    height: "2.5rem",
                    paddingLeft: col.cellPaddingLeft !== undefined ? (typeof col.cellPaddingLeft === "number" ? `${col.cellPaddingLeft}px` : col.cellPaddingLeft) : "16px",
                    paddingRight: col.cellPaddingRight !== undefined ? (typeof col.cellPaddingRight === "number" ? `${col.cellPaddingRight}px` : col.cellPaddingRight) : "16px",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#424242",
                    fontFamily: "'Inter', sans-serif",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#FAFAFA",
                    overflow: "auto",
                    minHeight: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.onRenderHeader ? col.onRenderHeader() : col.name}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                style={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #e0e0e0",
                }}
                className="hover:bg-[#f5f5f5]"
                onClick={(e) => {
                  // Prevent row click from triggering any actions
                  // Only specific elements within cells should handle clicks
                  e.stopPropagation();
                }}
              >
                {columns.map((col) => {
                  const fieldName = col.fieldName || col.key;
                  const cellContent = col.onRender
                    ? col.onRender(item, rowIndex)
                    : item[fieldName];

                  return (
                    <TableCell
                      key={col.key}
                      className={col.cellClassName}
                      style={{
                        minWidth: col.minWidth,
                        maxWidth: col.maxWidth,
                        width: col.width,
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        paddingLeft: col.cellPaddingLeft !== undefined ? (typeof col.cellPaddingLeft === "number" ? `${col.cellPaddingLeft}px` : col.cellPaddingLeft) : "16px",
                        paddingRight: col.cellPaddingRight !== undefined ? (typeof col.cellPaddingRight === "number" ? `${col.cellPaddingRight}px` : col.cellPaddingRight) : "16px",
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "#242424",
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: "nowrap",
                        ...col.style,
                        fontWeight: 400,
                      }}
                      onClick={(e) => {
                        // Prevent cell click from triggering actions
                        // Only specific interactive elements should handle clicks
                        e.stopPropagation();
                      }}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </FluentTable >
      </div >
    );
  }
);

Table.displayName = "Table";
