/* eslint-disable @typescript-eslint/naming-convention */
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/shared/components/shadcn/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/shared/components/shadcn/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";
import type { PaginationState } from "@tanstack/react-table";

import type { ExtendedPagination } from "./types/data-display-types";

interface PaginationBarProperties {
  pagination: ExtendedPagination;
  onChange: (pagination: PaginationState) => void;
  pageSizePresets?: number[];
  totalItemsPreFiltered?: number; // Optional prop for total items before filtering.
  header?: React.ReactNode; // Optional header for additional context.
}

type PageElement = number | "...";

const calculatePageNumbers = (
  currentPage: number,
  totalPages: number
): PageElement[] => {
  const maxPageNumbersToShow = 7;
  let pages: PageElement[];

  if (totalPages <= maxPageNumbersToShow) {
    pages = Array.from<number>({ length: totalPages }).map((_, index) => index);
  } else {
    pages = Array.from<PageElement>({ length: maxPageNumbersToShow }).fill(0);
    pages[0] = 0;
    pages[maxPageNumbersToShow - 1] = totalPages - 1;

    if (currentPage <= 3) {
      for (let index = 1; index < maxPageNumbersToShow - 2; index++) {
        pages[index] = index;
      }
      pages[maxPageNumbersToShow - 2] = "...";
    } else if (currentPage >= totalPages - 4) {
      pages[1] = "...";
      for (
        let index = 2, index_ = totalPages - 5;
        index < maxPageNumbersToShow - 1;
        index++, index_++
      ) {
        pages[index] = index_;
      }
    } else {
      pages[1] = "...";
      pages[maxPageNumbersToShow - 2] = "...";
      pages[2] = currentPage - 1;
      pages[3] = currentPage;
      pages[4] = currentPage + 1;
    }
  }

  return pages;
};

const pagePresets = [10, 25, 50, 100, 250, 500, 1000];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const PaginationBar: React.FC<PaginationBarProperties> = ({
  pagination,
  onChange,
  pageSizePresets = pagePresets,
  totalItemsPreFiltered = 0, // 0 means no filtering applied
  header,
}) => {
  const { pageIndex, pageSize, totalItems, totalPages } = pagination;
  const adjustedPageSizes = pageSizePresets.filter(
    (size) => size <= totalItems || size === totalItems
  );
  const isTotalItemsPreset = pageSizePresets.includes(totalItems);

  if (
    totalItems < pageSizePresets[0] &&
    totalItems > 0 &&
    pageSize !== totalItems
  ) {
    // Force page size to all items when fewer than the smallest preset
    onChange({ pageIndex: 0, pageSize: totalItems });
  }

  // --- State and Effects ---
  const [pageNumbers, setPageNumbers] = useState<PageElement[]>([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    if (totalPages > 0) {
      setPageNumbers(calculatePageNumbers(pageIndex, totalPages));
    } else {
      setPageNumbers([]);
    }
  }, [pageIndex, totalPages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Handlers ---
  const handlePageChange = (page: number) => {
    if (page !== pageIndex) {
      onChange({ pageIndex: page, pageSize });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    onChange({ pageIndex, pageSize: Number(newPageSize) });
  };

  // --- Derived Values ---
  const itemRange = {
    first: totalItems > 0 ? pageIndex * pageSize + 1 : 0,
    last: Math.min((pageIndex + 1) * pageSize, totalItems),
  };

  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < totalPages - 1;

  const activeClass = "bg-primary text-primary-foreground";

  const totalItemsDisplay = () => {
    const bold = (value: React.ReactNode) => (
      <span style={{ fontWeight: "bold" }}>{value}</span>
    );

    if (totalItemsPreFiltered !== 0 && totalItemsPreFiltered !== totalItems) {
      return (
        <>
          {bold(itemRange.first)}-{bold(itemRange.last)}{" "}
          <span className="text-muted-foreground"> of </span>
          {bold(pagination.totalItems)} <span> (filtered) </span> of{" "}
          {bold(totalItemsPreFiltered)}
        </>
      );
    }
    return (
      <>
        {bold(itemRange.first)}-{bold(itemRange.last)} of {bold(totalItems)}
      </>
    );
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-background">
      {header}
      <div className="flex w-full items-center justify-between px-4 py-3">
        {/* LEFT SECTION: Item Count */}
        <div className="text-sm text-muted-foreground">
          {totalItemsDisplay()} items
        </div>

        {/* RIGHT SECTION: All Controls */}
        <div className="flex items-center gap-x-6 lg:gap-x-8">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {adjustedPageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
                {!isTotalItemsPreset && (
                  <SelectItem value={String(totalItems)}>
                    All ({totalItems})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    handlePageChange(pageIndex - 1);
                  }}
                  disabled={!canGoBack}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {/* Page Number Links */}
              {pageNumbers.map((page) =>
                page === "..." ? (
                  <PaginationEllipsis key={`ellipsis-${page}`} />
                ) : (
                  <PaginationItem key={`page-${page.toString()}`}>
                    <PaginationLink
                      onClick={() => {
                        handlePageChange(page);
                      }}
                      isActive={pageIndex === page}
                      className={`h-8 w-8 ${pageIndex === page ? activeClass : ""}`}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    handlePageChange(pageIndex + 1);
                  }}
                  disabled={!canGoForward}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Scroll to Top Button (conditionally rendered) */}
          {showScrollToTop && (
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="hidden lg:flex"
            >
              Scroll to top <ChevronUp className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginationBar;
