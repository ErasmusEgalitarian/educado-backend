import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

import { ViewMode } from "./data-display";
import { ExtendedPagination } from "./hooks/used-paginated-data";
import { calculatePages, PageElement } from "./lib/calculate-pages";

interface PaginationBarProperties {
  pagination: ExtendedPagination;
  onChange: (pagination: PaginationState) => void;
  viewMode: ViewMode;
  pageSizePresets?: number[];
  totalItemsPreFiltered?: number; // Total items before filtering for client-mode (for "X of Y (filtered) of Z" display)
  header?: React.ReactNode; // Optional header for additional context.
}

const pagePresets = [10, 25, 50, 100, 250, 500, 1000];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const PaginationBar: React.FC<PaginationBarProperties> = ({
  pagination,
  onChange,
  viewMode,
  pageSizePresets = pagePresets,
  totalItemsPreFiltered = 0, // Total items before filtering
  header,
}) => {
  const { pageIndex, pageSize, totalItems, totalPages } = pagination;
  const { t } = useTranslation();
  // Always show standard page size options, regardless of current total
  // Only filter when we have a massive dataset to avoid showing irrelevant large sizes
  const adjustedPageSizes =
    totalItems > 1000
      ? pageSizePresets.filter((size) => size <= totalItems)
      : pageSizePresets;

  const isTotalItemsPreset = pageSizePresets.includes(totalItems);

  // --- State and Effects ---
  const [pageNumbers, setPageNumbers] = useState<PageElement[]>([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    if (totalPages > 0) {
      setPageNumbers(calculatePages(pageIndex, totalPages));
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

  const activeClass =
    "bg-primary-surface-default text-greyscale-text-negative hover:bg-primary-surface-lighter hover:text-greyscale-text-caption focus-visible:ring-primary-border-subtle";
  const totalItemsDisplay = () => {
    const bold = (value: React.ReactNode) => (
      <span style={{ fontWeight: "bold" }}>{value}</span>
    );

    // Show "X-Y of Z (filtered) of W" when filtering is active
    if (totalItemsPreFiltered !== 0 && totalItemsPreFiltered !== totalItems) {
      return (
        <>
          {bold(itemRange.first)}-{bold(itemRange.last)}{" "}
          <span className="text-muted-foreground"> {t("pagination.of")} </span>
          {bold(totalItems)} <span> ({t("pagination.filtered")}) </span>{" "}
          {t("pagination.of")} {bold(totalItemsPreFiltered)}
        </>
      );
    }

    // Default: show "X-Y of Z"
    return (
      <>
        {bold(itemRange.first)}-{bold(itemRange.last)} {t("pagination.of")}{" "}
        {bold(totalItems)}
      </>
    );
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-background">
      {header}
      <div className="flex w-full items-center justify-between px-4 py-3">
        {/* LEFT SECTION: Item Count */}
        <div className="text-sm text-muted-foreground">
          {totalItemsDisplay()} {t("pagination.items")}
        </div>

        {/* RIGHT SECTION: All Controls */}
        <div className="flex items-center gap-x-6 lg:gap-x-8">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium">
              {viewMode === "table"
                ? t("pagination.rows")
                : t("pagination.items")}{" "}
              {t("pagination.perPage")}
            </p>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {adjustedPageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
                {!isTotalItemsPreset && totalItems > 0 && (
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
                ),
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
