/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { mdiSort, mdiSortAscending, mdiSortDescending } from "@mdi/js";
import { Icon } from "@mdi/react";
import {
  flexRender,
  type Header,
  type Table as ReactTableType,
} from "@tanstack/react-table";

import { Button } from "@/shared/components/shadcn/button";

import ColumnFilterPopup from "./column-filter-popup";
import { DataDisplayItem } from "./data-display";

// This component is used to render the header cell of a data table
const DataTableHeaderCell = <TData extends DataDisplayItem>({
  header,
}: Readonly<{
  header: Header<TData, unknown>;
  table: ReactTableType<TData>;
}>) => {
  const column = header.column;
  const meta = column.columnDef.meta;
  const isSorted = column.getIsSorted();

  if (header.isPlaceholder) return null;

  const label = flexRender(column.columnDef.header, header.getContext());

  // Determine which icon to show based on sort state
  const getSortIcon = () => {
    if (isSorted === "asc") {
      return (
        <Icon path={mdiSortAscending} size={0.7} className="ml-2 h-4 w-4" />
      );
    }
    if (isSorted === "desc") {
      return (
        <Icon path={mdiSortDescending} size={0.7} className="ml-2 h-4 w-4" />
      );
    }
    return <Icon path={mdiSort} size={0.7} className="ml-2 h-4 w-4" />;
  };

  // Determine if filter should show in column header
  const quickFilter = meta?.quickFilter;
  const showFilterInColumn =
    quickFilter &&
    (quickFilter.displayType?.where === "column" ||
      quickFilter.displayType?.where === "both");

  return (
    <div className="flex items-center gap-1">
      {(meta?.sortable ?? false) ? (
        <Button
          variant={isSorted ? "ghost" : "secondary"}
          onClick={() => {
            column.toggleSorting(isSorted === "asc");
          }}
          className="flex items-center"
        >
          <span className="font-semibold">{label}</span>
          {getSortIcon()}
        </Button>
      ) : (
        <span className="font-semibold">{label}</span>
      )}
      {(showFilterInColumn ?? false) && (
        <ColumnFilterPopup column={column} quickFilter={quickFilter} />
      )}
    </div>
  );
};

export default DataTableHeaderCell;
