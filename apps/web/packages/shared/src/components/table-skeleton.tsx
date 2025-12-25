import * as React from "react";
import {
  Table as FluentTable,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@fluentui/react-components";
import { Skeleton } from "./skeleton";

export interface TableSkeletonProps {
  /** Number of columns to display */
  columnCount?: number;
  /** Number of rows to display (default: 5) */
  rowCount?: number;
  /** Column widths - array of minWidth values matching actual table columns */
  columnWidths?: (number | string)[];
  /** Show checkbox column */
  showCheckbox?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * TableSkeleton - Reusable skeleton component for table loading states
 * Matches the exact structure of the Table component for consistent UI
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnCount = 5,
  rowCount = 5,
  columnWidths = [],
  showCheckbox = false,
  className,
}) => {
  // Get column width for a specific index
  const getColumnWidth = (index: number): number | string | undefined => {
    if (showCheckbox && index === 0) {
      return 48; // Checkbox column width
    }
    const widthIndex = showCheckbox ? index - 1 : index;
    return columnWidths[widthIndex] || undefined;
  };

  return (
    <div className={className} style={{ padding: 0, margin: 0 }}>
      <FluentTable style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", margin: 0, padding: 0, tableLayout: "auto" }}>
        <TableHeader>
          <TableRow style={{ backgroundColor: "#FAFAFA" }}>
            {showCheckbox && (
              <TableHeaderCell
                style={{
                  minWidth: 48,
                  maxWidth: 48,
                  height: "2.5rem",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  fontSize: "12px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  color: "#424242",
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Skeleton 
                  width={16} 
                  height={16} 
                  variant="square"
                  style={{ backgroundColor: "#d1d5db" }}
                />
              </TableHeaderCell>
            )}
            {Array.from({ length: columnCount }).map((_, index) => {
              const colIndex = showCheckbox ? index + 1 : index;
              const width = getColumnWidth(colIndex);
              return (
                <TableHeaderCell
                  key={index}
                  style={{
                    minWidth: width,
                    maxWidth: width,
                    height: "2.5rem",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#424242",
                    fontFamily: "'Inter', sans-serif",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  <Skeleton 
                    width={width ? (typeof width === 'number' ? `${width * 0.6}px` : '60%') : "80px"} 
                    height={16} 
                    variant="rounded"
                    style={{ backgroundColor: "#e5e7eb" }}
                  />
                </TableHeaderCell>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              style={{
                backgroundColor: "transparent",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              {showCheckbox && (
                <TableCell
                  style={{
                    minWidth: 48,
                    maxWidth: 48,
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Skeleton 
                    width={16} 
                    height={16} 
                    variant="square"
                    style={{ backgroundColor: "#d1d5db" }}
                  />
                </TableCell>
              )}
              {Array.from({ length: columnCount }).map((_, colIndex) => {
                const cellIndex = showCheckbox ? colIndex + 1 : colIndex;
                const width = getColumnWidth(cellIndex);
                return (
                  <TableCell
                    key={colIndex}
                    style={{
                      minWidth: width,
                      maxWidth: width,
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      fontSize: "13px",
                      lineHeight: "20px",
                      color: "#242424",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <Skeleton 
                      width={width ? (typeof width === 'number' ? `${Math.min(width * 0.7, 120)}px` : '70%') : "100px"} 
                      height={16} 
                      variant="rounded"
                      style={{ backgroundColor: "#e5e7eb" }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </FluentTable>
    </div>
  );
};

TableSkeleton.displayName = "TableSkeleton";

