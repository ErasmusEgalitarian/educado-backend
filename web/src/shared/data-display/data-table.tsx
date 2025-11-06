import { type Table as ReactTableType } from "@tanstack/react-table";
import Icon from "@mdi/react";
import { mdiCheck, mdiMinus } from "@mdi/js";

import { useItemSelector } from "@/shared/components/item-selector";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn/table";
import { cn } from "@/shared/lib/utils";

import DataTableHeaderCell from "./data-table-header-cell";
import DataTableRows from "./data-table-rows";

import type { DataDisplayItem } from "./data-display";

interface DataTableProps<TData extends DataDisplayItem> {
  table: ReactTableType<TData>;
  isLoading: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  selectable?: boolean;
}

// Checkbox component for "select all up to limit"
const SelectAllCheckbox = <TData extends DataDisplayItem>({
  table,
}: {
  table: ReactTableType<TData>;
}) => {
  const { selectedIds, selectMultiple, clearSelection, selectionLimit } =
    useItemSelector();

  // Get all available IDs from the current page
  const availableIds = table
    .getRowModel()
    .rows.map((row) => row.original.documentId)
    .filter((id): id is string => id !== undefined && id !== "");

  // Determine how many we can select (up to limit)
  const maxSelectable =
    selectionLimit === null
      ? availableIds.length
      : Math.min(availableIds.length, selectionLimit);

  // Check how many of the available items are selected
  const selectedFromAvailable = availableIds.filter((id) =>
    selectedIds.has(id)
  ).length;

  // All available (up to limit) are selected
  const allSelected =
    selectedFromAvailable > 0 && selectedFromAvailable >= maxSelectable;
  // Some but not all are selected
  const someSelected = selectedFromAvailable > 0 && !allSelected;

  const handleClick = () => {
    if (allSelected || someSelected) {
      // Deselect all
      clearSelection();
    } else {
      // Select up to limit
      const idsToSelect = availableIds.slice(0, maxSelectable);
      selectMultiple(idsToSelect);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border-2 transition-all cursor-pointer",
        allSelected
          ? "border-[#35a1b1] bg-[#35a1b1] text-white"
          : "border-[#c1cfd7] bg-white hover:border-[#35a1b1]"
      )}
      aria-label={allSelected || someSelected ? "Deselect all" : "Select all"}
    >
      {allSelected && <Icon path={mdiCheck} className="h-3 w-3" />}
      {someSelected && <Icon path={mdiMinus} className="h-3 w-3" />}
    </button>
  );
};

const DataTable = <TData extends DataDisplayItem>({
  table,
  isLoading,
  className,
  selectable = false,
  emptyState,
}: Readonly<DataTableProps<TData>>) => {
  return (
    <div className={`rounded-md border ${className ?? ""}`}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {/* Add checkbox column header if selectable */}
              {selectable && (
                <TableHead className="w-12 px-4">
                  <SelectAllCheckbox table={table} />
                </TableHead>
              )}
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <DataTableHeaderCell header={header} table={table} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <DataTableRows
            table={table}
            isLoading={isLoading}
            selectable={selectable}
            emptyState={emptyState}
          />
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
