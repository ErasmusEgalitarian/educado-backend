import {
  flexRender,
  type Row,
  type Table as ReactTableType,
} from "@tanstack/react-table";

import { TableRow, TableCell } from "@/shared/components/shadcn/table";

import { DataDisplayItem } from "./data-display";

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

  if (isLoading) {
    return <SkeletonRows columnsLength={columnsLength} rowsCount={10} />;
  }

  return <TableRowsBase rows={rows} />;
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

export default DataTableRows;
