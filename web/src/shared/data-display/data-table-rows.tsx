import {
  flexRender,
  type Row,
  type Table as ReactTableType,
} from "@tanstack/react-table";
import { memo } from "react";

import { TableRow, TableCell } from "@/shared/components/shadcn/table";

import type { DataDisplayItem } from "./types/data-display-types";

interface DataTableRowsProps<TData extends DataDisplayItem> {
  table: ReactTableType<TData>;
  isLoading: boolean;
}

const DataTableRows = <TData extends DataDisplayItem>({
  table,
  isLoading,
}: Readonly<DataTableRowsProps<TData>>) => {
  const rows = table.getRowModel().rows;
  const columnsLength = table.getAllLeafColumns().length;

  const hasRows = rows.length > 0;

  if (isLoading) {
    return <SkeletonRows columnsLength={columnsLength} rowsCount={10} />;
  }

  if (!hasRows) {
    return <NoResultsRow columnsLength={columnsLength} />;
  }

  return <TableRowsComponent rows={rows} />;
};

// ————————————————
// Subcomponents
// ————————————————

const SkeletonRows = ({
  columnsLength,
  rowsCount,
}: {
  columnsLength: number;
  rowsCount: number;
}) => (
  <>
    {Array.from({ length: rowsCount }, (_, index) => (
      <TableRow key={`skeleton-row-${String(index)}`} className="group">
        {Array.from({ length: columnsLength }, (_, cellIndex) => (
          <TableCell key={`skeleton-cell-${String(cellIndex)}`}>
            <div className="w-[100px] h-[20px] rounded-full bg-muted animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const NoResultsRow = ({ columnsLength }: { columnsLength: number }) => (
  <TableRow>
    <TableCell colSpan={columnsLength} className="h-24 text-center">
      <div className="flex justify-center items-center h-32">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Nothing to see here...
          </h3>
          <p>
            There is nothing to show here... yet. Submit some entries to get
            started.
          </p>
        </div>
      </div>
    </TableCell>
  </TableRow>
);

const TableRowsBase = <TData extends DataDisplayItem>({
  rows,
}: {
  rows: Row<TData>[];
}) => (
  <>
    {rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const TableRowsComponent = memo(TableRowsBase) as typeof TableRowsBase;

export default DataTableRows;
