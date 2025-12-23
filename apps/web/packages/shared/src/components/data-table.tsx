import * as React from "react";
import { Table, TableProps } from "./table";
import { Pagination, PaginationProps } from "./pagination";
import { Card } from "./card";

export interface DataTableProps extends Omit<TableProps, "data"> {
  /** Table data rows */
  data: any[];
  /** Pagination configuration */
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    showFirstLast?: boolean;
    showPageSize?: boolean;
    showPageNumbers?: boolean;
    maxPageButtons?: number;
  };
  /** Whether to show pagination (default: true if pagination prop is provided) */
  showPagination?: boolean;
  /** Custom className for the Card wrapper */
  cardClassName?: string;
  /** Custom style for the Card wrapper */
  cardStyle?: React.CSSProperties;
  /** Whether the table should be full width (touching both sides) */
  fullWidth?: boolean;
}

/**
 * DataTable - A complete table component with Card wrapper and Pagination
 * 
 * This component combines:
 * - Card wrapper for styling
 * - Table component for displaying data
 * - Pagination component for navigation
 * 
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   pagination={{
 *     currentPage: 1,
 *     totalPages: 10,
 *     pageSize: 10,
 *     totalItems: 100,
 *     onPageChange: setCurrentPage,
 *     onPageSizeChange: setPageSize,
 *   }}
 *   fullWidth={true}
 * />
 * ```
 */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  (
    {
      columns,
      data,
      pagination,
      showPagination,
      cardClassName,
      cardStyle,
      fullWidth = false,
      className,
      ...tableProps
    },
    ref
  ) => {
    const shouldShowPagination = showPagination !== false && pagination && pagination.totalPages > 1;

    const cardStyles: React.CSSProperties = {
      overflow: "hidden",
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: fullWidth ? 0 : "8px",
      width: "100%",
      margin: 0,
      padding: 0,
      boxShadow: "none",
      ...(fullWidth && {
        borderLeft: "none",
        borderRight: "none",
      }),
      ...cardStyle,
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cardClassName}
        style={cardStyles}
      >
        <div style={{ overflowX: "auto", width: "100%", padding: 0, margin: 0, paddingLeft: 0, paddingRight: 0 }}>
          <Table
            columns={columns}
            data={data}
            className={className}
            {...tableProps}
          />
        </div>

        {/* Pagination */}
        {shouldShowPagination && pagination && (
          <div style={{
            padding: "16px",
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
          }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
              pageSizeOptions={pagination.pageSizeOptions}
              showFirstLast={pagination.showFirstLast}
              showPageSize={pagination.showPageSize}
              showPageNumbers={pagination.showPageNumbers}
              maxPageButtons={pagination.maxPageButtons}
            />
          </div>
        )}
      </Card>
    );
  }
);

DataTable.displayName = "DataTable";

