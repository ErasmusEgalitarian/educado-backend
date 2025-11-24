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
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ErrorBoundary } from "../components/error/error-boundary";
import { ErrorDisplay } from "../components/error/error-display";
import { ItemSelectorProvider } from "../components/item-selector";
import { toAppError } from "../lib/error-utilities";

import DataDisplayEmptyState from "./data-display-empty-state";
import DataDisplayToolbar, {
  ToolbarVisibilityProps,
} from "./data-display-toolbar";
import DataGrid from "./data-grid";
import DataTable from "./data-table";
import usePaginatedData, {
  type UsePaginatedDataConfig,
} from "./hooks/used-paginated-data";
import { type Status, type StaticFilters } from "./lib/query-params-builder";
import { getDefaultColumnVisibility } from "./lib/visibility-utility";
import PaginationBar from "./pagination-bar";

/* ----------------------------- Exported types ----------------------------- */

// In order to reference an object (i.e. delete, edit), we NEED an entity with the documentId field. This is what Strapi accept for requests.
// Note: documentId is optional in Strapi types, so we keep it optional here too
export interface DataDisplayItem {
  documentId?: string;
  [key: string]: unknown; // We dont care about the other fields for this, this will be inferred by T.
}

export type ViewMode = "table" | "grid";

/* -------------------------- Selection configuration ------------------------ */

export interface SelectionConfig<T extends DataDisplayItem> {
  /** Enable item selection */
  enabled: true;
  /** Maximum number of items that can be selected (null = unlimited) */
  limit?: number | null;
  /** Callback when selection changes */
  onChange?: (selectedItems: T[]) => void;
  /** Initially selected item IDs */
  defaultSelected?: string[];
}

export interface NoSelectionConfig {
  enabled?: false;
}

export type DataDisplaySelectionConfig<T extends DataDisplayItem> =
  | SelectionConfig<T>
  | NoSelectionConfig;

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
  toolbarVisibility?: ToolbarVisibilityProps;
  /** Static filters that are always applied to every request (e.g., { author: "me" }) */
  staticFilters?: StaticFilters;
  /** Status: 'published' (default) or 'draft'. Controls which version of documents to fetch. */
  status?: Status;
  selection?: DataDisplaySelectionConfig<T>;
  onFilteredDocumentIds?: (ids: string[]) => void;
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

export interface DataDisplayRef {
  readonly columnFilters: ColumnFiltersState;
  readonly sorting: SortingState;
  readonly globalFilter: string;
  resetFilters: () => void;
  resetSorting: () => void;
  resetGlobalFilter: () => void;
}
/* --------------------------- Exported component --------------------------- */

/**
 * A flexible data display component that supports table and/or grid view modes.
 *
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
const DataDisplayComponent = <T extends DataDisplayItem>(
  {
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
    toolbarVisibility,
    staticFilters,
    status,
    selection,
    onFilteredDocumentIds,
  }: DataDisplayProps<T>,
  ref: React.Ref<DataDisplayRef>
  
) => {
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

  // Expose ref methods
  React.useImperativeHandle(
    ref,
    () => ({
      columnFilters,
      sorting,
      globalFilter,
      resetFilters: () => {
        setColumnFilters([]);
      },
      resetSorting: () => {
        setSorting([]);
      },
      resetGlobalFilter: () => {
        setGlobalFilter("");
      },
    }),
    [columnFilters, sorting, globalFilter]
  );

  // Fetch data with integrated mode
  const { data, isLoading, error, extendedPagination, resolvedMode, refetch } =
    usePaginatedData<T>({
      mode: "integrated",
      queryKey,
      urlPath,
      fields,
      populate,
      config,
      staticFilters,
      status,
      tableState: {
        pagination,
        sorting,
        columnFilters,
        globalFilter,
      },
    });

  const isUsingServerMode = resolvedMode === "server";

  // Pre-calculate pageCount for client mode (needed for table initialization)
  // In client mode, we need to count filtered rows; in server mode, use API value
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
    getRowId: (row, index) => row.documentId ?? `row-${String(index)}`,
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
    // Column visibility
    onColumnVisibilityChange: setColumnVisibility,
    // Pagination
    onPaginationChange: setPagination,
    getPaginationRowModel: isUsingServerMode
      ? undefined
      : getPaginationRowModel(),
    manualPagination: isUsingServerMode, // Only manual in server mode; client mode uses TanStack pagination
    pageCount: getCalculatedPageCount(), // Use pre-calculated pageCount
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value); // TanStack Table handles empty string correctly
  };

  // Selection handler - converts IDs to full items
  const handleSelectionChange = (selectedIds: string[]) => {
    if (selection?.enabled === true && selection.onChange) {
      const selectedItems = data.filter(
        (item) =>
          item.documentId !== undefined &&
          item.documentId !== "" &&
          selectedIds.includes(item.documentId)
      );
      selection.onChange(selectedItems);
    }
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

  // Get processed rows from TanStack Table (respects client-side sorting/filtering in client mode)
  const processedRows = table.getRowModel().rows;
  const processedData = processedRows.map((row) => row.original);

  // Get filtered (but not paginated) rows for calculating total in client mode
  const filteredRows = isUsingServerMode
    ? []
    : table.getFilteredRowModel().rows;

  // Derive the list of items considered "filtered" from the component's perspective.
  const filteredItems: DataDisplayItem[] = isUsingServerMode
    ? (data as DataDisplayItem[])
    : filteredRows.map((r) => r.original);

  // Extract documentId strings and notify parent when they change
  const documentIds = filteredItems
    .map((c) => c.documentId)
    .filter((id): id is string => typeof id === "string");

  useEffect(() => {
    onFilteredDocumentIds?.(documentIds);
    // We join ids for a stable dependency array (array identity changes often)
  }, [onFilteredDocumentIds, documentIds.join(",")]);

  // If there's an error, render an error card
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

  // Calculate display pagination based on mode
  const displayPagination = isUsingServerMode
    ? extendedPagination // Server mode: use API values directly
    : {
        // Client mode: recalculate based on ALL filtered results (before pagination)
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalItems: filteredRows.length,
        totalPages: Math.max(
          1,
          Math.ceil(filteredRows.length / pagination.pageSize)
        ),
      };

  // In client mode, we need to show filtered count; in server mode, use API total
  const displayedItemCount = isUsingServerMode
    ? data.length
    : processedRows.length;

  // Determine if we should show empty state
  // Only show empty state when there's no data AND no filters are applied
  // If filters are active but yield no results, we still show the table/grid structure
  const hasActiveFilters = columnFilters.length > 0 || globalFilter !== "";
  const showEmptyState = data.length === 0 && !isLoading && !hasActiveFilters;

  /* --------------------------- Rendered component --------------------------- */
  function getDataComponent(): React.ReactElement {
    if (showEmptyState) {
      return <DataDisplayEmptyState customEmptyState={emptyState} />;
    }

    if (viewMode === "grid") {
      // Grid uses TanStack's processed data (sorted/filtered in client mode)
      // Show empty state within grid if filtered results are empty
      if (displayedItemCount === 0 && !isLoading) {
        return <DataDisplayEmptyState customEmptyState={emptyState} />;
      }
      return (
        <DataGrid
          data={processedData}
          gridItemRender={gridItemRender}
          isLoading={isLoading}
          selectable={selection?.enabled === true}
        />
      );
    }
    // Table uses the TanStack Table instance directly
    // Table component will handle showing "no results" within the table structure
    return (
      <DataTable
        table={table}
        isLoading={isLoading}
        emptyState={<DataDisplayEmptyState customEmptyState={emptyState} />}
        selectable={selection?.enabled === true}
      />
    );
  }

  const content = (
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
        selectable={selection?.enabled === true}
        visibility={toolbarVisibility}
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
  );

  // Wrap with selection provider if selection is enabled
  if (selection?.enabled === true) {
    return (
      <ErrorBoundary>
        <ItemSelectorProvider
          selectionLimit={selection.limit ?? null}
          onSelectionChange={handleSelectionChange}
          defaultSelected={selection.defaultSelected ?? []}
        >
          {content}
        </ItemSelectorProvider>
      </ErrorBoundary>
    );
  }

  return <ErrorBoundary>{content}</ErrorBoundary>;
};

DataDisplayComponent.displayName = "DataDisplay";

export const DataDisplay = React.forwardRef(DataDisplayComponent) as <
  T extends DataDisplayItem,
>(
  props: DataDisplayProps<T> & React.RefAttributes<DataDisplayRef>
) => ReturnType<typeof DataDisplayComponent>;
