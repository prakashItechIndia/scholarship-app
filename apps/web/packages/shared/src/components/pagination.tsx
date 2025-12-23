import * as React from "react";
import { Button, Dropdown, Option, Text } from "@fluentui/react-components";
import { ChevronLeft20Regular, ChevronRight20Regular } from "@fluentui/react-icons";
import { cn } from "../lib/utils";

export interface PaginationProps {
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
  className?: string;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 50, 100],
      showFirstLast = true,
      showPageSize = true,
      showPageNumbers = true,
      maxPageButtons = 7,
      className,
    },
    ref
  ) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
      if (totalPages <= maxPageButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: number[] = [];
      const half = Math.floor(maxPageButtons / 2);

      if (currentPage <= half + 1) {
        for (let i = 1; i <= maxPageButtons - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - half) {
        pages.push(1);
        for (let i = totalPages - maxPageButtons + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePageSizeChange = React.useCallback(
      (_event: any, data: { optionValue?: string; optionText?: string }) => {
        if (onPageSizeChange && data.optionValue) {
          onPageSizeChange(Number(data.optionValue));
        }
      },
      [onPageSizeChange]
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-row items-center justify-between gap-4 w-full px-4 py-2", className)}
      >
        <div className="flex-1 text-left">
          <Text className="whitespace-nowrap">{startItem}-{endItem} of {totalItems} items</Text>
        </div>

        <div className="flex items-center gap-[3px] justify-center">
          {showPageNumbers && (
            <div className="flex items-center gap-[3px]">
              {showFirstLast && (
                <Button
                  appearance="subtle"
                  style={{ minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0, backgroundColor: "#fff" }}
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  &laquo;
                </Button>
              )}
              <Button
                appearance="subtle"
                style={{ minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0, backgroundColor: "white" }}
                icon={<ChevronLeft20Regular />}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              />

              {pageNumbers.map((page, index) => {
                if (index > 0 && pageNumbers[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <Text style={{ padding: "0 4px", color: "#707070" }}>...</Text>
                      <Button
                        key={page}
                        appearance="subtle"
                        style={{
                          minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0,
                          backgroundColor: currentPage === page ? "#f5f5f5" : "white",
                          fontWeight: currentPage === page ? "bold" : "normal"
                        }}
                        onClick={() => onPageChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                }
                return (
                  <Button
                    key={page}
                    appearance="subtle"
                    style={{
                      minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0,
                      backgroundColor: currentPage === page ? "#f5f5f5" : "white",
                      fontWeight: currentPage === page ? "bold" : "normal"
                    }}
                    onClick={() => onPageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                appearance="subtle"
                style={{ minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0, backgroundColor: "white" }}
                icon={<ChevronRight20Regular />}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              />
              {showFirstLast && (
                <Button
                  appearance="subtle"
                  style={{ minWidth: "32px", maxWidth: "32px", height: "32px", padding: 0, backgroundColor: "white" }}
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  &raquo;
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-end gap-2 items-center">
          {showPageSize && onPageSizeChange && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Dropdown
                value={String(pageSize)}
                onOptionSelect={handlePageSizeChange}
                style={{ minWidth: 60 }}
              >
                {pageSizeOptions.map((size) => (
                  <Option key={size} text={String(size)} value={String(size)}>
                    {size}
                  </Option>
                ))}
              </Dropdown>
              <Text style={{ whiteSpace: "nowrap" }}>Items per page</Text>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";
