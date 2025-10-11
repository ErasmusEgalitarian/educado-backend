/* eslint-disable no-console */
import {
  useQuery,
  keepPreviousData,
  QueryObserverResult,
} from "@tanstack/react-query";
import {
  SortingState,
  ColumnFiltersState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

import { OpenAPI } from "@/shared/api";
import { fetchHeaders } from "@/shared/config/api-config";

import { buildApiQueryParams } from "../lib/query-params-builder";
import { PaginatedData } from "../types/paginated-data";

/* ----------------------------- Exported types ----------------------------- */

export type RenderMode = "auto" | "client" | "server";
export type ResolvedRenderMode = "client" | "server";
export interface ExtendedPagination extends PaginationState {
  totalItems: number;
  filteredTotalItems?: number;
  totalPages: number;
}

export interface ServerRequestParams extends PaginationState {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
}

/* ------------------------------- Hook types ------------------------------- */

// Common base props for all usage modes
interface BaseUsePaginatedDataProps {
  /** Unique key for React Query caching. Defaults to urlPath if not provided. */
  queryKey?: string | readonly unknown[];
  /** API endpoint path (relative to BASE_URL) */
  urlPath: string;
  /** Strapi fields to select */
  fields?: string[];
  /** Strapi populate configuration for relations */
  populate?: string | string[];
}

// Mode configuration
export interface UsePaginatedDataConfig {
  /**
   * Render mode determines where data processing happens:
   * - "auto": Automatically choose based on data size (default threshold: 1000 items)
   * - "client": Fetch all data once, handle sorting/filtering/pagination in browser
   * - "server": Server-side pagination, sorting, and filtering (best for large datasets)
   */
  renderMode?: RenderMode;
  /** Threshold for auto mode. If total items <= threshold, use client mode. Default: 1000 */
  clientModeThreshold?: number;
}

/**
 * INTEGRATED MODE (with TanStack Table)
 * Use this when the hook is integrated with a TanStack Table instance.
 * The parent component (e.g., DataDisplay) manages all table state.
 *
 * @example
 * ```tsx
 * const table = useReactTable({ ... });
 * const { data, extendedPagination } = usePaginatedData({
 *   urlPath: '/courses',
 *   mode: 'integrated',
 *   tableState: {
 *     pagination: table.getState().pagination,
 *     sorting: table.getState().sorting,
 *     columnFilters: table.getState().columnFilters,
 *     globalFilter: table.getState().globalFilter,
 *   }
 * });
 * ```
 */
interface IntegratedModeProps extends BaseUsePaginatedDataProps {
  mode: "integrated";
  /** TanStack Table state - all required for integrated mode */
  tableState: {
    pagination: PaginationState;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
  };
  config?: UsePaginatedDataConfig;
}

/**
 * STANDALONE MODE (independent usage)
 * Use this for simpler use cases like dropdowns, lists, or components without full table functionality.
 * The hook manages its own pagination state internally.
 *
 * Typically used with client mode to fetch all items at once.
 *
 * @example
 * ```tsx
 * // Simple dropdown - fetch all users
 * const { data, isLoading } = usePaginatedData({
 *   urlPath: '/users',
 *   mode: 'standalone',
 *   config: { renderMode: 'client' } // Fetch all at once
 * });
 *
 * // Paginated list with manual controls
 * const { data, extendedPagination, setPagination } = usePaginatedData({
 *   urlPath: '/users',
 *   mode: 'standalone',
 *   initialPageSize: 25,
 *   config: { renderMode: 'server' } // Server-side pagination
 * });
 * ```
 */
interface StandaloneModeProps extends BaseUsePaginatedDataProps {
  mode: "standalone";
  /** Initial page size for internal pagination. Default: 10 */
  initialPageSize?: number;
  config?: UsePaginatedDataConfig;
}

// Discriminated union for type-safe props
export type UsePaginatedDataProps = IntegratedModeProps | StandaloneModeProps;

// Legacy interface kept for backward compatibility (deprecated)
/** @deprecated Use discriminated union with 'mode' property instead */
export interface LegacyUsePaginatedDataConfig {
  overrideRenderMode?: RenderMode;
  overrideClientModeThreshold?: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  isLoading: boolean; // True only on the very first load
  isFetching: boolean; // True for any subsequent fetch
  error: Error | null;
  extendedPagination: ExtendedPagination;
  setPagination: OnChangeFn<PaginationState>; // For uncontrolled mode
  refetch: () => Promise<QueryObserverResult<PaginatedData<T>>>;
  resolvedMode: ResolvedRenderMode | null;
}

/* ----------------------------- The hook itself ---------------------------- */

export default function usePaginatedData<T>(
  props: UsePaginatedDataProps,
): UsePaginatedDataReturn<T> {
  const { queryKey, urlPath, fields, populate, config } = props;

  // Extract mode-specific props
  const isIntegratedMode = props.mode === "integrated";
  const tableState = isIntegratedMode ? props.tableState : undefined;
  const initialPageSize = !isIntegratedMode
    ? (props.initialPageSize ?? 10)
    : 10;

  // Construct the full base URL for API requests
  const baseUrl = OpenAPI.BASE + urlPath;
  console.debug("usePaginatedData: Using baseUrl:", baseUrl);

  const { renderMode, clientModeThreshold } = config ?? {};

  // Internal state for STANDALONE mode only
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: initialPageSize,
    },
  );

  // Use external state if integrated mode, otherwise use internal state
  const pagination = isIntegratedMode
    ? tableState?.pagination
    : internalPagination;
  const sorting = isIntegratedMode ? tableState?.sorting : [];
  const columnFilters = isIntegratedMode ? tableState?.columnFilters : [];
  const globalFilter = isIntegratedMode ? tableState?.globalFilter : "";

  // --- Mode Resolution ---
  const effectiveMode = renderMode ?? "auto";
  console.debug("usePaginatedData: Effective mode:", effectiveMode);
  const effectiveClientModeThreshold = clientModeThreshold ?? 1000;

  // 1. DETECTION QUERY: Runs only in "auto" mode to determine the total number of items.
  const detectionQuery = useQuery({
    queryKey: [queryKey ?? baseUrl, "detect", fields, populate],
    queryFn: async ({ signal }) => {
      console.debug("usePaginatedData: Auto-detecting mode...");

      // Fetch just one item to get the total count from Strapi's pagination meta
      // NOTE: Detection ignores globalFilter - we want total item count, not filtered count
      const params = buildApiQueryParams(
        { pageIndex: 0, pageSize: 1, globalFilter: undefined },
        fields,
        populate,
      );
      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        signal,
        headers: fetchHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Detection request failed: ${response.statusText}`);
      }
      // We only need the total from Strapi's meta.pagination
      return response.json() as Promise<PaginatedData<T>>;
    },
    enabled: effectiveMode === "auto" && renderMode === undefined, // Only run in auto mode when no override
    staleTime: 1000 * 60 * 5, // Cache the total count for 5 minutes
    retry: 1, // Don't retry detection failures aggressively
  });

  // Determine the final, resolved mode.
  const resolvedMode = useMemo<ResolvedRenderMode | null>(() => {
    // If override is set, use it immediately (don't wait for detection)
    if (renderMode !== undefined && renderMode !== "auto") {
      console.debug(
        `usePaginatedData: Using explicit render mode: ${renderMode}`,
      );
      return renderMode;
    }

    // In auto mode, wait for detection to complete
    if (detectionQuery.isSuccess) {
      const totalElements = detectionQuery.data.meta.pagination.total;
      const newMode =
        totalElements <= effectiveClientModeThreshold ? "client" : "server";
      console.debug(
        `usePaginatedData: Auto-detected mode: ${newMode} (Total: ${String(totalElements)}, Threshold: ${String(effectiveClientModeThreshold)})`,
      );
      return newMode;
    }
    if (detectionQuery.isError) {
      console.debug(
        "Auto-detection failed, defaulting to server mode.",
        detectionQuery.error,
      );
      return "server"; // Default to server on detection failure
    }
    return null; // Still detecting
  }, [
    renderMode,
    detectionQuery.isSuccess,
    detectionQuery.isError,
    detectionQuery.data,
    detectionQuery.error,
    effectiveClientModeThreshold,
  ]);

  // 2. MAIN DATA QUERY: Fetches the actual data based on the resolvedMode.
  const mainQuery = useQuery({
    // The query key is crucial for caching. It changes based on the mode.
    queryKey: [
      queryKey ?? baseUrl, // Default to URL if no key provided. Makes it more difficult to invalidate cache without.
      resolvedMode, // 'client' or 'server'
      fields, // What to fetch from Strapi
      populate, // What relations to populate
      // For server mode, include pagination, sorting, and filtering in the key
      // For client mode, pageSize doesn't matter (we fetch all), so exclude it
      ...(resolvedMode === "server"
        ? [
            {
              pageIndex: pagination?.pageIndex,
              pageSize: pagination?.pageSize,
            },
            sorting,
            columnFilters,
            globalFilter,
          ]
        : []), // Client mode fetches all data once, no need for pagination in key
    ],
    // The query function fetches data based on the current mode and state
    queryFn: async ({ signal }) => {
      console.debug(
        `usePaginatedData: Fetching data in ${String(resolvedMode)} mode`,
        {
          pageIndex: pagination?.pageIndex,
          pageSize: pagination?.pageSize,
          globalFilter,
        },
      );
      let params: URLSearchParams;

      // Handle client vs server mode fetching
      if (resolvedMode === "client") {
        // In client mode, fetch ALL data. The total is known from the detection query.
        // Exclude sorting/filtering as they are client-side only.
        const sizeToFetch =
          detectionQuery.data?.meta.pagination.total ??
          effectiveClientModeThreshold;
        params = buildApiQueryParams(
          {
            pageIndex: 0,
            pageSize: sizeToFetch,
            globalFilter: undefined, // client mode fetches all
          },
          fields,
          populate,
        );
      } else {
        // In server mode, fetch only the current page with sorting/filtering.
        params = buildApiQueryParams(
          {
            pageIndex: pagination?.pageIndex,
            pageSize: pagination?.pageSize,
            sorting,
            columnFilters,
            globalFilter: globalFilter !== "" ? globalFilter : undefined,
          },
          fields,
          populate,
        );
      }
      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        signal,
        headers: fetchHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Data request failed: ${response.statusText}`);
      }
      return response.json() as Promise<PaginatedData<T>>;
    },
    enabled: resolvedMode !== null, // Only run this query once the mode is resolved.
    placeholderData: keepPreviousData, // Shows old data while fetching new, preventing UI flicker.
    staleTime: 0, // Consider data stale immediately - allows invalidation to trigger refetches
  });

  // --- Pagination Reset Logic (for STANDALONE mode only) ---
  // In integrated mode, parent (DataDisplay with useReactTable) handles resets
  const prevSortString = useRef(JSON.stringify(sorting));
  const prevFilterString = useRef(JSON.stringify(columnFilters));
  const prevGlobalFilter = useRef(globalFilter);

  useEffect(() => {
    // Skip reset logic if integrated mode (parent manages it)
    if (isIntegratedMode) return;

    const currentSortString = JSON.stringify(sorting);
    const currentFilterString = JSON.stringify(columnFilters);

    if (
      prevSortString.current !== currentSortString ||
      prevFilterString.current !== currentFilterString ||
      prevGlobalFilter.current !== globalFilter
    ) {
      // Reset to page 0 when filters/sorting change
      if (pagination?.pageIndex !== 0) {
        console.debug(
          "usePaginatedData: Sorting/filtering changed in standalone mode, resetting to page 0.",
        );
        setInternalPagination((p) => ({ ...p, pageIndex: 0 }));
      }
    }

    // Update refs for next comparison
    prevSortString.current = currentSortString;
    prevFilterString.current = currentFilterString;
    prevGlobalFilter.current = globalFilter;
  }, [
    sorting,
    columnFilters,
    globalFilter,
    pagination?.pageIndex,
    isIntegratedMode,
  ]);

  // --- Exposed Setters ---
  const setPaginationCallback: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      // In integrated mode, this is a no-op (parent should manage state)
      // In standalone mode, update internal state
      if (!isIntegratedMode) {
        setInternalPagination((prev) => {
          const newPaginationState =
            typeof updater === "function" ? updater(prev) : updater;

          // If page size changes, always reset to the first page.
          if (newPaginationState.pageSize !== prev.pageSize) {
            console.debug(
              `Page size changed to ${String(newPaginationState.pageSize)}. Resetting to page 0.`,
            );
            return {
              pageSize: newPaginationState.pageSize,
              pageIndex: 0,
            };
          }
          return newPaginationState;
        });
      }
    },
    [isIntegratedMode],
  );

  // Construct the extended pagination object from the query result and local state.
  const extendedPagination = useMemo<ExtendedPagination>(() => {
    const totalItems = mainQuery.data?.meta.pagination.total ?? 0;
    const totalPages = mainQuery.data?.meta.pagination.pageCount ?? 0;
    return {
      pageIndex: pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? initialPageSize,
      totalItems,
      totalPages,
    };
  }, [pagination, mainQuery.data, initialPageSize]);

  return {
    data: mainQuery.data?.data ?? [],
    isLoading: mainQuery.isLoading, // True on first fetch
    isFetching: mainQuery.isFetching, // True on any fetch
    error: detectionQuery.error ?? mainQuery.error,
    extendedPagination,
    setPagination: setPaginationCallback,
    refetch: mainQuery.refetch,
    resolvedMode,
  };
}
