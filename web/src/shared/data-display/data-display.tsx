import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";

import { ErrorBoundary } from "../components/error/error-boundary";
import { ErrorDisplay } from "../components/error/error-display";
import { toAppError } from "../lib/error-utilities";

import DataDisplayEmptyState from "./data-display-empty-state";
import DataDisplayToolbar from "./data-display-toolbar";
import DataGrid from "./data-grid";
import DataTable from "./data-table";
import usePaginatedData from "./hooks/used-paginated-data";
import { getDefaultColumnVisibility } from "./lib/visibility-utility";
import PaginationBar from "./pagination-bar";

import type { UsePaginatedDataConfig } from "./hooks/used-paginated-data";
import { useTranslation } from "react-i18next";

/* ----------------------------- Exported types ----------------------------- */

// In order to reference an object (i.e. delete, edit), we NEED an entity with the documentId field. This is what Strapi accept for requests.
export interface DataDisplayItem {
  documentId: string;
  [key: string]: unknown; // We dont care about the other fields for this, this will be inferred by T.
}

export type ViewMode = "table" | "grid";

/* --------------------------- data-display types --------------------------- */

// Base props that are common to all configurations
interface BaseDataDisplayProps<T extends DataDisplayItem> {
  queryKey?: string | readonly unknown[];
  urlPath: string;
  columns: ColumnDef<T>[]; // Always required for sorting/filtering
  initialPageSize?: number;
  fields?: string[];
  populate?: string | string[];
  config?: UsePaginatedDataConfig;
  emptyState?: React.ReactNode;
  className?: string;
}

// Discriminated union based on allowedViewModes
type DataDisplayProps<T extends DataDisplayItem> =
  | (BaseDataDisplayProps<T> & {
      allowedViewModes: "table";
      gridItemRender?: never; // Grid render not allowed for table-only mode
    })
  | (BaseDataDisplayProps<T> & {
      allowedViewModes: "grid" | "both";
      gridItemRender: (item: T) => React.ReactNode; // Required for grid-only or both mode
    });

/* --------------------------- Exported component --------------------------- */

/**
 * A flexible data display component that supports table and/or grid view modes.
 *
 * @template T - The type of data items to display, must extend DataDisplayItem (Strapi entity with at least a documentId field)
 *
 * @param props - The component props
 * @param props.queryKey - Unique key for React Query to cache and manage the data fetching
 * @param props.urlPath - API endpoint path to fetch data from
 * @param props.columns - Column definitions (always required for sorting/filtering)
 * @param props.allowedViewModes - Which view mode(s) to allow: "table", "grid", or "both"
 * @param props.gridItemRender - Render function for grid items (required when allowedViewModes is "grid" or "both")
 * @param props.emptyState - Custom component to display when no data is available
 * @param props.className - Additional CSS classes to apply to the container
 * @param props.initialPageSize - Number of items per page (default: 20)
 * @param props.fields - Strapi fields to select in the query
 * @param props.populate - Strapi population configuration for related data
 * @param props.config - Additional configuration for data fetching (render mode, threshold)
 *
 * @returns A data display component with pagination, search, and view mode switching
 *
 * @example
 * // Table only
 * <DataDisplay
 *   queryKey={['courses']}
 *   urlPath="/courses"
 *   columns={courseColumns}
 *   allowedViewModes="table"
 * />
 *
 * @example
 * // Grid only
 * <DataDisplay
 *   queryKey={['courses']}
 *   urlPath="/courses"
 *   columns={courseColumns}
 *   allowedViewModes="grid"
 *   gridItemRender={(course) => <CourseCard course={course} />}
 * />
 *
 * @example
 * // Both modes with switcher
 * <DataDisplay
 *   queryKey={['courses']}
 *   urlPath="/courses"
 *   columns={courseColumns}
 *   allowedViewModes="both"
 *   gridItemRender={(course) => <CourseCard course={course} />}
 *   initialPageSize={20}
 * />
 */
export const DataDisplay = <T extends DataDisplayItem>({
  queryKey,
  urlPath,
  columns,
  gridItemRender,
  allowedViewModes,
  emptyState,
  className,
  initialPageSize = 20,
  fields,
  populate,
  config,
}: DataDisplayProps<T>) => {
  const { t } = useTranslation();
  const hasTable = allowedViewModes === "table" || allowedViewModes === "both";
  const hasGrid = allowedViewModes === "grid" || allowedViewModes === "both";

  // Determine initial view mode based on allowed modes
  const getInitialViewMode = (): ViewMode => {
    if (allowedViewModes === "table") return "table";
    if (allowedViewModes === "grid") return "grid";
    return "grid"; // Default to grid when both are allowed
  };

  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode());

  // TanStack Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getDefaultColumnVisibility(columns)
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Fetch data with integrated mode
  const { data, isLoading, error, extendedPagination, resolvedMode, refetch } =
    usePaginatedData<T>({
      mode: "integrated",
      queryKey,
      urlPath,
      fields,
      populate,
      config,
      tableState: {
        pagination,
        sorting,
        columnFilters,
        globalFilter,
      },
    });

  const isUsingServerMode = resolvedMode === "server";


  const getCalculatedPageCount = () => {
    if (isUsingServerMode) {
      return extendedPagination.totalPages;
    }
    return data.length > 0 ? Math.ceil(data.length / pagination.pageSize) : 0;
  };

  // Create TanStack Table instance (drives both table AND grid views)
  // How much Tanstack Table handles, depends on mode (server vs client)
  // In server mode, Tanstack only handles state; data is fetched/processed externally
  // In client mode, Tanstack handles sorting/filtering/pagination internally

  // By having state outside, we can get manual control and pass it to usePaginatedData. etc,
  // while still leveraging TanStack's APIs for modifications.
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination,
    },
    // Core
    getCoreRowModel: getCoreRowModel(),
    // Sorting
    onSortingChange: setSorting,
    getSortedRowModel: isUsingServerMode ? undefined : getSortedRowModel(),
    manualSorting: isUsingServerMode,
    // Filtering
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: isUsingServerMode ? undefined : getFilteredRowModel(),
    manualFiltering: isUsingServerMode,
   
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase();
      if (!searchValue) return true;

      
      const cellValue = row.getValue(columnId);
      if (cellValue != null && String(cellValue).toLowerCase().includes(searchValue)) {
        return true;
      }

      
      const rowData = row.original as Record<string, any>;
      
   
      if (rowData.content_creators && Array.isArray(rowData.content_creators)) {
        for (const creator of rowData.content_creators) {
          const creatorName = `${creator.firstName || ""} ${creator.lastName || ""}`.trim().toLowerCase();
          const creatorEmail = (creator.email || "").toLowerCase();
          if (creatorName.includes(searchValue) || creatorEmail.includes(searchValue)) {
            return true;
          }
        }
      }
      
    
      if (rowData.course_categories && Array.isArray(rowData.course_categories)) {
        for (const category of rowData.course_categories) {
          if (category.name && String(category.name).toLowerCase().includes(searchValue)) {
            return true;
          }
        }
      }

      return false;
    },
    
    onColumnVisibilityChange: setColumnVisibility,
    
    onPaginationChange: setPagination,
    getPaginationRowModel: isUsingServerMode
      ? undefined
      : getPaginationRowModel(),
    manualPagination: isUsingServerMode,
    pageCount: getCalculatedPageCount(),
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
  };

  if (error != null) {
    const appError = toAppError(error);
    return (
      <ErrorDisplay
        error={appError}
        variant="card"
        actions={[
          {
            label: t("common.retry"),
            onClick: () => void refetch(),
            variant: "primary",
          },
        ]}
      />
    );
  }


  const processedRows = table.getRowModel().rows;
  const processedData = processedRows.map((row) => row.original);


  const filteredRows = isUsingServerMode
    ? []
    : table.getFilteredRowModel().rows;


  const displayPagination = isUsingServerMode
    ? extendedPagination // Server mode: use API values directly
    : {

        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalItems: filteredRows.length,
        totalPages: Math.max(
          1,
          Math.ceil(filteredRows.length / pagination.pageSize)
        ),
      };


  const displayedItemCount = isUsingServerMode
    ? data.length
    : processedRows.length;


  const showEmptyState = displayedItemCount === 0 && !isLoading;

  /* --------------------------- Rendered component --------------------------- */
  function getDataComponent(): React.ReactElement {
    if (showEmptyState) {
      return <DataDisplayEmptyState customEmptyState={emptyState} />;
    }

    if (viewMode === "grid") {

      return (
        <DataGrid
          data={processedData as DataDisplayItem[]}
          gridItemRender={
            gridItemRender as
              | ((item: DataDisplayItem) => React.ReactNode)
              | undefined
          }
          isLoading={isLoading}
        />
      );
    }

    return <DataTable table={table} isLoading={isLoading} />;
  }

  return (
    <ErrorBoundary>
      <div className={`space-y-6 ${className ?? ""}`}>
        {/* Toolbar for view mode switching and search */}
        <DataDisplayToolbar
          table={table}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          hasTable={hasTable}
          hasGrid={hasGrid}
          searchValue={globalFilter}
          onSearchChange={handleSearchChange}
        />
        {/* Data display */}
        {getDataComponent()}
        {/* Pagination */}
        <PaginationBar
          pagination={displayPagination}
          onChange={setPagination}
          viewMode={viewMode}
          totalItemsPreFiltered={isUsingServerMode ? 0 : data.length}
        />
      </div>
    </ErrorBoundary>
  );
};
