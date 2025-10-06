import {
  flexRender,
  type Header,
  type Table as ReactTableType,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/shared/components/shadcn/button";

import type { DataDisplayItem } from "./types/data-display-types";

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

  return (
    <div className="flex items-center gap-1">
      {(meta?.sortable ?? false) ? (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(isSorted === "asc");
          }}
        >
          <span className="font-semibold">{label}</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <span className="font-semibold">{label}</span>
      )}

      {/* Filtering will be added later when we implement it */}
    </div>
  );
};

export default DataTableHeaderCell;
