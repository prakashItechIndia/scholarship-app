import * as React from "react";
import { Button, Dropdown, Option, Text } from "@fluentui/react-components";
import {
  ChevronDownRegular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  ChevronDoubleLeft20Regular,
  ChevronDoubleRight20Regular
} from "@fluentui/react-icons";
import { cn } from "../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown";

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
        className={cn("flex flex-row items-center justify-between gap-4", className)}
        style={{ width: "100%", height: "2.5rem", paddingLeft: "1rem", paddingRight: "1rem", position: "relative" }}
      >
        {/* Left: Item count */}
        <div style={{ position: "absolute", left: "1rem" }}>
          <Text className="whitespace-nowrap" style={{ fontSize: "12px", color: "#242424",lineHeight:"16px",fontWeight:"400" }}>
            {startItem}-{endItem} of {totalItems} items
          </Text>
        </div>

        {/* Center: Pagination controls */}
        <div className="flex items-center gap-[3px]" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)",width:"380px",height:"28px" }}>
          {showPageNumbers && (
            <div className="flex items-center gap-[3px]">
              {showFirstLast && (
                <Button
                  appearance="subtle"
                  style={{ minWidth: "1.75rem", maxWidth: "1.75rem", height: "1.75rem", padding: 0, backgroundColor: "#FAFAFA",fontSize: "12px", color: "#242424",lineHeight:"16px",fontWeight:"400" }}
                  icon={<ChevronDoubleLeft20Regular />}
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                />
              )}
              <Button
                appearance="subtle"
                style={{ minWidth: "1.75rem", maxWidth: "1.75rem", height: "1.75rem", padding: 0, backgroundColor: "#FAFAFA" }}
                icon={<ChevronLeft20Regular style={{width:"20px",height:"20px"}}/>}
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
                          minWidth: "1.75rem", maxWidth: "5rem", height: "1.75rem", padding: 0,
                          backgroundColor: currentPage === page ? "#f5f5f5" : "#FAFAFA",
                          fontWeight: currentPage === page ? "bold" : "normal",
                          width:"3rem"
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
                      minWidth: "1.75rem", maxWidth: "4rem", height: "28px", padding: 0,
                      backgroundColor: currentPage === page ? "#FAFAFA" : "#FFFFFF",
                      fontWeight: currentPage === page ? "bold" : "normal",
                      width:"2rem"
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
                style={{ minWidth: "1.75rem", maxWidth: "1.75rem", height: "1.75rem", padding: 0, backgroundColor: "#FAFAFA" }}
                icon={<ChevronRight20Regular style={{width:"20px",height:"20px"}}/>}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              />
              {showFirstLast && (
                <Button
                  appearance="subtle"
                  style={{ minWidth: "1.75rem", maxWidth: "1.75rem", height: "1.75rem", padding: 0, backgroundColor: "#FAFAFA" }}
                  icon={<ChevronDoubleRight20Regular />}
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                />
              )}
            </div>
          )}
        </div>

        {/* Right: Items per page */}

        <div
          className="flex gap-1 items-center w-[49px] h-[28px]"
          style={{ position: "absolute", right: "7rem" }}
        >
          {showPageSize && onPageSizeChange && (
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    style={{
                      minWidth: "6px",
                      padding: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize:"12px",
                      fontWeight:"400",
                      color:"#242424",
                      lineHeight:"16px"
                    }}
                  >
                    {pageSize}
                    <ChevronDownRegular style={{ marginLeft: "4px" }} />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  {pageSizeOptions.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => onPageSizeChange(size)}
                      style={{
                        fontWeight: size === pageSize ? "bold" : "normal",
                        color: size === pageSize ? "#242424" : "#616161",
                      }}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Text style={{ whiteSpace: "nowrap",fontSize:"12px",color:"#242424",lineHeight:"16px",fontWeight:"400",marginLeft:"-2px",marginBottom:"4px" }}>Items per page</Text>
            </div>
          )}
        </div>


      </div >
    );
  }
);

Pagination.displayName = "Pagination";
