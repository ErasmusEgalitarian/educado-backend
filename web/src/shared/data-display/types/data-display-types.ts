import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export type RenderMode = "auto" | "client" | "server";
export type ResolvedRenderMode = "client" | "server";

export type ViewMode = "table" | "grid";

export interface ExtendedPagination extends PaginationState {
  totalItems: number;
  filteredTotalItems?: number;
  totalPages: number;
}

export interface ExtendedPaginationControls {
  pagination: ExtendedPagination;
  setPagination: (pagination: ExtendedPagination) => void;
}

export interface ServerRequestParams extends PaginationState {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
}

export interface DataDisplayItem {
  id: string | number;
  [key: string]: unknown;
}

export interface DataDisplayProps<T extends DataDisplayItem> {
  // Core data props - for usePaginatedData
  queryKey?: string | readonly unknown[];
  baseUrl: string;

  // Display configuration
  columns: ColumnDef<T>[];
  gridItemRender?: (item: T) => React.ReactNode;

  // Customization
  emptyState?: React.ReactNode;
  className?: string;

  // usePaginatedData props
  initialPageSize?: number;
  fields?: string[];
  populate?: string | string[];
  config?: {
    overrideRenderMode?: RenderMode;
    overrideClientModeThreshold?: number;
  };
}

export interface DataDisplayToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

export interface DataGridProps<T extends DataDisplayItem> {
  data: T[];
  gridItemRender?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  className?: string;
}