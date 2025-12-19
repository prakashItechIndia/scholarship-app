import * as React from "react";
import { Button } from "./button";
import { Select, SelectItem } from "./select";
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 pt-4 pb-4 flex-wrap",
          className
        )}
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            {startItem}-{endItem} of {totalItems} items
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showPageNumbers && (
            <>
              {showFirstLast && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <ChevronLeft20Regular style={{ marginRight: "-4px" }} />
                    <ChevronLeft20Regular />
                  </span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft20Regular />
              </Button>

              {pageNumbers.map((page, index) => {
                if (index > 0 && pageNumbers[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span style={{ padding: "0 8px", color: "#707070" }}>...</span>
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
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
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight20Regular />
              </Button>
              {showFirstLast && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <ChevronRight20Regular style={{ marginRight: "-4px" }} />
                    <ChevronRight20Regular />
                  </span>
                </Button>
              )}
            </>
          )}
        </div>

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              className="min-w-[60px]"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">Items per page</span>
          </div>
        )}
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

