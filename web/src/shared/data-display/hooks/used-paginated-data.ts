/* eslint-disable no-console */
import {
    useQuery,
    keepPreviousData,
    QueryObserverResult,
} from "@tanstack/react-query";
import {
    SortingState,
    ColumnFiltersState,
    OnChangeFn,
    PaginationState,
} from "@tanstack/react-table";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

import { ExtendedPagination, RenderMode, ResolvedRenderMode, ServerRequestParams } from "../types/data-display-types";
import { PaginatedData } from "../types/paginated-data";

// Function to convert request parameters to URLSearchParams for Strapi
export const buildApiQueryParams = (
    params: Partial<ServerRequestParams>,
    fields?: string[],
    populate?: string | string[],
): URLSearchParams => {
    const searchParams = new URLSearchParams();

    // Strapi uses 1-based page indexing
    const pageIndex = params.pageIndex ?? 0;
    searchParams.set("pagination[page]", String(pageIndex + 1));
    searchParams.set("pagination[pageSize]", String(params.pageSize ?? 10));

    if (params.sorting !== undefined && params.sorting.length > 0) {
        const sortField = params.sorting[0].id;
        const sortOrder = params.sorting[0].desc ? "desc" : "asc";
        searchParams.set("sort", `${sortField}:${sortOrder}`);
    }

    // Add fields selection if provided
    if (fields !== undefined && fields.length > 0) {
        fields.forEach(field => {
            searchParams.append("fields", field);
        });
    }

    // Add populate if provided
    if (populate !== undefined) {
        if (typeof populate === "string") {
            searchParams.set("populate", populate);
        } else if (Array.isArray(populate) && populate.length > 0) {
            populate.forEach(pop => {
                searchParams.append("populate", pop);
            });
        }
    }

    return searchParams;
};

interface UsePaginatedDataConfig {
    overrideRenderMode?: RenderMode;
    overrideClientModeThreshold?: number;
}

interface UsePaginatedDataProps {
    queryKey?: string | readonly unknown[];
    baseUrl: string;
    config?: UsePaginatedDataConfig;
    initialPageSize?: number;
    externalSorting?: SortingState;
    externalColumnFilters?: ColumnFiltersState;
    fields?: string[];
    populate?: string | string[];
}

interface UsePaginatedDataReturn<T> {
    data: T[];
    isLoading: boolean; // True only on the very first load
    isFetching: boolean; // True for any subsequent fetch
    error: Error | null;
    extendedPagination: ExtendedPagination;
    setPagination: OnChangeFn<PaginationState>;
    refetch: () => Promise<QueryObserverResult<PaginatedData<T>>>;
    resolvedMode: ResolvedRenderMode | null;
}

export default function usePaginatedData<T>({
    queryKey,
    baseUrl,
    config,
    initialPageSize = 10,
    externalSorting = [],
    externalColumnFilters = [],
    fields,
    populate,
}: UsePaginatedDataProps): UsePaginatedDataReturn<T> {
    const { overrideRenderMode, overrideClientModeThreshold } = config ?? {};

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    // --- Mode Resolution ---
    const effectiveMode = overrideRenderMode ?? "auto";
    const effectiveClientModeThreshold =
        overrideClientModeThreshold ?? 1000;

    // 1. DETECTION QUERY: Runs only in "auto" mode to determine the total number of items.
    const detectionQuery = useQuery({
        queryKey: [queryKey ?? baseUrl, "detect", fields, populate],
        queryFn: async ({ signal }) => {
            console.debug("usePaginatedData: Auto-detecting mode...");
            const params = buildApiQueryParams(
                { pageIndex: 0, pageSize: 1 },
                fields,
                populate,
            );
            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                signal,
            });
            if (!response.ok) {
                throw new Error(`Detection request failed: ${response.statusText}`);
            }
            // We only need the total from Strapi's meta.pagination
            return response.json() as Promise<PaginatedData<T>>;
        },
        enabled: effectiveMode === "auto",
        staleTime: 1000 * 60 * 5, // Cache the total count for 5 minutes
        retry: 1, // Don't retry detection failures aggressively
    });

    // Determine the final, resolved mode.
    const resolvedMode = useMemo<ResolvedRenderMode | null>(() => {
        if (effectiveMode !== "auto") {
            return effectiveMode;
        }
        if (detectionQuery.isSuccess) {
            const total = detectionQuery.data.meta.pagination.total;
            const newMode =
                total <= effectiveClientModeThreshold
                    ? "client"
                    : "server";
            console.debug(
                `usePaginatedData: Auto-detected mode: ${newMode} (Total: ${String(total)})`,
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
        effectiveMode,
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
            queryKey ?? baseUrl,
            resolvedMode, // 'client' or 'server'
            fields,
            populate,
            // For server mode, these dependencies trigger a refetch.
            ...(resolvedMode === "server"
                ? [pagination, externalSorting, externalColumnFilters]
                : []),
        ],
        queryFn: async ({ signal }) => {
            let params: URLSearchParams;
            if (resolvedMode === "client") {
                // In client mode, fetch ALL data. The total is known from the detection query.
                const sizeToFetch =
                    detectionQuery.data?.meta.pagination.total ?? effectiveClientModeThreshold;
                params = buildApiQueryParams(
                    {
                        pageIndex: 0,
                        pageSize: sizeToFetch,
                    },
                    fields,
                    populate,
                );
            } else {
                // In server mode, fetch only the current page with sorting/filtering.
                params = buildApiQueryParams(
                    {
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        sorting: externalSorting,
                        columnFilters: externalColumnFilters,
                    },
                    fields,
                    populate,
                );
            }
            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                signal,
            });
            if (!response.ok) {
                throw new Error(`Data request failed: ${response.statusText}`);
            }
            return response.json() as Promise<PaginatedData<T>>;
        },
        enabled: resolvedMode !== null, // Only run this query once the mode is resolved.
        placeholderData: keepPreviousData, // Shows old data while fetching new, preventing UI flicker.
    });

    // --- Pagination Reset Logic ---
    const prevSortString = useRef(JSON.stringify(externalSorting));
    const prevFilterString = useRef(JSON.stringify(externalColumnFilters));

    useEffect(() => {
        const currentSortString = JSON.stringify(externalSorting);
        const currentFilterString = JSON.stringify(externalColumnFilters);

        if (
            prevSortString.current !== currentSortString ||
            prevFilterString.current !== currentFilterString
        ) {
            if (pagination.pageIndex !== 0) {
                console.debug("dataTable",
                    "usePaginatedData: Sorting/filtering changed, resetting to page 0.",
                );
                setPagination((p) => ({ ...p, pageIndex: 0 }));
            }
        }
        prevSortString.current = currentSortString;
        prevFilterString.current = currentFilterString;
    }, [externalSorting, externalColumnFilters, pagination.pageIndex]);

    // --- Exposed Setters and Refetch ---
    const setPaginationCallback: OnChangeFn<PaginationState> = useCallback(
        (updater) => {
            setPagination((prev) => {
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
        },
        [],
    );

    // Construct the extended pagination object from the query result and local state.
    const extendedPagination = useMemo<ExtendedPagination>(() => {
        const totalItems = mainQuery.data?.meta.pagination.total ?? 0;
        const totalPages = mainQuery.data?.meta.pagination.pageCount ?? 0;
        return {
            ...pagination,
            totalItems,
            totalPages,
        };
    }, [pagination, mainQuery.data]);

    return {
        data: mainQuery.data?.data ?? [],
        isLoading: mainQuery.isLoading, // True on first fetch
        isFetching: mainQuery.isFetching, // True on any fetch
        error: (detectionQuery.error ?? mainQuery.error),
        extendedPagination,
        setPagination: setPaginationCallback,
        refetch: mainQuery.refetch,
        resolvedMode,
    };
}
