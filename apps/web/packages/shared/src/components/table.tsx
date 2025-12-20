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
    isResizable?: boolean;
    isSortable?: boolean;
    onRender?: (item?: any, index?: number) => React.ReactNode;
    onRenderHeader?: () => React.ReactNode;
  }[];
  /** Table data rows */
  data: any[];
  /** Additional CSS class name */
  className?: string;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, columns, data }, ref) => {
    return (
      <div ref={ref} className={cn("relative w-full overflow-auto", className)}>
        <FluentTable style={{ width: "100%" }}>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#fafafa" }}>
              {columns.map((col) => (
                <TableHeaderCell 
                  key={col.key} 
                  style={{ 
                    minWidth: col.minWidth, 
                    maxWidth: col.maxWidth,
                    padding: "12px 16px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {col.onRenderHeader ? col.onRenderHeader() : col.name}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#fafafa",
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
                      style={{ 
                        minWidth: col.minWidth, 
                        maxWidth: col.maxWidth,
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#242424",
                        fontFamily: "'Inter', sans-serif",
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
        </FluentTable>
      </div>
    );
  }
);

Table.displayName = "Table";
