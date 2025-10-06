"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

import DataTableBase from "./data-table-base";

import type { DataDisplayItem } from "./types/data-display-types";

interface DataTableProps<T extends DataDisplayItem> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  className?: string;
}

const DataTable = <T extends DataDisplayItem>({
  data,
  columns,
  isLoading,
  className,
}: Readonly<DataTableProps<T>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Create the table instance using TanStack Table
  // For now, we'll use client-side mode (server mode can be added later)
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    // For now, let TanStack handle everything client-side
    // Later we can add manualSorting/manualFiltering based on renderMode
    manualSorting: false,
    manualFiltering: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Note: Filtering will be added later
  });

  return (
    <div className={className}>
      <DataTableBase table={table} isLoading={isLoading ?? false} />
    </div>
  );
};

export default DataTable;
